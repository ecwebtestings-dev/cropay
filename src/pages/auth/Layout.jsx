import { Sprout } from "lucide-react"
import GoogleAuthButton,{OrDivider} from "./GoogleAuthButton"
import dash from '../../assets/images/Free.jpg'

const asideBackground = {
  backgroundImage: `
    linear-gradient(
      to bottom,
      color-mix(in srgb, var(--color-sidebar) 50%, transparent),
      color-mix(in srgb, var(--color-sidebar) 100%, transparent)
    ),
    url('${dash}')
  `,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
};


export default function Layout({title,subtitle,error,googlelabel,children,}) {
  return (
    
    <div className="flex min-h-screen flex-col bg-card lg:flex-row">

      {/*MOBILE SCREEN LAYOUT*/}
      <aside
        style={asideBackground}
        className="flex h-[40vh] shrink-0 flex-col justify-between bg-sidebar p-6 pb-16 text-white
          lg:h-auto lg:w-1/2 lg:p-10 lg:pb-10 xl:w-[45%]"
      >
        <div className="flex items-center gap-3">
          <Sprout className="h-7 w-7 lg:h-8 lg:w-8" aria-hidden="true" />
          <span className="text-xl font-bold lg:text-2xl">CropPay</span>
        </div>

        <div>
          <h2 className="text-2xl font-semibold leading-snug lg:text-3xl">
            Grow & Secure Wealth
            <br />
            for Smallholder Farmers
          </h2>
          <p className="mt-2 text-sm text-white/70 lg:mt-3">
            Save Towards Your Money Goals
          </p>
        </div>
      </aside>

      {/* FORM COLUMN */}
      <main
        className="relative -mt-10 flex flex-1 justify-center rounded-t-3xl bg-bg px-4 pb-8 pt-8
          sm:px-8 lg:mt-0 lg:items-center lg:rounded-none lg:py-8"
      >
        <div className="w-full max-w-sm">

          <div className="text-center">
            <h1 className="text-xl font-bold text-heading sm:text-3xl">
              {title}
            </h1>
            <p className="mt-1 text-sm text-muted">{subtitle}</p>
          </div>

          {error && (
            <div
              className="mt-2 text-xs text-red-500"
            >
              {error}
            </div>
          )}

          <div className="mt-2">{children}</div>

          {googlelabel && (
            <div className="mt-1 space-y-1">
              <OrDivider />
              <GoogleAuthButton label={googlelabel} />
            </div>
          )}

        </div>
      </main>
    </div>
  )
}