import { ArrowRight, Sprout } from "lucide-react";

export default function CTABanner() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-[#0f3d2e] pb-14 pt-20 text-center text-white"
    >
      {/* curved top edge */}
      <svg
        className="absolute inset-x-0 top-0 w-full text-white"
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path d="M0 0H1440V10C1000 60 440 60 0 10Z" fill="currentColor" />
      </svg>
      <Sprout
        className="absolute -left-4 bottom-0 text-[#1f5a3f]"
        size={150}
        aria-hidden
      />

      <div className="relative mx-auto max-w-3xl px-6">
        <h2 className="text-2xl font-bold">
          Ready to build your financial future?
        </h2>
        <p className="mt-2 text-sm text-white/80">
          Join thousands of farmers already using CropPay to save and grow.
        </p>
        <a
          href="/signup"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#4caf2a] px-8 py-3 text-sm font-semibold text-[#0f3d2e] hover:bg-[#5cc434]"
        >
          Get Started Free <ArrowRight size={16} />
        </a>
      </div>

      <p className="absolute bottom-8 right-8 hidden -rotate-6 font-serif text-lg italic leading-tight text-[#4caf2a] md:block">
        Better Farmers
        <br />
        Brighter Futures
      </p>
    </section>
  );
}
