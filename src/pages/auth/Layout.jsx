
import GoogleAuthButton from "../../components/auth/GoogleAuthButton"
import Images from "../../assets/images/images";


export default function Layout({googlelabel,children,}) {
  return (
    <div className="flex min-h-screen flex-col  lg:flex-row">
      <main
        className="relative z-10 -mt-6 flex flex-1  border flex-col
           px-6 pb-8 pt-6 sm:px-10
          lg:-ml-10 lg:mt-0 lg:rounded-l-[2.5rem] lg:rounded-tr-none
          lg:px-12 lg:py-8"
      >
        <div className="mx-auto mt-4 w-full max-w-[25rem] backdrop-blur-xl lg:mt-6">
          {/*LOGO */}
          <div className="flex flex-col items-center">
            <span className=" h-25 w-25 ">
              <img src={Images.logo} alt="logo" />
            </span>
            <p className="text-[#1f3524] text-semibold">Save, Sale & Grow</p>
          </div>

          {/* AUTH FORM */}
          <div className="mt-3">{children}</div>

          {/* SOCIAL AUTHENTICATION */}
          {googlelabel && (
            <div className="mt-2">
              <div className="my-6 flex items-center gap-4 text-sm text-dusty-olive-700">
                <span className="h-px flex-1 bg-dusty-olive-200" />
                <span>or</span>
                <span className="h-px flex-1 bg-dusty-olive-200" />
              </div>

              <div className="space-y-2">
                {googlelabel && (
                  <div className="mt-1 space-y-1">
                    <GoogleAuthButton label={googlelabel} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
