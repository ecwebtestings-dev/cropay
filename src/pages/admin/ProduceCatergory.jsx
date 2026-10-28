
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Pencil, Plus, Search, Tags, Trash2, X } from "lucide-react";

// API FUNCTIONS FOR SAVINGS CATEGORY MANAGEMENT.
import {
  GetCategory,
  CreateSavingsCatergory,
  UpdateCatergory,
  DeleteCatergory,
} from "../../api/savingsCatergories";

// REUSABLE CATEGORY MODALS.
import CategoryFormModal from "../../components/savings/Categoryformodal";
import DeleteCategoryDialog from "../../components/savings/DeleteCategory";


// EXTRACT CATEGORIES FROM THE API RESPONSE.

const getCategories = (response) => {
  const data = response?.data;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.categories)) return data.categories;

  return [];
};


// MAIN SAVINGS CATEGORIES PAGE.
export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);


  // FETCH CATEGORIES 

  const loadCategories = useCallback(async ({ silent = false } = {}) => {
    try {
      if (!silent) {
        setLoading(true);
      }

      setLoadError("");
      const response = await GetCategory();
      setCategories(getCategories(response));
    } catch (error) {
      setLoadError(error.response?.data?.message || "Failed to load categories.");
    } finally {
      setLoading(false);
    }
  }, []);

  // LOAD CATEGORIES 

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);


  // SEARCH CATEGORIES.
  const visibleCategories = useMemo(() => {
    const query = search.trim().toLowerCase();
    return [...categories].sort((a, b) =>
        String(a.name ?? "").localeCompare(String(b.name ?? ""))
      )
      .filter((category) => {
        // MATCH THE CATEGORY NAME OR DESCRIPTION.
        const matchesName = String(category.name ?? "").toLowerCase().includes(query);
        const matchesDescription = String(category.description ?? "").toLowerCase().includes(query);
        return !query || matchesName || matchesDescription;
      });
  }, [categories, search]);


  // CREATE OR UPDATE A CATEGORY.
  const saveCategory = async (payload) => {
    try {
      // UPDATE THE SELECTED CATEGORY 
      if (modal?.mode === "edit") {
        await UpdateCatergory(modal.category.id, payload);
        toast.success("Category updated.");
      } 
      else {
        // CREATE A NEW CATEGORY.
        await CreateSavingsCatergory(payload);
        toast.success("Category added.");
      }
      setModal(null);
      await loadCategories({ silent: true });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to save category."
      );
    }
  };



  // DELETE A CATEGORY.
  const deleteCategory = async () => {
    try {
      // GET THE CATEGORY SELECTED FOR DELETION.
      const { category } = modal;
      await DeleteCatergory(category.id);
      setCategories((items) =>items.filter((item) => item.id !== category.id));
      setModal(null);
      toast.success("Category deleted.");
    } 
    catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete category."
      );
    }
  };


  const hasCategories = categories.length > 0;

  return (
    <div className="space-y-6 ">
     
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-heading">Saving categories</h1>

          <p className="mt-1 text-sm text-muted">
            The goals farmers can choose to save towards.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModal({ mode: "create" })}
          className="inline-flex items-center gap-2 rounded-md bg-sidebar px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          <Plus size={18} />
          Add category
        </button>
      </div>

      {/* SEARCH INPUT AND CATEGORY COUNT. */}
      {hasCategories && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-sm">
            <Search
              size={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search categories"
              className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-9 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />

            {/* CLEAR THE SEARCH INPUT. */}
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted hover:text-heading"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/*  MATCHING CATEGORIES. */}
          <p className="text-sm text-muted">
            {search
              ? `${visibleCategories.length} of ${categories.length} categories`
              : `${categories.length} ${
                  categories.length === 1 ? "category" : "categories"
                }`}
          </p>
        </div>
      )}

      {/* CATEGORY LIST CONTAINER. */}
      <div className="overflow-hidden rounded-md border border-border bg-card">
        {/* SKELETON PROLOADER */}
        {loading && (
          <ul className="divide-y divide-border">
            {Array.from({ length: 6 }).map((_, index) => (
              <li key={index}className="flex items-center gap-3 p-3">
                <div className="h-11 w-11 animate-pulse rounded-xl bg-bg" />

                <div className="flex-1 space-y-2">
                  <div className="h-4 w-40 animate-pulse rounded bg-bg" />
                  <div className="h-3 w-64 max-w-full animate-pulse rounded bg-bg" />
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* ERROR  */}
        {!loading && loadError && !hasCategories && (
          <div className="p-10 text-center">
            <p role="alert" className="text-sm text-red-600">
              {loadError}
            </p>

            <button
              type="button"
              onClick={() => loadCategories()}
              className="mt-4 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-bg"
            >
              Try again
            </button>
          </div>
        )}

        {/*  EMPTY STATE */}
        {!loading && !loadError && !hasCategories && (
          <div className="flex flex-col items-center px-6 py-14 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-bg text-primary">
              <Tags size={26} />
            </span>

            <h2 className="mt-4 font-semibold text-heading">
              No categories yet
            </h2>

            <p className="mt-1 max-w-xs text-sm text-muted">
              Add your first category so farmers have something to save
              towards.
            </p>

            <button
              type="button"
              onClick={() => setModal({ mode: "create" })}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-sidebar px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
            >
              <Plus size={18} />
              Add category
            </button>
          </div>
        )}

        {/* EMPTY SEARCH RESULTS MATCHES */}
        {!loading && hasCategories && visibleCategories.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="font-medium text-heading">
              No categories match “{search}”
            </p>

            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-2 text-sm font-medium text-primary hover:underline"
            >
              Clear search
            </button>
          </div>
        )}

        {/* SORTED AND FILTERED CATEGORY LIST. */}
        {!loading && visibleCategories.length > 0 && (
          <ul className="divide-y divide-border">
            {visibleCategories.map((category) => (
              <li
                key={category.id}
                className="flex items-center gap-4 px-4 py-2 transition hover:bg-bg/50"
              >
                

                {/* CATEGORY NAME AND DESCRIPTION. */}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-heading">
                    {category.name}
                  </p>

                  <p className="mt-0.5 line-clamp-2 text-sm text-muted">
                    {category.description || "No description"}
                  </p>
                </div>

                {/* CATEGORY ACTION BUTTONS. */}
                <div className="flex shrink-0 items-center gap-1">
                  {/* EDIT CATEGORY MODAL. */}
                  <button
                    type="button"
                    onClick={() => setModal({ mode: "edit", category })}
                    title="Edit"
                    aria-label={`Edit ${category.name}`}
                    className="rounded-lg p-2 text-muted transition hover:bg-bg hover:text-heading"
                  >
                    <Pencil size={18} />
                  </button>

                  {/*  DELETE CONFIRMATION DIALOG. */}
                  <button
                    type="button"
                    onClick={() => setModal({ mode: "delete", category })}
                    title="Delete"
                    aria-label={`Delete ${category.name}`}
                    className="rounded-lg p-2 text-muted transition hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* CREATE OR EDIT CATEGORY MODAL  */}
      {(modal?.mode === "create" || modal?.mode === "edit") && (
        <CategoryFormModal
          category={modal.category}
          onSave={saveCategory}
          onClose={() => setModal(null)}
        />
      )}

      {/*  DELETE CONFIRMATION DIALOG. */}
      {modal?.mode === "delete" && (
        <DeleteCategoryDialog
          category={modal.category}
          onConfirm={deleteCategory}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
