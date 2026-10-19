
export default function PageLoader({ fullScreen = false, label = "Loading" }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center gap-6 ${
        fullScreen ? "min-h-screen bg-bg" : "min-h-[100vh]"
      }`}
    >
      
      <style>{`
        @keyframes croppay-slide {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .croppay-slide { animation: none !important; }
        }
      `}</style>



      {/* BRAND + LABEL + SLIDING BAR */}
      <div className="flex flex-col items-center gap-3">
        <div className="text-center">
          <p className="text-base font-semibold tracking-wide text-heading">
            CropPay
          </p>
          <p className="mt-0.5 text-xs uppercase tracking-[0.2em] text-muted">
            {label}
          </p>
        </div>

        <div className="relative h-1 w-28 overflow-hidden rounded-full bg-sidebar/10">
          <span
            className="croppay-slide absolute inset-y-0 left-0 w-2/5 rounded-full bg-sidebar"
            style={{ animation: "croppay-slide 1.4s ease-in-out infinite" }}
          />
        </div>
      </div>

      <span className="sr-only">{label}</span>
    </div>
  );
}