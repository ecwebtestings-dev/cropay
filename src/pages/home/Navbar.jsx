
import { Link } from "react-router-dom";
import Images from "../../assets/images/images";



export default function Navbar() {
  return (
    <header className="bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div>
            <img src={Images.logo} alt="Logo" className="h-15 w-15" />
        </div>


        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-lg border border-[#0f3d2e]/40 px-5 py-2 text-sm font-medium text-[#0f3d2e] hover:bg-[#e6efe6]"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="rounded-lg bg-[#0f3d2e] px-5 py-2 text-sm font-medium text-white hover:bg-[#14503c]"
          ></Link>
        </div>
      </div>
    </header>
  );
}
