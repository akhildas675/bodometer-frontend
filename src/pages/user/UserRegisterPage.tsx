import { Link } from "react-router-dom";
import { User, Mail, Phone, Lock, CheckCircle } from "lucide-react";

const UserRegisterPage = () => {


    return (
        <div className="min-h-screen w-full bg-linear-to-b from-[#03000D] to-[#190473] flex items-center justify-center">
          <div className="w-full max-w-6xl h-[600px] rounded-3xl overflow-hidden shadow-2xl flex bg-linear-to-b from-[#03000D] to-[#190473]">

                {/* Left image section */}
                <div className="w-1/2 hidden md:block relative">
                    <img
                        src="https://bodometer-assets.s3.eu-north-1.amazonaws.com/bodometer_register_page_img.jpg"
                        alt="Bodometer registration"
                        className="h-full w-full object-cover"
                    />

                    <div className="absolute top-6 left-6">
                        <img
                            src="/public/Bodometer Logo corrected 1.png"  
                            alt="Bodometer Logo"
                            className="h-8 w-auto object-contain drop-shadow-lg"
                        />
                    </div>

                </div>

              
                <div className="flex-1 relative flex items-center justify-center px-6 sm:px-10 py-10 bbg-gradient-to-b from-[#03000D] to-[#190473]">
                    
                    <div className="pointer-events-none absolute -top-32 -right-20 h-72 w-72 rounded-full bg-[#3a1b7a] opacity-40 blur-2xl" />
                    <div className="pointer-events-none absolute bottom-[-120px] -left-10 h-80 w-80 rounded-full bg-[#24116b] opacity-40 blur-2xl" />

                    <div className="relative w-full max-w-md">
                        <h1 className="text-center text-3xl font-semibold text-indigo-300 tracking-wide mb-8">
                            SIGN UP
                        </h1>

                        <form className="space-y-4">
                          
                            <div className="flex items-center gap-3 bg-[#19245a] rounded-full px-5 py-3 shadow-md shadow-black/30">
                                <User size={20} className="text-indigo-200" />
                                <input
                                    type="text"
                                    placeholder="Name"
                                    className="w-full bg-transparent outline-none text-sm text-slate-100 placeholder:text-slate-300"
                                />
                            </div>

                     
                            <div className="flex items-center gap-3 bg-[#19245a] rounded-full px-5 py-3 shadow-md shadow-black/30">
                                <Mail size={20} className="text-indigo-200" />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full bg-transparent outline-none text-sm text-slate-100 placeholder:text-slate-300"
                                />
                            </div>

                          
                            <div className="flex items-center gap-3 bg-[#19245a] rounded-full px-5 py-3 shadow-md shadow-black/30">
                                <Phone size={20} className="text-indigo-200" />
                                <input
                                    type="tel"
                                    placeholder="Phone"
                                    className="w-full bg-transparent outline-none text-sm text-slate-100 placeholder:text-slate-300"
                                />
                            </div>

                            
                            <div className="flex items-center gap-3 bg-[#19245a] rounded-full px-5 py-3 shadow-md shadow-black/30">
                                <Lock size={20} className="text-indigo-200" />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="w-full bg-transparent outline-none text-sm text-slate-100 placeholder:text-slate-300"
                                />
                            </div>

                            
                            <div className="flex items-center gap-3 bg-[#19245a] rounded-full px-5 py-3 shadow-md shadow-black/30">
                                <CheckCircle size={20} className="text-indigo-200" />
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    className="w-full bg-transparent outline-none text-sm text-slate-100 placeholder:text-slate-300"
                                />
                            </div>

                         
                            <button
                                type="submit"
                                className="w-full mt-2 rounded-full bg-linear-to-r from-[#7c3aed] to-[#a855f7] py-3 text-sm font-semibold text-white shadow-lg shadow-purple-900/50 hover:scale-[1.02] transition-transform"
                            >
                                Register
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center gap-4 my-6">
                            <div className="h-px flex-1 bg-slate-600" />
                            <span className="text-xs uppercase tracking-[0.2em] text-slate-300">
                                or
                            </span>
                            <div className="h-px flex-1 bg-slate-600" />
                        </div>

                        {/* Already have account */}
                        <p className="text-center text-xs sm:text-sm text-slate-200">
                            If already you have an account, please{" "}
                            <Link
                                to=""
                                className="font-semibold text-indigo-400 hover:underline"
                            >
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
            
        </div>

        
    );
};

export default UserRegisterPage;
