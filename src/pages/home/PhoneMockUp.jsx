import {
  Bell,
  Eye,
  Home,
  Target,
  PlusCircle,
  ArrowLeftRight,
  User,
  Sprout,
  Wheat,
  GraduationCap,
  ShieldPlus,
  Menu,
} from "lucide-react";

const goals = [
  {
    icon: Wheat,
    name: "Farm Expansion",
    saved: "500,000",
    target: "2,000,000",
    pct: 25,
  },
  {
    icon: GraduationCap,
    name: "School Fees",
    saved: "300,000",
    target: "1,000,000",
    pct: 30,
  },
  {
    icon: ShieldPlus,
    name: "Emergency Fund",
    saved: "200,000",
    target: "500,000",
    pct: 40,
  },
];
const tabs = [
  { icon: Home, label: "Home" },
  { icon: Target, label: "Goals" },
  { icon: PlusCircle, label: "Deposit" },
  { icon: ArrowLeftRight, label: "Transactions" },
  { icon: User, label: "Profile" },
];

export default function PhoneMockup({ name = "John", total = "1,250,000" }) {
  return (
    <div className="w-[280px] rounded-3xl bg-[#0f3d2e] p-3 shadow-2xl">
      <div className="flex items-center justify-between px-1 pt-1 text-white">
        <span className="flex items-center gap-1 text-sm font-semibold">
          <Sprout size={14} /> CropPay
        </span>
        <span className="flex gap-3">
          <Bell size={13} />
          <Menu size={13} />
        </span>
      </div>
      <p className="mt-4 px-1 text-sm font-semibold text-white">
        Good morning, {name}
      </p>
      <p className="px-1 text-[9px] text-white/70">
        Keep saving, your goals are growing!
      </p>

      <div className="mt-3 flex items-center justify-between rounded-2xl bg-white p-3">
        <div>
          <p className="text-[10px] text-slate-500">Total Savings</p>
          <p className="flex items-center gap-2 text-lg font-bold text-[#0f3d2e]">
            UGX {total} <Eye size={14} />
          </p>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-full bg-[#0f3d2e] text-[#7ed957]">
          <Sprout size={20} />
        </span>
      </div>

      <ul className="mt-3 space-y-2 rounded-2xl bg-white p-3">
        {goals.map(({ icon: Icon, name, saved, target, pct }) => (
          <li key={name} className="flex items-center gap-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#e6efe6] text-[#0f3d2e]">
              <Icon size={15} />
            </span>
            <div className="flex-1">
              <div className="flex items-baseline justify-between">
                <span className="text-[10px] font-semibold text-[#0f3d2e]">
                  {name}
                </span>
                <span className="text-[9px] text-slate-500">{pct}%</span>
              </div>
              <p className="text-[8px] text-slate-500">
                UGX {saved} / {target}
              </p>
              <div className="mt-1 h-1 rounded-full bg-slate-200">
                <div
                  className="h-1 rounded-full bg-[#4caf2a]"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>

      <nav
        className="mt-3 flex justify-between rounded-2xl bg-white px-3 py-2"
        aria-label="App tabs"
      >
        {tabs.map(({ icon: Icon, label }, i) => (
          <span
            key={label}
            className={`flex flex-col items-center gap-0.5 text-[7px] ${i === 0 ? "text-[#0f3d2e]" : "text-slate-500"}`}
          >
            <Icon size={13} />
            {label}
          </span>
        ))}
      </nav>
    </div>
  );
}
