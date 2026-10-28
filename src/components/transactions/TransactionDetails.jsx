import Modal from "../common/Modal";
import { DirectionBadge, StatusBadge } from "./Bagdes";
import { formatAmount, formatDateTime } from "./helperfunctions";

function Row({ label, children }) {
  return (
    <div className="grid grid-cols-3 gap-3 py-3 text-sm">
      <dt className="text-muted">{label}</dt>
      <dd className="col-span-2 break-all text-foreground">
        {children || "—"}
      </dd>
    </div>
  );
}

export default function TransactionDetails({transaction,showUser = false,onClose,}) {
  if (!transaction) return null;

  return (
    <Modal open title="Transaction details" onClose={onClose} size="max-w-xl">
      <d>
        <Row label="Direction">
          <DirectionBadge direction={transaction.direction} />
        </Row>
        <Row label="Amount">UGX {formatAmount(transaction.amount)}</Row>
        <Row label="Status">
          <StatusBadge
            statusKey={transaction.statusKey}
            statusText={transaction.statusText}
          />
        </Row>
        {showUser && (
          <>
            <Row label="User">
              {transaction.userName}
              {transaction.userDetail ? ` · ${transaction.userDetail}` : ""}
            </Row>
            <Row label="User ID">{transaction.userId}</Row>
          </>
        )}
        <Row label="Savings goal">
          {transaction.goalName || transaction.goalId}
        </Row>
        <Row label="Reference">{transaction.reference}</Row>
        <Row label="Reference ID">{transaction.gatewayRef}</Row>
        <Row label="Payment method">{transaction.provider}</Row>
        <Row label="Created">{formatDateTime(transaction.createdAt)}</Row>
        <Row label="Last updated">{formatDateTime(transaction.updatedAt)}</Row>
      </d>

    </Modal>
  );
}
