// Footer.jsx
import { FaFacebook, FaInstagram, FaQuestionCircle } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="w-full bg-[#010629]/90 py-14 px-10">
      <div className="max-w-7xl mx-auto relative flex flex-row items-start">
        {/* Logo - move only the image further left */}
        <div className="absolute left-0 top-0 flex flex-col">
          <img
            src="../../../public/Bodometer Logo corrected 1.png" // Adjust path as needed
            alt="bodometer logo"
            className="h-8 mb-2 ml-2" // smaller, some left margin for breathing room
          />
        </div>
        {/* Footer Columns (centered and spaced) */}
        <div className="flex flex-row gap-28 justify-center w-full pl-[230px]">
          {/* Details */}
          <div className="flex flex-col text-white min-w-[170px]">
            <span className="font-semibold mb-6">Details</span>
            <span className="mb-2 hover:underline cursor-pointer text-base">Home</span>
            <span className="mb-2 hover:underline cursor-pointer text-base">Workouts</span>
            <span className="mb-2 hover:underline cursor-pointer text-base">Subscription</span>
            <span className="hover:underline cursor-pointer text-base">Trainers</span>
          </div>
          {/* Company Info */}
          <div className="flex flex-col text-white min-w-[170px]">
            <span className="font-semibold mb-6">Company Info</span>
            <span className="mb-2 hover:underline cursor-pointer text-base">About us</span>
            <span className="mb-2 hover:underline cursor-pointer text-base">Career/Jobs</span>
            <span className="hover:underline cursor-pointer text-base">Blog</span>
          </div>
          {/* Legal */}
          <div className="flex flex-col text-white min-w-[170px]">
            <span className="font-semibold mb-6">Legal/Compliance</span>
            <span className="mb-2 hover:underline cursor-pointer text-base">Privacy Policy</span>
            <span className="hover:underline cursor-pointer text-base">Terms of Service</span>
          </div>
          {/* Support */}
          <div className="flex flex-col text-white min-w-[170px]">
            <span className="font-semibold mb-6">Support & Resources</span>
            <span className="mb-4 hover:underline cursor-pointer text-base">FAQ/Help Center</span>
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
