import {
  PiggyBank,
  Target,
  TrendingUp,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

const features = [
  {
    icon: PiggyBank,
    title: "Save Regularly",
    text: "Deposit money at your convenience and watch your savings grow.",
  },
  {
    icon: Target,
    title: "Set Goals",
    text: "Save for what matters — farm inputs, equipment, education and more.",
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    text: "See how close you are to reaching your goals with real-time updates.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Reliable",
    text: "Your money and data are protected with industry-standard security.",
  },
  {
    icon: Smartphone,
    title: "Access Anywhere",
    text: "Use the app on your phone and manage your savings from anywhere.",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <p className="text-xs font-semibold tracking-wider text-[#4caf2a]">
          WHY CHOOSE CROPPAY
        </p>
        <h2 className="mt-2 text-3xl font-bold text-[#0f3d2e]">
          Everything You Need to Save Smarter
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600">
          CropPay gives you the tools to manage your money, set goals and track
          your progress — all in one simple and secure platform.
        </p>

        <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-0 lg:divide-x lg:divide-slate-200">
          {features.map(({ icon: Icon, title, text }) => (
            <li key={title} className="px-6">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#e6efe6] text-[#0f3d2e]">
                <Icon size={30} />
              </span>
              <h3 className="mt-4 font-semibold text-[#0f3d2e]">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {text}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
