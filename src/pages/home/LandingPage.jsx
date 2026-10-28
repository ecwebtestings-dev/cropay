import Navbar from "./Navbar";
import Hero from "./Hero";
import Features from "./Feactures";
import HowItWorks from "./Howitworks";
import CTABanner from "./Ctabanner";

export default function LandingPage() {
  return (
    <div className="font-sans text-slate-800 antialiased">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
      </main>
      <CTABanner />
    </div>
  );
}
