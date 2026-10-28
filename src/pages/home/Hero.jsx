import {
  ArrowRight,
  PlayCircle,
  ShieldCheck,
  Smartphone,
  Users,
} from "lucide-react";
import PhoneMockup from "./PhoneMockUp";
import Images from "../../assets/images/images";

const badges = [
  { icon: ShieldCheck, title: "Secure & Trusted", text: "Your money is safe" },
  { icon: Smartphone, title: "Mobile Friendly", text: "Access anywhere" },
  { icon: Users, title: "Built for Farmers", text: "Your goals, our priority" },
];


export default function Hero({ image = `url(${Images.logo})` }) {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(255,255,255,.75) 0%, rgba(255,255,255,0) 60%), url(${image})`,
      }}
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <span className="inline-block rounded-full bg-[#dcebd0] px-4 py-1 text-xs font-medium text-[#0f3d2e]">
            Save • Grow • Build Your Future
          </span>
          <h1 className="mt-5 text-5xl font-extrabold leading-[1.1] text-[#0f3d2e] md:text-6xl">
            Smart Savings for Better Harvests
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-slate-700">
            CropPay helps farmers save, plan and achieve their financial goals.
            Build a secure future for you and your family — one harvest at a
            time.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0f3d2e] px-7 py-3 font-semibold text-white shadow-lg hover:bg-[#14503c]"
            >
              Get Started Free <ArrowRight size={18} />
            </a>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-[#0f3d2e] bg-white/80 px-7 py-3 font-semibold text-[#0f3d2e] hover:bg-white"
            >
              <PlayCircle size={20} /> Watch Video
            </button>
          </div>

          <ul className="mt-10 flex flex-wrap gap-3">
            {badges.map(({ icon: Icon, title, text }) => (
              <li
                key={title}
                className="flex items-center gap-3 rounded-full bg-white/80 px-4 py-2 backdrop-blur"
              >
                <Icon className="text-[#0f3d2e]" size={26} />
                <div>
                  <p className="text-xs font-semibold text-[#0f3d2e]">
                    {title}
                  </p>
                  <p className="text-[10px] text-slate-600">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-center lg:justify-end">
          <PhoneMockup />
        </div>
      </div>
    </section>
  );
}
