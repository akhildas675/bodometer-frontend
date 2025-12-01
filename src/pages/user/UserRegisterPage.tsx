import { Link } from "react-router-dom";
import { User, Mail, Phone, Lock, CheckCircle } from "lucide-react";
import { useState } from "react";
import InputWithIcon from "../../components/ui/Input";

const UserRegisterPage = () => {

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange =
        (field: "name" | "email" | "phone" | "password" | "confirmPassword") =>
            (e: React.ChangeEvent<HTMLInputElement>) => {
                setForm((prev) => ({
                    ...prev,
                    [field]: e.target.value,
                }));
            };


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

                            {/* Name  */}


                            <InputWithIcon
                                icon={<User size={20} className="text-indigo-200" />}
                                type="text"
                                placeholder="Name"
                                value={form.name}
                                onChange={handleChange("name")}

                            />

                            <InputWithIcon
                                icon={<Mail size={20} className="text-indigo-200" />}
                                type="email"
                                placeholder="Email"
                                value={form.email}
                                onChange={handleChange("email")}
                            />


                            <InputWithIcon
                                icon={<Phone size={20} className="text-indigo-200" />}
                                type="tel"
                                placeholder="Phone"
                                value={form.phone}
                                onChange={handleChange("phone")}
                            />

                            <InputWithIcon
                                icon={<Lock size={20} className="text-indigo-200" />}
                                type="password"
                                placeholder="Password"
                                value={form.password}
                                onChange={handleChange("password")}
                            />
                            <InputWithIcon
                                icon={<CheckCircle size={20} className="text-indigo-200" />}
                                type="password"
                                placeholder="Confirm Password"
                                value={form.password}
                                onChange={handleChange("confirmPassword")}
                            />



                            <button
                                type="submit"
                                className="w-full mt-2 rounded-full bg-linear-to-r from-[#7c3aed] to-[#a855f7] py-3 text-sm font-semibold text-white shadow-lg shadow-purple-900/50 hover:scale-[1.02] transition-transform"
                            >
                                Register
                            </button>
                        </form>


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
