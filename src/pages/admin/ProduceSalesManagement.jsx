
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  LoaderCircle,
  MoreVertical,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-hot-toast";

import {
  getAdminProductSales,
  ChangeStatus,
} from "../../api/produceSale";
import { getUsers } from "../../api/users";
import { getProducts } from "../../api/products";
import { formatDate } from "../../utils/formatDate";
import { formatMoney } from "../../utils/formatCurrency";
import ProduceSaleDetailsModal from "../../components/producesales/ProduceSalesDetails";

// API ERROR MESSAGE
const getErrorMessage = (error) =>
  error.response?.data?.message || "Unable to process the request.";

// EXTRACT SALES
const getSales = (response) => {
  const payload = response?.data?.data;

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(response?.data?.product_sales)) {
    return response.data.product_sales;
  }

  return [];
};

// EXTRACT USERS
const getUsersList = (response) => {
  const payload = response?.data?.data;

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(response?.data?.users)) {
    return response.data.users;
  }

  return [];
};

// EXTRACT PRODUCTS
const getProductsList = (response) => {
  const payload = response?.data?.data;

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(response?.data?.products)) {
    return response.data.products;
  }

  return [];
};


// NORMALIZE REVIEW STATUS
const normalizeStatus = (status) =>
  String(status || "Pending").toLowerCase() === "resolved"
    ? "Resolved"
    : "Pending";

// PRODUCE AVAILABILITY STATUS
const getAvailability = (sale) => {
  if (sale.status === "Ready Now") return "Ready Now";

  if (sale.ready_at_date) {
    return `On ${formatDate(sale.ready_at_date)}`;
  }

  return sale.status || "Not specified";
};



// STATISTICS CARD
function StatCard({ label, value }) {
  return (
    <div className="rounded-sm border border-border bg-card px-5 py-4">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1.5 text-xl font-bold text-heading">{value}</p>
    </div>
  );
}



export default function ProductSalesManagement() {
  const [sales, setSales] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedSale, setSelectedSale] = useState(null);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  // FETCH SALES, USERS AND PRODUCTS
  const loadSales = useCallback(async (showRefresh = false) => {
    setError("");

    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const [salesResponse, usersResponse, productsResponse] =
        await Promise.all([
          getAdminProductSales(),
          getUsers(),
          getProducts(),
        ]);

      setSales(getSales(salesResponse));
      setUsers(getUsersList(usersResponse));
      setProducts(getProductsList(productsResponse));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadSales();
  }, [loadSales]);

  // MATCH EACH SALE WITH ITS FARMER AND PRODUCT
  const salesWithFarmers = useMemo(() => {
    const usersById = new Map();
    const productsById = new Map();

    users.forEach((user) => {
      const userId = user.id ?? user.user_id;

      if (userId != null) {
        usersById.set(String(userId).trim(), user);
      }
    });

    products.forEach((product) => {
      if (product.id != null) {
        productsById.set(String(product.id).trim(), product);
      }
    });

    return sales.map((sale) => {
      const farmer =
        sale.user ||
        usersById.get(String(sale.user_id ?? "").trim());

      const product =
        sale.product ||
        productsById.get(String(sale.product_id ?? "").trim());

      return {
        ...sale,

        farmer_name:
          farmer?.name ||
          farmer?.user?.name ||
          "Unknown farmer",

        farmer_phone:
          farmer?.profile?.phone ||
          farmer?.user_profile?.phone ||
          farmer?.phone ||
          farmer?.user?.profile?.phone ||
          "-",

        product_name:
          product?.name ||
          product?.product_name ||
          sale.product_name ||
          `Product ${sale.product_id ?? "—"}`,

        product,
      };
    });
  }, [sales, users, products]);

  // FILTER SALES BY REVIEW STATUS, FARMER, PRODUCT OR ID
  const filteredSales = useMemo(() => {
    const query = search.trim().toLowerCase();

    return salesWithFarmers.filter((sale) => {
      const reviewStatus = normalizeStatus(sale.review_status);
      const matchesStatus =
        filter === "All" || reviewStatus === filter;

      const matchesSearch =
        !query ||
        String(sale.id ?? "").toLowerCase().includes(query) ||
        String(sale.farmer_name).toLowerCase().includes(query) ||
        String(sale.farmer_phone).toLowerCase().includes(query) ||
        String(sale.product_name).toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [salesWithFarmers, filter, search]);

  // CALCULATE REVIEW STATISTICS
  const pendingCount = salesWithFarmers.filter(
    (sale) => normalizeStatus(sale.review_status) === "Pending"
  ).length;

  const resolvedCount = salesWithFarmers.filter(
    (sale) => normalizeStatus(sale.review_status) === "Resolved"
  ).length;

  const openDetails = (sale) => setSelectedSale(sale);

  // RESOLVE A PRODUCE SALE REQUEST
  const handleResolve = async (sale) => {
    if (!sale?.id || updatingStatusId !== null) return;

    setUpdatingStatusId(sale.id);

    try {
      const response = await ChangeStatus({ review_status: "Resolved" },sale.id);

      const savedSale =
        response.data?.product_sale ||
        response.data?.data?.product_sale ||
        response.data?.data ||
        {};

      const updatedSale = {...sale,...savedSale,

        // PRESERVE PRODUCE AVAILABILITY
        status: sale.status,
        ready_at_date: sale.ready_at_date,

        // UPDATE REVIEW STATUS
        review_status:
          savedSale.review_status || "Resolved",
      };

      setSales((current) =>
        current.map((item) =>
          String(item.id) === String(sale.id)
            ? updatedSale
            : item
        )
      );

      setSelectedSale((current) =>
        current && String(current.id) === String(sale.id)
          ? updatedSale
          : current
      );

      toast.success("Request resolved successfully.");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setUpdatingStatusId(null);
    }
  };







  return (
    <section className="space-y-5">
      {/* PAGE HEADER */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold text-sidebar">
            Farmers Produce Sales Requests
          </h1>
          <p className="mt-1 text-sm text-muted">
            Manage and review produce sale requests from farmers.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadSales(true)}
          disabled={loading || refreshing}
          className="inline-flex items-center justify-center gap-2 self-start rounded-sm border border-border bg-sidebar px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={refreshing ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* STATISTICS */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="TOTAL SALE REQUESTS" value={sales.length} />
        <StatCard label="UNINSPECTED" value={pendingCount} />
        <StatCard label="RESOLVED REQUESTS" value={resolvedCount} />
      </div>

      {/* FILTERS AND SEARCH */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {["All", "Pending", "Resolved"].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              className={`rounded-sm px-3.5 py-2 text-sm font-medium transition ${
                filter === option
                  ? "bg-sidebar text-white"
                  : "border border-border bg-card text-body hover:bg-bg"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search farmer, product or ID"
          className="w-full rounded-sm border border-border bg-card px-3.5 py-2.5 text-sm text-heading outline-none focus:border-primary sm:max-w-xs"
        />
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={() => loadSales()}
            className="font-semibold underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* SALES TABLE */}
      <div className="overflow-visible rounded-sm border border-border bg-card">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted">
            <LoaderCircle className="h-5 w-5 animate-spin" />
            Loading requests...
          </div>
        ) : filteredSales.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <CheckCircle2 className="mx-auto mb-3 h-9 w-9 text-muted" />
            <h2 className="font-semibold text-heading">
              No requests found
            </h2>
            <p className="mt-1 text-sm text-muted">
              Try changing your filter or search.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead className="border-b border-border bg-bg">
                <tr className="text-xs font-semibold uppercase tracking-wide text-muted">
                  <th className="px-4 py-3">Farmer</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Quantity</th>
                  <th className="px-4 py-3">Expected amount</th>
                  <th className="px-4 py-3">Submitted</th>
                  <th className="px-4 py-3">Availability</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {filteredSales.map((sale) => {
                  const readyNow = sale.status === "Ready Now";

                  return (
                    <tr
                      key={sale.id}
                      className="transition-colors hover:bg-bg/70"
                    >
                      {/* FARMER DETAILS */}
                      <td className="px-4 py-3">
                        <p className="font-medium text-heading">
                          {sale.farmer_name}
                        </p>
                        <p className="mt-0.5 text-xs text-muted">
                          {sale.farmer_phone}
                        </p>
                      </td>

                      {/* PRODUCT DETAILS */}
                      <td className="px-4 py-3">
                        <p className="font-medium text-heading">
                          {sale.product_name}
                        </p>
                        <p className="mt-0.5 text-xs text-muted">
                          ID: {sale.id}
                        </p>
                      </td>

                      <td className="px-4 py-3 text-body">
                        {sale.quantity ?? "—"} {sale.unit || ""}
                      </td>

                      <td className="px-4 py-3 font-medium text-heading">
                        {formatMoney(sale.expected_total_amount)}
                      </td>

                      <td className="whitespace-nowrap px-4 py-3 text-body">
                        {sale.created_at
                          ? formatDate(sale.created_at)
                          : "—"}
                      </td>

                      {/* PRODUCE AVAILABILITY */}
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-sm px-2 py-1.5 text-xs font-semibold ${
                            readyNow
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {getAvailability(sale)}
                        </span>
                      </td>

                      {/* VIEW REQUEST DETAILS */}
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => openDetails(sale)}
                          title="View details"
                          aria-label="View sale details"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-sm text-muted hover:bg-bg hover:text-heading"
                        >
                          <MoreVertical size={19} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* REQUEST DETAILS MODAL */}
      <ProduceSaleDetailsModal
        sale={selectedSale}
        open={Boolean(selectedSale)}
        onClose={() => setSelectedSale(null)}
        onResolve={handleResolve}
        resolving={
          selectedSale
            ? String(updatingStatusId) === String(selectedSale.id)
            : false
        }
      />
    </section>
  );
}
