import { useState } from "react";
import toast from "react-hot-toast";
import { Loader2, Plus, Target } from "lucide-react";
import useSavingsGoals from "../../../hooks/useSavingsGoals";
import PageHeader from "../../../components/common/PageHeader";
import Card from "../../../components/common/Card";
import Modal from "../../../components/common/Modal";
import SavingsGoalCard from "../../../components/savings/SavingsGoalCard";
import SavingsGoalForm from "../../../components/savings/SavingsGoalForm";
import GoalSummary from "../../../components/savings/GoalSummary";

export default function SavingsGoals() {

  const { goals, loading, error, reload, create, update, remove } = useSavingsGoals();

  // null | { type: "create" } | { type: "edit", goal } | { type: "delete", goal }
  const [modal, setModal] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const closeModal = () => setModal(null);

  //SAVE GOAL
  const handleSave = async (values) => {
    if (modal?.type === "edit") {
      await update(modal.goal.id, values);
      toast.success("Goal updated.");
    } else {
      await create(values);
      toast.success("Goal created.");
    }
    closeModal();
  };

  const handleDelete = async () => {
    setDeleting(true);

    try {
      await remove(modal.goal.id);
      toast.success("Goal deleted.");
      closeModal();
    } catch (err) {
      toast.error(err.message || "Could not delete the goal.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Savings Goals"
        subtitle="Set and track your savings goals."
        action={
          <button
            type="button"
            onClick={() => setModal({ type: "create" })}
            className="flex h-10 items-center gap-2 rounded-3xl bg-sidebar px-5 text-sm font-semibold
              text-white transition-colors hover:bg-primary-500"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Create Goal
          </button>
        }
      />

      {error ? (
        <Card>
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <p className="text-sm text-heading">We couldn&apos;t load your savings goals.</p>
            <button
              type="button"
              onClick={reload}
              className="rounded-lg bg-sidebar px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-500"
            >
              Try again
            </button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* GOALS */}
          <div className="min-w-0 lg:col-span-2">
            {loading ? (
              <div className="space-y-4" aria-hidden="true">
                {[0, 1, 2].map((item) => (
                  <div key={item} className="h-44 animate-pulse rounded-xl border border-border bg-card" />
                ))}
              </div>
            ) : goals.length === 0 ? (
              <Card>
                <div className="flex flex-col items-center gap-3 py-10 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-bg text-muted">
                    <Target className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <p className="text-sm font-semibold text-heading">No savings goals yet</p>
                  <p className="max-w-xs text-sm text-muted">
                    Create your first goal, such as school fees or farm expansion, and start saving towards it.
                  </p>
                  <button
                    type="button"
                    onClick={() => setModal({ type: "create" })}
                    className="mt-1 rounded-3xl bg-sidebar px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-500"
                  >
                    Create your first goal
                  </button>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {goals.map((goal) => (
                  <SavingsGoalCard
                    key={goal.id}
                    goal={goal}
                    onEdit={(item) => setModal({ type: "edit", goal: item })}
                    onDelete={(item) => setModal({ type: "delete", goal: item })}
                  />
                ))}
              </div>
            )}
          </div>

          {/* SUMMARY */}
          <div className="min-w-0">
            <GoalSummary goals={goals} />
          </div>
        </div>
      )}

      {/* CREATE / EDIT */}
      <Modal
        open={modal?.type === "create" || modal?.type === "edit"}
        title={modal?.type === "edit" ? "Edit goal" : "Create a savings goal"}
        onClose={closeModal}
      >
        <SavingsGoalForm
          // A new key resets the form each time a different goal is opened.
          key={modal?.goal?.id ?? "new"}
          goal={modal?.type === "edit" ? modal.goal : null}
          onSubmit={handleSave}
          onCancel={closeModal}
        />
      </Modal>

      {/* DELETE CONFIRMATION */}
      <Modal open={modal?.type === "delete"} title="Delete goal?" onClose={closeModal}>
        <p className="text-sm text-body">
          This will permanently delete <strong className="text-heading">{modal?.goal?.name}</strong>.
          This can&apos;t be undone.
        </p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={closeModal}
            disabled={deleting}
            className="h-11 rounded-3xl border border-border px-6 text-sm font-semibold text-heading transition-colors hover:bg-bg disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            aria-busy={deleting}
            className="flex h-11 items-center justify-center gap-2 rounded-3xl bg-danger px-6 text-sm font-semibold
              text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Deleting…
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </Modal>
    </div>
  );
}