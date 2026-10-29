
import { useEffect, useState } from "react";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { createProductSale } from "../../api/produceSale";
import { getProducts } from "../../api/products";
import InputField from "../../components/common/InputFields";
import Modal from "../../components/common/Modal";

const INITIAL_FORM = {
  product_id: "",
  quantity: "",
  unit: "kg",
  expected_unit_price: "",
  location: "",
  status: "Ready Now",
  ready_at_date: "",
  brief_notes: "",
};


//ERROR MESSAGE
const getErrorMessage = (error) =>error.response?.data?.message ||"Something went wrong. Please try again.";

export default function ProduceSaleForm({ open, onClose, onSubmitted }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const quantity = Number(form.quantity) || 0;
  const unitPrice = Number(form.expected_unit_price) || 0;
  const expectedTotal = quantity * unitPrice;

  // FETCH ACTIVE PRODUCTS WHEN THE FORM OPENS
  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    const fetchProducts = async () => {
      setLoadingProducts(true);
      setError("");

      try {
        const response = await getProducts();

        const productList = Array.isArray(response.data)? response.data: [];

        const activeProducts = productList.filter((product) => product.is_active);

        if (!cancelled) {setProducts(activeProducts);}
      } 
      catch (err) {
        if (!cancelled) {
          setProducts([]);
          setError(err.response?.data?.message ||"Failed to load products. Please try again."
          );
        }
      } 
      finally {
        if (!cancelled) {setLoadingProducts(false);}
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [open]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === "status" && value === "Ready Now"
        ? { ready_at_date: "" }
        : {}),
    }));

    setError("");
    setSuccess("");
  };

  const handleClose = () => {
    if (submitting) return;

    setForm(INITIAL_FORM);
    setError("");
    setSuccess("");
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.product_id) {
      setError("Please select a produce item.");
      return;
    }

    if (quantity <= 0 || unitPrice <= 0) {
      setError(
        "Quantity and expected unit price must be greater than zero."
      );
      return;
    }

    if (!form.location.trim()) {
      setError("Please enter the produce location.");
      return;
    }

    if (form.status === "Scheduled" && !form.ready_at_date) {
      setError("Please select the date your produce will be ready.");
      return;
    }

    const saleData = {
      product_id: Number(form.product_id),
      quantity: Number(quantity.toFixed(2)),
      unit: form.unit,
      expected_unit_price: Number(unitPrice.toFixed(2)),
      location: form.location.trim(),
      status: form.status,
      ready_at_date:
        form.status === "Scheduled" ? form.ready_at_date : null,
      brief_notes: form.brief_notes.trim() || null,
    };

    setSubmitting(true);

    try {
      await createProductSale(saleData);

      setSuccess("Produce sale request submitted successfully.");
      onSubmitted?.();
      setForm(INITIAL_FORM);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Sell Your Produce"
      size="max-w-2xl"
    >
      {success ? (
        <div className="py-8 text-center">
          <CheckCircle2 className="mx-auto mb-3 h-12 w-12 text-primary" />

          <h3 className="text-lg font-semibold text-heading">
            Request submitted
          </h3>

          <p className="mt-2 text-sm text-body">{success}</p>

          <p className="mt-1 text-sm text-muted">
            Look out for an SMS with your produce inspection details.
          </p>

          <button
            type="button"
            onClick={handleClose}
            className="mt-6 rounded-lg bg-primary px-5 py-2.5 font-medium text-white"
          >
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {/* PRODUCT SELECTION */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-heading">
              Produce *
            </label>

            <select
              name="product_id"
              value={form.product_id}
              onChange={handleChange}
              required
              disabled={loadingProducts || products.length === 0}
              className="w-full rounded-sm border border-border bg-card px-3 py-2.5 text-body outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">
                {loadingProducts
                  ? "Loading products"
                  : products.length === 0
                    ? "No products available"
                    : "Select produce"}
              </option>

              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} ({product.unit})
                </option>
              ))}
            </select>

            {!loadingProducts && products.length === 0 && !error && (
              <p className="mt-1 text-xs text-muted">
                No active products are available for selection.
              </p>
            )}
          </div>

          {/* QUANTITY AND UNIT */}
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField
              label="Quantity"
              name="quantity"
              type="number"
              min="0.01"
              step="0.01"
              value={form.quantity}
              onChange={handleChange}
              placeholder="e.g. 50"
              required
            />

            <div>
              <label className="mb-1.5 block text-sm font-medium text-heading">
                Unit *
              </label>

              <select
                name="unit"
                value={form.unit}
                onChange={handleChange}
                required
                className="w-full rounded-sm border border-border bg-card px-3 py-2.5 text-body"
              >
                <option value="kg">Kilograms</option>
                <option value="bags">Bags</option>
                <option value="tonnes">Tonnes</option>
                <option value="litres">Litres</option>
                <option value="pieces">Pieces</option>
              </select>
            </div>

            <InputField
              label="Expected unit price"
              name="expected_unit_price"
              type="number"
              min="0.01"
              step="0.01"
              value={form.expected_unit_price}
              onChange={handleChange}
              placeholder=""
              required
            />

            <div>
              <label className="mb-1.5 block text-sm font-medium text-heading">
                Expected total (UGX)
              </label>

              <div className="rounded-lg border border-border bg-bg px-3 py-2.5 font-semibold text-heading">
                {expectedTotal.toLocaleString("en-UG", {
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
          </div>

          {/* PRODUCE LOCATION */}
          <InputField
            label="Produce location *"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Your location"
            required
          />

          {/* AVAILABILITY */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-heading">
              Availability 
            </label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-sm border border-border bg-card px-3 py-2.5 text-body"
            >
              <option value="Ready Now">Ready Now</option>
              <option value="Scheduled">Scheduled</option>
            </select>
          </div>

          {/* SCHEDULED READY DATE */}
          {form.status === "Scheduled" && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-heading">
                Date produce will be ready *
              </label>

              <input
                type="date"
                name="ready_at_date"
                min={new Date().toISOString().slice(0, 10)}
                value={form.ready_at_date}
                onChange={handleChange}
                required
                className="w-full rounded-sm border border-border bg-card px-3 py-2.5 text-body"
              />
            </div>
          )}

          {/* BRIEF NOTES */}
          <div>
            
            <textarea
              name="brief_notes"
              rows={3}
              value={form.brief_notes}
              onChange={handleChange}
              placeholder="Describe the quality or condition of your produce"
              className="w-full resize-y rounded-sm border border-border bg-card px-3 py-2.5 text-body outline-none focus:border-primary"
            />
          </div>

          {/* FORM ACTIONS */}
          <div className="flex justify-end gap-3 border-t border-border pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-body disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting || loadingProducts}
              className="inline-flex items-center gap-2 rounded-lg bg-sidebar px-5 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting && (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              )}

              {submitting ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}

