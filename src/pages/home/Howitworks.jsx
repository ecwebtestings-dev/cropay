import { ArrowLeft, Sprout } from "lucide-react";

const steps = [
  { title: "Create Account", text: "Sign up in minutes" },
  { title: "Set Your Goals", text: "Choose what you're saving for" },
  { title: "Make Deposits", text: "Add funds easily and securely" },
  { title: "Track & Grow", text: "Monitor your progress and achieve more" },
];

function GoalPhone() {
  return (
    <div className="relative z-10 w-60 rounded-[2rem] border-4 border-[#0f3d2e] bg-white p-4 shadow-2xl">
      <div className="flex items-center gap-3 text-xs font-semibold text-[#0f3d2e]">
        <ArrowLeft size={14} />{" "}
        <span className="mx-auto">Create Your Goal</span>
      </div>
      <div className="mt-3 flex items-center gap-1" aria-hidden>
        <span className="h-2 w-2 rounded-full bg-[#0f3d2e]" />
        <span className="h-px flex-1 bg-[#0f3d2e]" />
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className="h-2 w-2 rounded-full bg-slate-300" />
        ))}
      </div>
      <div className="mt-5 text-center">
        <span className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-[#0f3d2e] text-[#7ed957]">
          <Sprout size={20} />
        </span>
        <p className="mt-2 text-xs font-bold text-[#0f3d2e]">Farm Equipment</p>
        <p className="text-[9px] text-slate-500">
          Buy a water pump for my farm
        </p>
      </div>
      {[
        ["Target Amount", "UGX 2,000,000"],
        ["Target Date", "Dec 31, 2026"],
      ].map(([l, v]) => (
        <div key={l} className="mt-3 rounded-lg border border-slate-200 p-2">
          <p className="text-[8px] text-slate-400">{l}</p>
          <p className="text-[10px] font-semibold text-[#0f3d2e]">{v}</p>
        </div>
      ))}
      <button
        type="button"
        className="mt-4 w-full rounded-lg bg-[#0f3d2e] py-2 text-[10px] font-semibold text-white"
      >
        Next
      </button>
    </div>
  );
}

export default function HowItWorks({ image = "/images/maize-field.jpg" }) {
  return (
    <section id="how-it-works" className="overflow-hidden bg-[#eef4ea]">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-6 py-16 lg:grid-cols-[1.1fr_auto_1fr]">
        <div>
          <p className="text-xs font-semibold tracking-wider text-[#2f7d32]">
            HOW IT WORKS
          </p>
          <h2 className="mt-2 text-3xl font-bold text-[#0f3d2e]">
            Getting Started is Easy
          </h2>
          <p className="mt-3 max-w-sm text-slate-600">
            In just a few steps, you can start saving and working towards your
            goals.
          </p>

          <ol className="mt-8 grid gap-6 sm:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title}>
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-[#0f3d2e] text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  {i < steps.length - 1 && (
                    <span className="hidden h-px flex-1 bg-slate-300 sm:block" />
                  )}
                </div>
                <h3 className="mt-3 text-sm font-semibold text-[#0f3d2e]">
                  {s.title}
                </h3>
                <p className="mt-1 text-xs text-slate-500">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="flex justify-center">
          <GoalPhone />
        </div>

        <div
          className="hidden h-80 rounded-2xl bg-cover bg-center lg:block"
          style={{ backgroundImage: `url(${image})` }}
          role="img"
          aria-label="Maize field"
        />
      </div>
    </section>
  );
}
