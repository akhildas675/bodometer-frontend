import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import { useEffect, useState, useRef } from "react";
import userServices from "@/services/user/user.services";
import {
  Dumbbell,
  Users,
  BarChart3,
  Zap,
  ShieldCheck,
  Clock,
  ChevronRight,
  Star,
} from "lucide-react";

const FALLBACK_HERO =
  "https://bodometer-assets.s3.eu-north-1.amazonaws.com/Heroic%20images/bodometer_home_page_heroic.jpg";

/** Auto-cycling hero background pulled from real workout cover photos. */
const useDynamicHero = (isAuthenticated: boolean) => {
  const [images, setImages] = useState<string[]>([FALLBACK_HERO]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [nextIdx, setNextIdx] = useState(1);
  const [fading, setFading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Only fetch when the user is logged in (userApi requires auth)
  useEffect(() => {
    if (!isAuthenticated) return;

    userServices
      .getWorkouts(1, 8)
      .then((res) => {
        const imgs = (res.data ?? [])
          .map((w) => w.coverPhoto || w.workoutImage)
          .filter(Boolean);
        setImages(imgs.length ? imgs : [FALLBACK_HERO]);
      })
      .catch(() => setImages([FALLBACK_HERO]));
  }, [isAuthenticated]);

  // Cycle images
  useEffect(() => {
    if (images.length <= 1) return;

    timerRef.current = setInterval(() => {
      const next = (activeIdx + 1) % images.length;
      setNextIdx(next);
      setFading(true);
      setTimeout(() => {
        setActiveIdx(next);
        setFading(false);
      }, 800);
    }, 4000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [images, activeIdx]);

  const current = images[activeIdx] ?? FALLBACK_HERO;
  const next    = images[nextIdx]   ?? FALLBACK_HERO;

  return { current, next, fading };
};


const WHY_FEATURES = [
  {
    icon: Dumbbell,
    title: "Expert-Curated Workouts",
    desc: "Access a library of structured programs designed by certified trainers for every fitness level.",
  },
  {
    icon: Users,
    title: "Certified Trainers",
    desc: "Connect with experienced personal coaches who keep you accountable and guide your journey.",
  },
  {
    icon: BarChart3,
    title: "Smart Progress Tracking",
    desc: "Visualise your improvement over time with detailed metrics and session history.",
  },
  {
    icon: Zap,
    title: "Personalised Plans",
    desc: "Get workouts tailored to your goals, schedule, and fitness background — not one-size-fits-all.",
  },
  {
    icon: ShieldCheck,
    title: "Safe & Science-Backed",
    desc: "Every program follows exercise science principles to maximise results while minimising injury risk.",
  },
  {
    icon: Clock,
    title: "Train On Your Schedule",
    desc: "Whether you have 20 minutes or 90, we have a workout that fits your day.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Create Your Profile",
    desc: "Tell us your fitness history, goals, and availability so we can match you with the perfect plan.",
  },
  {
    step: "02",
    title: "Choose a Plan",
    desc: "Browse trainer-led programs or pick a self-guided workout library tailored to your goals.",
  },
  {
    step: "03",
    title: "Start Training",
    desc: "Follow your personalised schedule, log sessions, and watch your progress compound over time.",
  },
];

const TESTIMONIALS = [
  {
    name: "Arjun Mehta",
    role: "Lost 12 kg in 3 months",
    quote:
      "Bodometer completely changed how I approach fitness. The trainer matching is spot on — my coach understood exactly what I needed.",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "First marathon finisher",
    quote:
      "I went from barely running 2 km to completing my first marathon. The structured programs and progress tracking kept me motivated every single day.",
    rating: 5,
  },
  {
    name: "Rahul Verma",
    role: "Gained 8 kg of muscle",
    quote:
      "The workout library is incredible. Every exercise has clear guidance and I've hit PRs I never thought possible within six months.",
    rating: 5,
  },
];

const STATS = [
  { value: "10K+", label: "Active Users" },
  { value: "500+", label: "Workout Programs" },
  { value: "120+", label: "Certified Trainers" },
  { value: "4.9★", label: "Average Rating" },
];

// ── Sub-components ─────────────────────────────────────────────────────────

const StatsBanner = () => (
  <div className="w-full bg-purple-900/30 border-y border-purple-700/30 py-8">
    <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 px-6 text-center">
      {STATS.map((s) => (
        <div key={s.label}>
          <p className="text-3xl md:text-4xl font-extrabold text-white">{s.value}</p>
          <p className="text-purple-300 text-sm mt-1">{s.label}</p>
        </div>
      ))}
    </div>
  </div>
);

const WhySection = () => (
  <section className="py-20 px-6 max-w-6xl mx-auto">
    <div className="text-center mb-14">
      <h2 className="text-3xl md:text-4xl font-extrabold text-white">
        Why Choose <span className="text-purple-400">Bodometer?</span>
      </h2>
      <p className="text-white/50 mt-3 max-w-xl mx-auto">
        Everything you need to transform your fitness — in one platform.
      </p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {WHY_FEATURES.map(({ icon: Icon, title, desc }) => (
        <div
          key={title}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-500/40 hover:-translate-y-1 transition-all duration-300"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-600/20 flex items-center justify-center mb-4">
            <Icon size={22} className="text-purple-400" />
          </div>
          <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
          <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
        </div>
      ))}
    </div>
  </section>
);

const HowItWorksSection = () => (
  <section className="py-20 px-6 bg-white/5 w-full">
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white">
          How It <span className="text-purple-400">Works</span>
        </h2>
        <p className="text-white/50 mt-3">Get started in three simple steps.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {/* Connecting line on desktop */}
        <div className="hidden md:block absolute top-8 left-[calc(16.6%+1rem)] right-[calc(16.6%+1rem)] h-px bg-purple-700/40" />
        {HOW_IT_WORKS.map(({ step, title, desc }) => (
          <div key={step} className="text-center relative">
            <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-white text-xl font-extrabold mx-auto mb-5 relative z-10">
              {step}
            </div>
            <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
            <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const TestimonialsSection = () => (
  <section className="py-20 px-6 max-w-6xl mx-auto">
    <div className="text-center mb-14">
      <h2 className="text-3xl md:text-4xl font-extrabold text-white">
        Real People. <span className="text-purple-400">Real Results.</span>
      </h2>
      <p className="text-white/50 mt-3">
        Thousands of members have already transformed with Bodometer.
      </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {TESTIMONIALS.map(({ name, role, quote, rating }) => (
        <div
          key={name}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4 hover:border-purple-500/40 transition-all duration-300"
        >
          <div className="flex gap-1">
            {Array.from({ length: rating }).map((_, i) => (
              <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
            ))}
          </div>
          <p className="text-white/70 text-sm leading-relaxed flex-1">"{quote}"</p>
          <div>
            <p className="text-white font-semibold text-sm">{name}</p>
            <p className="text-purple-400 text-xs mt-0.5">{role}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const CtaBanner = ({
  isAuthenticated,
  user,
  navigate,
}: {
  isAuthenticated: boolean;
  user: { name?: string } | null;
  navigate: (to: string) => void;
}) => (
  <section className="py-20 px-6">
    <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-purple-700/30 to-purple-900/40 border border-purple-500/30 rounded-3xl p-12">
      {isAuthenticated && user ? (
        <>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Welcome back{user.name ? `, ${user.name.split(" ")[0]}` : ""}
          </h2>
          <p className="text-white/60 mb-8">
            Your next workout is waiting. Keep the momentum going.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/workouts")}
              className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-full font-semibold transition flex items-center gap-2 justify-center"
            >
              Browse Workouts <ChevronRight size={16} />
            </button>
            <button
              onClick={() => navigate("/trainers")}
              className="border border-purple-500 text-purple-300 hover:bg-purple-700/30 px-8 py-3 rounded-full font-semibold transition"
            >
              Find a Trainer
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Start Your Transformation Today
          </h2>
          <p className="text-white/60 mb-8">
            Join thousands of members already hitting their goals with Bodometer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/register")}
              className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-full font-semibold transition flex items-center gap-2 justify-center"
            >
              Get Started Free <ChevronRight size={16} />
            </button>
            <button
              onClick={() => navigate("/login")}
              className="border border-purple-500 text-purple-300 hover:bg-purple-700/30 px-8 py-3 rounded-full font-semibold transition"
            >
              I Already Have an Account
            </button>
          </div>
        </>
      )}
    </div>
  </section>
);

// ── Main page ──────────────────────────────────────────────────────────────

const UserHome = () => {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const { current, next, fading } = useDynamicHero(isAuthenticated);

  return (
    <div
      className="min-h-screen w-full text-white"
      style={{ background: "linear-gradient(to bottom, #190473 0%, #03000D 60%, #03000D 100%)" }}
    >
      {/* ── Hero ── */}
      <div className="relative w-full h-[90vh] overflow-hidden flex items-center">

        {/* Current image layer */}
        <div
          className="absolute inset-0 bg-center bg-cover transition-opacity duration-700"
          style={{
            backgroundImage: `url('${current}')`,
            opacity: fading ? 0 : 1,
          }}
        />

        {/* Next image layer (fades in during transition) */}
        <div
          className="absolute inset-0 bg-center bg-cover transition-opacity duration-700"
          style={{
            backgroundImage: `url('${next}')`,
            opacity: fading ? 1 : 0,
          }}
        />

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />

        {/* Content */}
        <div className="relative z-10 w-full px-10 md:px-16 flex justify-between items-center">
          <div>
            <h1 className="text-white text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-lg">
              TRANSFORM <br /> YOUR BODY WITH
            </h1>
            <div className="mt-2">
              <img
                src="/Bodometer Logo corrected 1.png"
                alt="Bodometer logo"
                className="w-[220px] md:w-[300px] drop-shadow-lg"
              />
            </div>
            <p className="text-white text-base md:text-lg mt-4 drop-shadow">
              EXPERT COACHES, SMART TRACKING, <br /> REAL RESULTS.
            </p>
          </div>

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
                  onClick={() => navigate("/subscriptions")}
                  className="bg-purple-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-purple-600 transition"
                >
                  Get Started
                </button>
                <p className="text-white text-sm mt-2">Continue where you left off</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Stats Banner ── */}
      <StatsBanner />

      {/* ── Why Bodometer ── */}
      <WhySection />

      {/* ── How It Works ── */}
      <HowItWorksSection />

      {/* ── Testimonials ── */}
      <TestimonialsSection />

      {/* ── CTA Banner ── */}
      <CtaBanner isAuthenticated={isAuthenticated} user={user} navigate={navigate} />
    </div>
  );
};

export default UserHome;