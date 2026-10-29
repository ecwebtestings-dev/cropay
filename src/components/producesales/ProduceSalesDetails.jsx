import Modal from "../../components/common/Modal";
import { formatDate } from "../../utils/formatDate";
import { formatMoney } from "../../utils/formatCurrency";



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

  const resolved = sale.review_status?.toLowerCase() === "resolved";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Request Details"
      size="max-w-xl"
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span
            className={`rounded-sm px-3 py-2 text-xs font-semibold ${
              resolved ? " text-green-800" : "bg-amber-100 text-amber-800"
            }`}
          >
            {resolved ? "Resolved" : "Pending"}
          </span>

          {!resolved && (
            <button
              type="button"
              disabled={resolving}
              onClick={() => onResolve(sale)}
              className="rounded-sm bg-sidebar px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {resolving ? "Processing" : "Resolve"}
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Detail label="Product">
            {sale.product?.name || sale.product_name}
          </Detail>
          <Detail label="Quantity">
            {sale.quantity} {sale.unit || ""}
          </Detail>
          <Detail label="Expected Price">
            {formatMoney(sale.expected_unit_price)}
          </Detail>
          <Detail label="Expected Total">
            {formatMoney(sale.expected_total_amount)}
          </Detail>
          <Detail label="Location">{sale.location}</Detail>

          <Detail label="Availability">
            {sale.status?.toLowerCase() === "ready now"
              ? "Ready Now"
              : sale.ready_at_date
                ? `On ${formatDate(sale.ready_at_date)}`
                : "Not specified"}
          </Detail>
          
          <Detail label="Submitted">{formatDate(sale.created_at)}</Detail>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-heading">Farmer words</p>
          <div className="rounded-sm p-4 text-sm leading-6 text-body">
            {sale.brief_notes || "No additional notes provided."}
          </div>
        </div>
      </div>
    </Modal>
  );
}
