import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaQuestionCircle } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="w-full bg-[#050017] py-8 sm:py-14 px-4 sm:px-10">
      <div className="max-w-7xl mx-auto relative flex flex-col md:flex-row items-start gap-8 md:gap-0">
        {/* Logo */}
        <div className="flex flex-col mb-6 md:mb-0 md:absolute md:left-0 md:top-0">
          <img
            src="@/public/Bodometer Logo corrected 1.png"
            alt="bodometer logo"
            className="h-8 mb-2 ml-0 md:ml-2"
          />
        </div>

        {/* Footer Columns */}
        <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 md:gap-16 lg:gap-28 w-full md:pl-[230px] flex-wrap">
          {/* Details */}
          <div className="flex flex-col text-white min-w-[140px] sm:min-w-[170px]">
            <span className="font-semibold mb-4 sm:mb-6 text-sm sm:text-base">Details</span>
            <Link to="/" className="mb-2 hover:underline cursor-pointer text-sm sm:text-base">Home</Link>
            <Link to="/categories" className="mb-2 hover:underline cursor-pointer text-sm sm:text-base">Workouts</Link>
            <Link to="/subscriptions" className="mb-2 hover:underline cursor-pointer text-sm sm:text-base">Subscription</Link>
            <Link to="/trainers" className="hover:underline cursor-pointer text-sm sm:text-base">Trainers</Link>
          </div>

          {/* Company Info */}
          <div className="flex flex-col text-white min-w-[140px] sm:min-w-[170px]">
            <span className="font-semibold mb-4 sm:mb-6 text-sm sm:text-base">Company Info</span>
            <Link to="/about" className="mb-2 hover:underline cursor-pointer text-sm sm:text-base">About us</Link>
            <span className="mb-2 hover:underline cursor-pointer text-sm sm:text-base text-white/40">Career/Jobs</span>
            <span className="hover:underline cursor-pointer text-sm sm:text-base text-white/40">Blog</span>
          </div>

          {/* Legal */}
          <div className="flex flex-col text-white min-w-[140px] sm:min-w-[170px]">
            <span className="font-semibold mb-4 sm:mb-6 text-sm sm:text-base">Legal/Compliance</span>
            <Link to="/privacy" className="mb-2 hover:underline cursor-pointer text-sm sm:text-base">Privacy Policy</Link>
            <Link to="/terms" className="hover:underline cursor-pointer text-sm sm:text-base">Terms of Service</Link>
          </div>

          {/* Support */}
          <div className="flex flex-col text-white min-w-[140px] sm:min-w-[170px]">
            <span className="font-semibold mb-4 sm:mb-6 text-sm sm:text-base">Support & Resources</span>
            <span className="mb-4 hover:underline cursor-pointer text-sm sm:text-base text-white/40">FAQ/Help Center</span>
            <div className="flex gap-4">
              <FaQuestionCircle className="text-[#268AFF] text-xl cursor-pointer" />
              <FaFacebook className="text-[#268AFF] text-xl cursor-pointer" />
              <FaInstagram className="text-[#268AFF] text-xl cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
