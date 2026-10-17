import { Toaster } from "react-hot-toast";


export default function AppToaster() {
  return (
    <Toaster
      position="top-right"
      gutter={8}
      containerStyle={{ top: 16, right: 16, left: 16 }}
      toastOptions={{
        duration: 4000,
        style: {
          background: "var(--color-card)",
          color: "var(--color-heading)",
          border: "1px solid var(--color-border)",
          borderRadius: "0.75rem",
          fontSize: "0.875rem",
          padding: "10px 14px",
          maxWidth: "360px",
          wordBreak: "break-word", 
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: "var(--color-primary-500)",
            secondary: "var(--color-card)",
          },
        },
        error: {
          duration: 5000, 
          iconTheme: {
            primary: "var(--color-danger)",
            secondary: "var(--color-card)",
          },
        },
      }}
    />
  );
}