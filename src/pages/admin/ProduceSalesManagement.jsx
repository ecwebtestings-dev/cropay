
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Eye,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";

import { getAdminProductSales } from "../../api/produceSale";
import { getUsers } from "../../api/users";
import { formatDate } from "../../utils/formatDate";
import ProduceSaleDetailsModal from "../../components/producesales/ProduceSalesDetails";

const getErrorMessage = (error) =>
  error.response?.data?.message ||
  "Unable to load produce sale requests.";

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
  const [selectedSale, setSelectedSale] = useState(null);
  const [resolvingId, setResolvingId] = useState(null);

  const loadSales = useCallback(async (showRefresh = false) => {
    setError("");

    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const [salesResponse, usersResponse] = await Promise.all([
        getAdminProductSales(),
        getUsers(),
      ]);

      const salesData = getSales(salesResponse);
      const usersData = getUsersList(usersResponse);

      setSales(salesData);
      setUsers(usersData);
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

  // MATCH EACH SALE WITH THE FARMER WHO SUBMITTED IT
  const salesWithFarmers = useMemo(() => {
    const usersById = new Map(
      users.map((user) => [String(user.id), user])
    );

    return sales.map((sale) => {
      const farmer = usersById.get(String(sale.user_id));

      return {
        ...sale,
        farmer_name: farmer?.name || "Unknown farmer",
        farmer_phone:farmer?.profile?.phone || "-",
      };
    });
  }, [sales, users]);

  const filteredSales = useMemo(() => {if (filter === "All") return salesWithFarmers;

    return salesWithFarmers.filter((sale) => (sale.review_status || "Pending") === filter);
  }, [salesWithFarmers, filter]);

  const pendingCount = salesWithFarmers.filter( (sale) => (sale.review_status || "Pending") === "Pending").length;

  const resolvedCount = salesWithFarmers.filter((sale) => sale.review_status === "Resolved").length;
  const openDetails = (sale) => setSelectedSale(sale);

  const handleResolve = async (sale) => {
    const confirmed = window.confirm("Out of scope for now.");
    if (!confirmed) return;

    setResolvingId(sale.id);
    const resolvedSale = {
      ...sale,
      review_status: "Resolved",
    };

    setSales((current) =>
      current.map((item) =>
        item.id === sale.id ? resolvedSale : item
      )
    );

    setSelectedSale(resolvedSale);
    setResolvingId(null);
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-heading">
            Produce Sales
          </h1>

          <p className="mt-1 text-sm text-muted">
            Review farmer requests and track inspection completion.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadSales(true)}
          disabled={loading || refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-heading disabled:opacity-60"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              refreshing ? "animate-spin" : ""
            }`}
          />
          Refresh
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total requests" value={sales.length} />
        <StatCard label="Pending inspection" value={pendingCount} />
        <StatCard label="Resolved" value={resolvedCount} />
      </div>

      <div className="flex flex-wrap gap-2">
        {["All", "Pending", "Resolved"].map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setFilter(option)}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              filter === option
                ? "bg-sidebar text-white"
                : "border border-border bg-card text-body"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}

          <button
            type="button"
            onClick={() => loadSales()}
            className="ml-2 font-semibold underline"
          >
            Try again
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-muted">
          <LoaderCircle className="h-5 w-5 animate-spin" />
          Loading produce sale requests...
        </div>
      ) : filteredSales.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-muted" />

          <h2 className="font-semibold text-heading">
            No {filter === "All" ? "" : filter.toLowerCase()} requests
          </h2>

          <p className="mt-1 text-sm text-muted">
            New farmer requests will appear here when submitted.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSales.map((sale) => {
            const resolved = sale.review_status === "Resolved";

            return (
              <article
                key={sale.id}
                className="rounded-2xl border border-border bg-card p-5 sm:p-6"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold text-heading">
                        {sale.product?.name ||
                          sale.product_name ||
                          `Product #${sale.product_id}`}
                      </h2>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          resolved
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {resolved ? "Resolved" : "Pending"}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-muted">
                      Request ID: {sale.id}
                    </p>
                  </div>

                  <p className="text-sm text-muted">
                    {formatDate(sale.created_at)}
                  </p>
                </div>

                {/* FARMER CONTACT DETAILS */}
                <div className="mt-5 rounded-xl border border-border bg-bg p-4">
                  <h3 className="mb-3 text-sm font-semibold text-heading">
                    Submitted by
                  </h3>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <Info label="">
                      {sale.farmer_name}
                    </Info>

                    <Info label="">
                      {sale.farmer_phone}
                    </Info>

                  </div>
                </div>

                {/* PRODUCE SALE DETAILS */}
                <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <Info label="Quantity">
                    {sale.quantity} {sale.unit || ""}
                  </Info>

                  <Info label="Expected total">
                    {formatMoney(sale.expected_total_amount)}
                  </Info>

                  <Info label="Location">
                    {sale.location}
                  </Info>

                  <Info label="Availability">
                    {sale.status}
                  </Info>
                </div>

                <div className="mt-5 flex justify-end border-t border-border pt-4">
                  <button
                    type="button"
                    onClick={() => openDetails(sale)}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
                  >
                    <Eye className="h-4 w-4" />
                    View Full Request
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <ProduceSaleDetailsModal
        sale={selectedSale}
        open={Boolean(selectedSale)}
        onClose={() => setSelectedSale(null)}
        onResolve={handleResolve}
        resolving={Boolean(resolvingId)}
      />
    </section>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-2xl font-bold text-heading">
        {value}
      </p>
    </div>
  );
}

function Info({ label, children }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 break-words text-sm font-medium text-heading">
        {children || "—"}
      </p>
    </div>
  );
}
