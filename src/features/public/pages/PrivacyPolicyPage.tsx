import { Link } from "react-router-dom";
import { Shield, Lock, Eye, Cookie } from "lucide-react";

const PrivacyPolicyPage = () => {
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
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-white/60 text-sm">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Introduction */}
        <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Shield className="w-6 h-6 text-purple-400" />
            Introduction
          </h2>
          <p className="text-white/80 leading-relaxed">
            This Privacy Policy explains how Bodometer collects, uses, and protects your personal information. 
            We are committed to safeguarding your privacy and ensuring the security of your data.
          </p>
        </div>

        {/* Information We Collect */}
        <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Lock className="w-6 h-6 text-purple-400" />
            Information We Collect
          </h2>
          <div className="space-y-4 text-white/80">
            <div>
              <h3 className="font-bold text-white mb-2">Account Information</h3>
              <p className="text-sm">Name, email address, profile picture, and fitness profile data.</p>
            </div>
            <div>
              <h3 className="font-bold text-white mb-2">Fitness Data</h3>
              <p className="text-sm">Workout history, progress tracking, health metrics, and fitness goals.</p>
            </div>
            <div>
              <h3 className="font-bold text-white mb-2">Usage Data</h3>
              <p className="text-sm">App usage patterns, session duration, and feature interactions.</p>
            </div>
            <div>
              <h3 className="font-bold text-white mb-2">Payment Information</h3>
              <p className="text-sm">Payment processing is handled securely through our payment partners. We do not store your full payment details.</p>
            </div>
          </div>
        </div>

        {/* How We Use Your Information */}
        <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Eye className="w-6 h-6 text-purple-400" />
            How We Use Your Information
          </h2>
          <ul className="space-y-2 text-white/80 list-disc list-inside">
            <li>To provide personalized workout plans and fitness recommendations</li>
            <li>To track your progress and improve our services</li>
            <li>To facilitate video sessions with trainers</li>
            <li>To process payments and manage subscriptions</li>
            <li>To communicate important updates and service information</li>
            <li>To ensure security and prevent fraud</li>
          </ul>
        </div>

        {/* Cookies */}
        <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Cookie className="w-6 h-6 text-purple-400" />
            Cookies and Tracking
          </h2>
          <p className="text-white/80 leading-relaxed mb-4">
            We use cookies and similar technologies to authenticate users, remember preferences, and analyze usage patterns. 
            You can control cookie settings through your browser preferences.
          </p>
          <p className="text-white/60 text-sm">
            We use HttpOnly cookies for authentication tokens to enhance security.
          </p>
        </div>

        {/* Data Security */}
        <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold mb-4">Data Security</h2>
          <p className="text-white/80 leading-relaxed">
            We implement industry-standard security measures to protect your data, including encryption, 
            secure authentication protocols, and regular security audits. However, no method of transmission 
            over the internet is 100% secure.
          </p>
        </div>

        {/* Your Rights */}
        <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
          <ul className="space-y-2 text-white/80 list-disc list-inside">
            <li>Access to your personal data</li>
            <li>Correction of inaccurate data</li>
            <li>Deletion of your account and data</li>
            <li>Opt-out of marketing communications</li>
            <li>Data portability</li>
          </ul>
        </div>

        {/* Contact */}
        <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
          <p className="text-white/80 leading-relaxed">
            If you have questions about this Privacy Policy or our data practices, please contact us through 
            our support channels or via email.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-500/10 rounded-2xl p-8 border border-yellow-500/20">
          <p className="text-yellow-200 text-sm leading-relaxed">
            <strong>Disclaimer:</strong> This is a template privacy policy. For actual legal compliance, 
            please consult with legal professionals to ensure this policy meets your specific requirements 
            and applicable laws in your jurisdiction.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
