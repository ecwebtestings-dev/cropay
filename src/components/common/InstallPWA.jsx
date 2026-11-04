import { useEffect, useState } from "react";
import { Download } from "lucide-react";

export default function InstallPWA() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // CHECK IF THE APP IS ALREADY INSTALLED
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    setInstalled(isStandalone);

    // LISTEN FOR THE BROWSER INSTALLATION EVENT
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
      console.log("CropPay installation prompt is available.");
    };

    // LISTEN WHEN THE APP IS INSTALLED
    const handleAppInstalled = () => {
      setInstalled(true);
      setInstallPrompt(null);
      console.log("CropPay was installed successfully.");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );

      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) {
      console.log("Installation prompt is not available.");
      return;
    }

    try {
      await installPrompt.prompt();

      const choice = await installPrompt.userChoice;

      if (choice.outcome === "accepted") {
        console.log("User accepted CropPay installation.");
      }

      setInstallPrompt(null);
    } catch (error) {
      console.error("Installation failed:", error);
    }
  };

  if (installed || !installPrompt) return null;

  return (
    <button
      type="button"
      onClick={handleInstall}
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
    >
      <Download size={18} />
      Install CropPay
    </button>
  );
}
