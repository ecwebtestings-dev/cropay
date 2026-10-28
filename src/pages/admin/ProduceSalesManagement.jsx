import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  LoaderCircle,
  MoreVertical,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-hot-toast";

import api from "../../api/AxiosClient";
import { getAdminProductSales } from "../../api/produceSale";
import { getUsers } from "../../api/users";
import { formatDate } from "../../utils/formatDate";
import ProduceSaleDetailsModal from "../../components/producesales/ProduceSalesDetails";

const getErrorMessage = (error) =>
  error.response?.data?.message || "Unable to process the request.";

const getSales = (response) => {
  const payload = response.data?.data;

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(response.data?.product_sales)) {
    return response.data.product_sales;
  }

  return [];
};

const getUsersList = (response) => {
  const payload = response.data?.data;

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;

  return [];
};

const formatMoney = (value) =>
  `UGX ${Number(value || 0).toLocaleString("en-UG", {
    maximumFractionDigits: 2,
  })}`;

export default function ProductSalesManagement() {
  const [sales, setSales] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedSale, setSelectedSale] = useState(null);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  const loadSales = useCallback(async (showRefresh = false) => {
    setError("");

    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [salesResponse, usersResponse] = await Promise.all([
        getAdminProductSales(),
        getUsers(),
      ]);

      setSales(getSales(salesResponse));
      setUsers(getUsersList(usersResponse));
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

  const salesWithFarmers = useMemo(() => {
    const usersById = new Map(users.map((user) => [String(user.id), user]));

    return sales.map((sale) => {
      const farmer = usersById.get(String(sale.user_id));

      return {
        ...sale,
        farmer_name: farmer?.name || sale.user?.name || "Unknown farmer",
        farmer_phone:
          farmer?.profile?.phone ||
          farmer?.user_profile?.phone ||
          sale.user?.profile?.phone ||
          "-",
      };
    });
  }, [sales, users]);

  const filteredSales = useMemo(() => {
    const query = search.trim().toLowerCase();

    return salesWithFarmers.filter((sale) => {
      const status = sale.review_status || "Pending";

      const matchesStatus = filter === "All" || status === filter;

      const matchesSearch =
        !query ||
        String(sale.id || "")
          .toLowerCase()
          .includes(query) ||
        sale.farmer_name.toLowerCase().includes(query) ||
        String(sale.product?.name || sale.product_name || sale.product_id || "")
          .toLowerCase()
          .includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [salesWithFarmers, filter, search]);

  const pendingCount = salesWithFarmers.filter(
    (sale) => (sale.review_status || "Pending") === "Pending",
  ).length;

  const resolvedCount = salesWithFarmers.filter(
    (sale) => sale.review_status === "Resolved",
  ).length;

  // OPEN THE REQUEST DETAILS MODAL.
  const openDetails = (sale) => setSelectedSale(sale);

  // UPDATE THE REQUEST STATUS THROUGH THE BACKEND.
  const handleResolve = async (sale) => {
    if (!sale?.id) return;

    const currentStatus = sale.review_status || "Pending";
    const nextStatus = currentStatus === "Resolved" ? "Pending" : "Resolved";

    setUpdatingStatusId(sale.id);

    try {
      await api.patch(`/product_sales/${sale.id}`, {
        review_status: nextStatus,
      });

      setSales((current) =>
        current.map((item) =>
          String(item.id) === String(sale.id)
            ? { ...item, review_status: nextStatus }
            : item,
        ),
      );

      setSelectedSale((current) =>
        current && String(current.id) === String(sale.id)
          ? { ...current, review_status: nextStatus }
          : current,
      );

      toast.success(
        nextStatus === "Resolved"
          ? "Request marked as resolved."
          : "Request marked as pending.",
      );
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
          <h1 className="text-2xl font-bold text-heading">Produce Sales</h1>
          <p className="mt-1 text-sm text-muted">
            Manage and review produce sale requests submitted by farmers.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadSales(true)}
          disabled={loading || refreshing}
          className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-heading hover:bg-bg disabled:opacity-60"
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="Total requests" value={sales.length} />
        <StatCard label="Pending inspection" value={pendingCount} />
        <StatCard label="Resolved" value={resolvedCount} />
      </div>

      {/* FILTERS AND SEARCH */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {["All", "Pending", "Resolved"].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              className={`rounded-lg px-3.5 py-2 text-sm font-medium transition ${
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
          placeholder="Search farmer, product or ID..."
          className="w-full rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm text-heading outline-none focus:border-primary sm:max-w-xs"
        />
      </div>

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

      {/* COMPACT TABLE */}
      <div className="overflow-visible rounded-xl border border-border bg-card">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted">
            <LoaderCircle className="h-5 w-5 animate-spin" />
            Loading produce sales...
          </div>
        ) : filteredSales.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <CheckCircle2 className="mx-auto mb-3 h-9 w-9 text-muted" />
            <h2 className="font-semibold text-heading">
              No produce sales found
            </h2>
            <p className="mt-1 text-sm text-muted">
              Try changing your search or status filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="border-b border-border bg-bg">
                <tr className="text-xs font-semibold uppercase tracking-wide text-muted">
                  <th className="px-4 py-3">Farmer</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Quantity</th>
                  <th className="px-4 py-3">Expected amount</th>
                  <th className="px-4 py-3">Submitted</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {filteredSales.map((sale) => {
                  const status = sale.review_status || "Pending";
                  const isResolved = status === "Resolved";
                  

                  return (
                    <tr
                      key={sale.id}
                      className="transition-colors hover:bg-bg/70"
                    >
                      <td className="px-4 py-3.5">
                        <p className="font-medium text-heading">
                          {sale.farmer_name}
                        </p>
                        <p className="mt-0.5 text-xs text-muted">
                          {sale.farmer_phone}
                        </p>
                      </td>

                      <td className="px-4 py-3.5">
                        <p className="font-medium text-heading">
                          {sale.product?.name ||
                            sale.product_name ||
                            `Product #${sale.product_id ?? "—"}`}
                        </p>
                        <p className="mt-0.5 text-xs text-muted">
                          ID: {sale.id}
                        </p>
                      </td>

                      <td className="px-4 py-3.5 text-body">
                        {sale.quantity ?? "—"} {sale.unit || ""}
                      </td>

                      <td className="px-4 py-3.5 font-medium text-heading">
                        {formatMoney(sale.expected_total_amount)}
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap text-body">
                        {sale.created_at ? formatDate(sale.created_at) : "—"}
                      </td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            isResolved
                              ? "bg-green-100 text-green-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {status}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => openDetails(sale)}
                          title="View request details"
                          aria-label={`View request ${sale.id}`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-bg hover:text-heading"
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

      {/* REQUEST DETAILS AND STATUS ACTION */}
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

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1.5 text-2xl font-bold text-heading">{value}</p>
    </div>
  );
}
