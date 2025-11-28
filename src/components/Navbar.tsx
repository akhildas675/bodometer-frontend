import { FaPaperPlane, FaBell, FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav
      className="fixed top-6 left-8 right-8 z-50 max-w-6xl mx-auto flex items-center justify-between bg-linear-to-r from-[#a5a7ff98] to-[#45308F] rounded-full py-4 px-10 shadow-md"
      style={{ background: 'rgba(60, 60, 150, 0.6)' }}
    >
     
      <div className="flex items-center space-x-2">
        <img src="../../../public/Bodometer Logo corrected 1.png" alt="bodometer logo" className="h-8 mr-2" />
      </div>
    
      <div className="flex space-x-10 text-[#E1E1E1] text-lg">
        <span className="cursor-pointer hover:text-white">Home</span>
        <span className="cursor-pointer hover:text-white">Trainers</span>
        <span className="cursor-pointer hover:text-white">Workouts</span>
        <span className="cursor-pointer hover:text-white">Subscription</span>
      </div>

      <div className="flex items-center space-x-6">
        <FaPaperPlane className="text-[#268AFF] text-2xl cursor-pointer" />
        <FaBell className="text-[#268AFF] text-2xl cursor-pointer" />
        <FaUserCircle className="text-[#268AFF] text-2xl cursor-pointer" />
      </div>
    </nav>
  );
};

export default Navbar;
