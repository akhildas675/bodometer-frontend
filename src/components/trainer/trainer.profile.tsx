import React from "react";

const TrainerProfile = () => {
  return (
    <div className="min-h-screen bg-[#050017] flex">
      {/* SIDEBAR */}
      <aside className="w-64 bg-gradient-to-b from-[#1a0b3a] to-[#12062a] rounded-r-[40px] p-6 text-white">
        {/* Logo */}
        <div className="text-2xl font-bold text-sky-400 mb-10">
          bodo<span className="text-blue-500">meter</span>
        </div>

        {/* Profile Card */}
        <div className="flex flex-col items-center mb-10">
          <img
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2"
            className="h-20 w-20 rounded-full object-cover border-4 border-purple-500"
            alt="profile"
          />
          <h3 className="mt-3 font-semibold">Madison Smith</h3>
          <p className="text-xs text-slate-300">madisons@gmail.com</p>
          <p className="text-xs text-slate-400">Birthday: April 1st</p>
        </div>

        {/* MENU */}
        <nav className="space-y-4 text-sm">
          {[
            "Dashboard",
            "Sessions",
            "Clients",
            "Messages",
            "Slots",
            "Earnings",
            "Profile",
            "Logout",
          ].map((item) => (
            <div
              key={item}
              className={`px-4 py-2 rounded-lg cursor-pointer ${
                item === "Profile"
                  ? "bg-purple-600"
                  : "hover:bg-white/10"
              }`}
            >
              {item}
            </div>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10">
        <h1 className="text-2xl font-semibold text-white mb-6">Profile</h1>

        {/* PROFILE CARD */}
        <div className="relative bg-gradient-to-br from-[#140b3a] to-[#0a0624] rounded-3xl p-8 text-white shadow-xl">
          <span className="absolute top-6 right-6 text-green-400 text-sm">
            Active
          </span>

          <div className="flex gap-10">
            {/* LEFT */}
            <div className="w-1/3">
              <div className="relative w-40 h-40 mx-auto">
                <img
                  src="https://images.unsplash.com/photo-1599058917212-d750089bc07a"
                  alt="trainer"
                  className="w-full h-full rounded-full object-cover border-4 border-green-500"
                />
              </div>

              <h2 className="mt-4 text-center text-lg font-semibold">
                Alexa Rawles
              </h2>
              <p className="text-center text-xs text-slate-300">
                alexarawles@gmail.com
              </p>
              <p className="text-center text-xs text-green-400 mt-1">
                Certified
              </p>

              <div className="mt-6 space-y-3">
                <select className="w-full bg-[#1c1550] rounded-lg px-4 py-2 text-sm">
                  <option>Female</option>
                </select>

                <input
                  type="text"
                  value="08/05/1998"
                  readOnly
                  className="w-full bg-[#1c1550] rounded-lg px-4 py-2 text-sm"
                />
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex-1 grid grid-cols-2 gap-6">
              <input
                type="text"
                value="7896541230"
                readOnly
                className="bg-[#1c1550] rounded-lg px-4 py-2 text-sm"
              />

              <select className="bg-[#1c1550] rounded-lg px-4 py-2 text-sm">
                <option>5 Years Experience</option>
              </select>

              <select className="bg-[#1c1550] rounded-lg px-4 py-2 text-sm col-span-2">
                <option>Specialization</option>
              </select>

              {/* Tags */}
              <div className="flex gap-3 col-span-2">
                {["Strength Training", "Functional Fitness", "Cardio"].map(
                  (tag) => (
                    <div
                      key={tag}
                      className="flex items-center gap-2 bg-[#1c1550] px-4 py-2 rounded-full text-sm"
                    >
                      {tag}
                      <span className="h-4 w-4 bg-purple-500 rounded-full flex items-center justify-center text-xs">
                        ✓
                      </span>
                    </div>
                  )
                )}
              </div>

              {/* BIO */}
              <textarea
                readOnly
                rows={4}
                className="col-span-2 bg-[#1c1550] rounded-lg px-4 py-3 text-sm resize-none"
                value="Hi, I'm Natasha, a certified personal trainer passionate about sustainable, real-world fitness..."
              />

              {/* STATS */}
              <div className="flex items-center gap-6 col-span-2">
                <div className="flex items-center gap-2 text-sm">
                  ⭐ <span className="font-semibold">4.9</span>
                </div>
                <div className="text-sm text-slate-300">
                  250+ Session Conducted
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TrainerProfile;
