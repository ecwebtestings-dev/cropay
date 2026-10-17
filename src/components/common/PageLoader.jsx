import { Loader2 } from "lucide-react";

export default function PageLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-sidebar">
      <Loader2 size={32} className="animate-spiner"/>
    </div>
  )
}
