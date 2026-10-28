
import { useCallback, useEffect, useState } from "react";
import {
  LoaderCircle,
  Plus,
  Package,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";

import { deleteProduct, getProducts } from "../../api/products";
import ProductTable from "../../components/products/ProductTable";
import ProductFormModal from "../../components/products/ProductForm";

// EXTRACT THE PRODUCT ARRAY
function extractProducts(response) {
  const body = response.data;

  if (Array.isArray(body)) return body;
  if (Array.isArray(body?.data)) return body.data;
  if (Array.isArray(body?.data?.data)) return body.data.data;
  if (Array.isArray(body?.products)) return body.products;

  return [];
}

// GET A USER-FRIENDLY ERROR MESSAGE
function getErrorMessage(error) {
  return (
    error.response?.data?.message ||
    "Unable to load products. Please try again."
  );
}

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // LOAD ALL PRODUCTS
  const loadProducts = useCallback(async () => {
    setError("");

    try {
      const response = await getProducts();
      setProducts(extractProducts(response));
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // LOAD PRODUCTS WHEN THE PAGE OPENS
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // OPEN THE FORM TO CREATE A PRODUCT
  const openCreateModal = () => {
    setSelectedProduct(null);
    setModalOpen(true);
  };

  // OPEN THE FORM TO EDIT A PRODUCT
  const openEditModal = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  // CLOSE THE FORM AND RELOAD PRODUCTS AFTER SAVING
  const handleSaved = async () => {
    setModalOpen(false);
    setSelectedProduct(null);

    await loadProducts();

    toast.success("Product saved successfully.");
  };

  // DELETE A PRODUCT
  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Delete "${product.name}" from the product catalogue?`,
    );

    if (!confirmed) return;

    setDeletingId(product.id);

    try {
      await deleteProduct(product.id);

      setProducts((current) =>
        current.filter((item) => item.id !== product.id),
      );

      toast.success("Product deleted successfully.");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Unable to delete this product. It may be in use.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="mx-auto w-full min-w-0 max-w-screen-2xl space-y-5 sm:space-y-6">
      {/* PAGE HEADER */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-3 sm:gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-black-forest-50 text-black-forest-700 sm:h-12 sm:w-12">
              <Package className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>

            <div className="min-w-0">
              <h1 className="text-xl font-bold tracking-tight text-heading sm:text-2xl">
                Products
              </h1>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-muted">
                Manage the agricultural products to purchase from farmers
              </p>
            </div>
          </div>

          {/* CREATE PRODUCT BUTTON */}
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-black-forest-800 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-black-forest-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight sm:w-auto sm:py-2.5"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        </div>

        {/* PRODUCT COUNT */}
        {!loading && !error && (
          <div className="mt-5 flex items-center gap-2 border-t border-border pt-4">
            <Package className="h-4 w-4 text-muted" />

            <p className="text-sm text-muted">
              <span className="font-semibold text-heading">
                {products.length}
              </span>{" "}
              {products.length === 1 ? "product" : "products"} in the catalogue
            </p>
          </div>
        )}
      </div>

      {/* LOAD ERROR */}
      {error && !loading && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex min-w-0 items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

            <div className="min-w-0">
              <p className="text-sm font-semibold text-red-800">
                Unable to load products
              </p>

              <p className="mt-1 break-words text-sm text-red-700">
                {error}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setLoading(true);
              loadProducts();
            }}
            className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 self-start rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 sm:self-auto"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
        </div>
      )}

      {/* LOADING STATE */}
      {loading ? (
        <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-border bg-card px-4 py-10 text-center shadow-sm">
          <LoaderCircle className="h-8 w-8 animate-spin text-accent" />

          <p className="mt-4 text-sm font-semibold text-heading">
            Loading products...
          </p>

          <p className="mt-1 text-sm text-muted">
            Please wait while we retrieve the product catalogue.
          </p>
        </div>
      ) : (
        /* PRODUCT TABLE */
        !error && (
          <div className="min-w-0 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-4 py-4 sm:px-6">
              <h2 className="text-base font-semibold text-heading">
                Product catalogue
              </h2>

              <p className="mt-1 text-sm text-muted">
                View, edit, and manage your agricultural products.
              </p>
            </div>

            <div className="min-w-0 p-3 sm:p-5">
              <ProductTable
                products={products}
                onEdit={openEditModal}
                onDelete={handleDelete}
                deletingId={deletingId}
              />
            </div>
          </div>
        )
      )}

      {/* CREATE AND EDIT PRODUCT MODAL */}
      <ProductFormModal
        open={modalOpen}
        product={selectedProduct}
        onClose={() => {
          setModalOpen(false);
          setSelectedProduct(null);
        }}
        onSaved={handleSaved}
      />
    </section>
  );
}
