import { Edit2, Package, Trash2 } from "lucide-react";

export default function ProductTable({
  products,
  onEdit,
  onDelete,
  deletingId,
}) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
        <Package className="mx-auto mb-3 h-10 w-10 text-muted" />
        <h3 className="font-semibold text-heading">No products found</h3>
        <p className="mt-1 text-sm text-muted">
          Add a product to make it available in the catalogue.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-sm border border-border bg-card">
      <table className="w-full min-w-[700px] text-left">
        <thead className="border-b border-border">
          <tr className="text-xs uppercase tracking-wide text-muted">
            <th className="px-5 py-4 font-semibold">Product</th>
            <th className="px-5 py-4 font-semibold">Unit</th>
            <th className="px-5 py-4 font-semibold">Status</th>
            <th className="px-5 py-4 text-right font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-bg/60">
              <td className="px-3 py-1 flex gap-2">
                <p className="font-semibold text-heading">{product.name}</p>
              </td>

              <td className="px-3 py-1 text-sm text-body">
                {product.unit || ""}
              </td>

              <td className="px-3 py-1">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    product.is_active
                      ? " text-green-800"
                      : " text-gray-700"
                  }`}
                >
                  {product.is_active ? "Active" : "Inactive"}
                </span>
              </td>

              <td className="px-3 py-1">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(product)}
                    aria-label={`Edit ${product.name}`}
                    className="rounded-lg border border-border p-2 text-body hover:bg-bg"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(product)}
                    disabled={deletingId === product.id}
                    aria-label={`Delete ${product.name}`}
                    className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
