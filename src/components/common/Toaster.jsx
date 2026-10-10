import { Toaster } from "react-hot-toast";



export default function AppToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000, 
        style: {
          background: "var(--color-card)",
          color: "var(--color-heading)",
          border: "1px solid var(--color-border)",
          fontSize: "0.875rem",
        },
        error: {
          iconTheme: { primary: "var(--color-danger)", secondary: "var(--color-card)" },
        },
        success: {
          iconTheme: { primary: "var(--color-primary-500)", secondary: "var(--color-card)" },
        },
      }}
    />
  );
}