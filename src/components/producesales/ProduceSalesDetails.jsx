import Modal from "../../components/common/Modal";
import { formatDate } from "../../utils/formatDate";

const formatMoney = (value) =>`UGX ${Number(value || 0).toLocaleString("en-UG", {  maximumFractionDigits: 2,})}`;

function Detail({ label, children }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </p>
      <p className="break-words text-sm text-heading">{children || "—"}</p>
    </div>
  );
}



export default function ProduceSaleDetailsModal({
  sale,
  open,
  onClose,
  onResolve,
  resolving = false,
}) {
  if (!sale) return null;

  const resolved = sale.review_status === "Resolved";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Produce Sale Request"
      size="max-w-2xl"
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-muted">Request ID</p>
            <p className="break-all font-mono text-xs text-heading">
              {sale.id}
            </p>
          </div>

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

        <div className="grid gap-5 rounded-xl border border-border p-4 sm:grid-cols-2">
          <Detail label="Product">
            {sale.product?.name ||
              sale.product_name ||
              `Product #${sale.product_id}`}
          </Detail>
          <Detail label="Farmer ID">{sale.user_id}</Detail>
          <Detail label="Quantity">
            {sale.quantity} {sale.unit || ""}
          </Detail>
          <Detail label="Expected unit price">
            {formatMoney(sale.expected_unit_price)}
          </Detail>
          <Detail label="Expected total">
            {formatMoney(sale.expected_total_amount)}
          </Detail>
          <Detail label="Location">{sale.location}</Detail>
          <Detail label="Availability">{sale.status}</Detail>
          <Detail label="Ready date">
            {sale.ready_at_date ? formatDate(sale.ready_at_date) : "Ready now"}
          </Detail>
          <Detail label="Submitted">{formatDate(sale.created_at)}</Detail>
          <Detail label="Last updated">{formatDate(sale.updated_at)}</Detail>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-heading">
            Farmer's notes
          </p>
          <div className="rounded-xl bg-bg p-4 text-sm leading-6 text-body">
            {sale.brief_notes || "No additional notes provided."}
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-border pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-body"
          >
            Close
          </button>

          {!resolved && (
            <button
              type="button"
              disabled={resolving}
              onClick={() => onResolve(sale)}
              className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {resolving ? "Saving..." : "Mark as Resolved"}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
