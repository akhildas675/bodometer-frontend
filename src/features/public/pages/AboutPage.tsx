import { Link } from "react-router-dom";
import { Dumbbell, Target, Users, Shield } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#050017] text-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors mb-8"
        >
          ← Back to Home
        </Link>
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">About Bodometer</h1>
        <p className="text-xl text-white/70 max-w-3xl">
          Your AI-powered fitness companion for personalized workout plans, expert coaching, and real progress tracking.
        </p>
      </div>

      {/* Mission */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 rounded-3xl p-8 sm:p-12 border border-white/10">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-white/80 leading-relaxed max-w-3xl">
            At Bodometer, we believe that fitness should be personalized, accessible, and data-driven. 
            Our platform combines cutting-edge AI technology with expert human coaching to deliver 
            workout plans that adapt to your unique fitness goals, schedule, and progress.
          </p>
        </div>
      </div>

      {/* Values */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-8">What We Stand For</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <Dumbbell className="w-10 h-10 text-purple-400 mb-4" />
            <h3 className="font-bold text-lg mb-2">Personalization</h3>
            <p className="text-white/60 text-sm">
              Every workout plan is tailored to your unique profile and goals.
            </p>
          </div>
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <Target className="w-10 h-10 text-purple-400 mb-4" />
            <h3 className="font-bold text-lg mb-2">Results</h3>
            <p className="text-white/60 text-sm">
              Track your progress with detailed analytics and achieve real results.
            </p>
          </div>
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <Users className="w-10 h-10 text-purple-400 mb-4" />
            <h3 className="font-bold text-lg mb-2">Community</h3>
            <p className="text-white/60 text-sm">
              Connect with certified trainers and fitness enthusiasts.
            </p>
          </div>
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <Shield className="w-10 h-10 text-purple-400 mb-4" />
            <h3 className="font-bold text-lg mb-2">Quality</h3>
            <p className="text-white/60 text-sm">
              Expert-vetted trainers and science-backed workout programs.
            </p>
          </div>
        </div>
      </div>

      {/* Story */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-8">Our Story</h2>
        <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
          <p className="text-white/80 leading-relaxed mb-4">
            Bodometer was founded with a simple vision: make professional fitness coaching accessible to everyone. 
            We noticed that while many people wanted to get fit, they struggled with generic workout plans 
            that didn't account for their individual needs, schedules, or fitness levels.
          </p>
          <p className="text-white/80 leading-relaxed mb-4">
            Our solution combines the best of both worlds - AI-powered personalization for scale and efficiency, 
            paired with human trainers for motivation, form correction, and accountability. This hybrid approach 
            ensures you get a plan that's truly yours, with the support you need to succeed.
          </p>
          <p className="text-white/80 leading-relaxed">
            Today, Bodometer serves thousands of users across the globe, helping them achieve their fitness goals 
            through personalized workout plans, real-time video coaching, and comprehensive progress tracking.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
