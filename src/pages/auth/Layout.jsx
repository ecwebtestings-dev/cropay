import GoogleAuthButton from "../../components/auth/GoogleAuthButton";
import Images from "../../assets/images/images";

export default function Layout({ googlelabel, children, footer }) {
  return (
    <main className="flex min-h-screen w-full items-center justify-center overflow-x-hidden bg-bg px-4 py-6 sm:px-6 sm:py-10">
      <div className="w-full max-w-md rounded-md border border-[#e2e9e1] bg-white px-5 py-7 sm:px-8 sm:py-9">
        {/* LOGO */}
        <div className="flex flex-col items-center text-center">
          <img
            src={Images.logo}
            alt="logo"
            className="h-20 w-20 object-contain sm:h-24 sm:w-24"
          />

          <p className="mt-2 text-sm font-medium text-heading">
            Save, Sale & Grow
          </p>
        </div>

        {/* AUTH FORM */}
        <div className="w-full">{children}</div>

        {/* SOCIAL AUTHENTICATION */}
        {googlelabel && (
          <div className="mt-5">
            <div className="my-5 flex items-center justify-center text-sm text-[#879187]">
              <span>or</span>
            </div>

            <GoogleAuthButton label={googlelabel} />
          </div>
        )}

        {/* FOOTER */}
        {footer && (
          <div className="mt-6 text-center text-sm text-[#5d665e]">
            {footer}
          </div>
        )}
      </div>
    </main>
  );
}
