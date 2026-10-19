import { Sprout } from "lucide-react"
import GoogleAuthButton,{OrDivider} from "../../components/auth/GoogleAuthButton"
import dash from '../../assets/images/Free.jpg'


const heroImage = {
  backgroundImage: `url('${dash}')`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
};

export default function Layout({title,subtitle,googlelabel,children,}) {
  return (
    <div className="flex min-h-screen flex-col bg-bg lg:flex-row">

      {/* HERO*/}
      <aside
        style={heroImage}
        className="relative flex h-[34vh] min-h-56 shrink-0 flex-col justify-end overflow-hidden
           bg-sidebar 
          lg:h-auto lg:w-1/2 lg:justify-between lg:rounded-none lg:p-10 lg:shadow-none xl:w-[45%]"
      >
        {/* OVERLAYS*/}
        <div className="absolute inset-0 bg-linear-to-b from-sidebar/80 via-sidebar/30 to-bg lg:hidden" />
        <div className="absolute inset-0 hidden bg-linear-to-b from-sidebar/50 to-sidebar lg:block" />

        {/*MOBILE SCREENS */}
        <div className="relative flex flex-col items-center pb-6 text-center lg:hidden">
          <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-sidebar text-sidebar">
            <Sprout className="h-8 w-8" aria-hidden="true" />
          </span>
          <span className="mt-2 text-2xl font-bold tracking-wide text-heading">CropPay</span>
          <span className="text-sm text-muted">Agricultural Savings</span>
        </div>

        {/*DESKTOP OVERLAY */}
        <div className="relative hidden items-center gap-3 text-white lg:flex">
          <Sprout className="h-8 w-8" aria-hidden="true" />
          <span className="text-2xl font-bold">CropPay</span>
        </div>

        <div className="relative hidden text-white lg:block">
          <h2 className="text-3xl font-semibold leading-snug">
            Grow & Secure Wealth

          </h2>
          <p className="mt-3 text-sm text-white/70">
            Save Towards Your Money Goals
          </p>
        </div>
      </aside>

      {/* FORM COLUMN */}
      <main className="flex flex-1 justify-center bg-bg px-8 pb-10 pt-6 sm:px-10 lg:items-center lg:py-8">
        <div className="w-full max-w-sm">

          <div className="text-center">
            <h1 className="text-xl font-bold text-heading sm:text-3xl">
              {title}
            </h1>
            <p className="mt-1 text-sm text-muted">{subtitle}</p>
          </div>

           {googlelabel && (
            <div className="mt-1 space-y-1">
              <OrDivider />
              <GoogleAuthButton label={googlelabel} />
            </div>
          )}

          <div className="mt-2">{children}</div>

         

        </div>
      </main>
    </div>
  )
}