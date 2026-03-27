import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";

const UserHome = () => {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen w-full"
      style={{
        background: "linear-gradient(to bottom, #190473 0%, #03000D 100%)",
      }}
    >
      {/* Hero Section */}
      <div
        className="w-full h-[90vh] bg-center bg-cover flex items-center"
        style={{
          backgroundImage:
            "url('https://bodometer-assets.s3.eu-north-1.amazonaws.com/Heroic%20images/bodometer_home_page_heroic.jpg')",
        }}
      >
        <div className="w-full px-10 md:px-16 flex justify-between items-center">
          {/* LEFT CONTENT */}
          <div>
            <h1 className="text-white text-4xl md:text-6xl font-extrabold leading-tight">
              TRANSFORM <br /> YOUR BODY WITH
            </h1>
            <div className="mt-2">
              <img
                src="/Bodometer Logo corrected 1.png"
                alt="bodometer logo"
                className="w-[220px] md:w-[300px]"
              />
            </div>
            <p className="text-white text-base md:text-lg mt-4">
              EXPERT COACHES, SMART TRACKING, <br />
              REAL RESULTS.
            </p>
          </div>

          {/* RIGHT CTA */}
          <div className="flex flex-col items-center">
            {!isAuthenticated || !user ? (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="bg-purple-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-purple-600 transition"
                >
                  Login
                </button>
                <p className="text-white text-sm mt-2">Start With Free Plan</p>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/subscription")}
                  className="bg-purple-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-purple-600 transition"
                >
                  Get Started
                </button>
                <p className="text-white text-sm mt-2">
                  Continue where you left off
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Why Choose Section */}
      <div className="py-10 text-center text-white">
        <h2 className="text-2xl font-bold">Why Choose Bodometer?</h2>
      </div>
    </div>
  );
};

export default UserHome;