import { Link } from "react-router-dom";
import { FileText, AlertCircle, Users, CreditCard } from "lucide-react";

const TermsOfServicePage = () => {
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
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Terms of Service</h1>
        <p className="text-white/60 text-sm">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Agreement */}
        <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6 text-purple-400" />
            Agreement to Terms
          </h2>
          <p className="text-white/80 leading-relaxed">
            By accessing or using Bodometer, you agree to be bound by these Terms of Service. 
            If you do not agree to these terms, please do not use our service.
          </p>
        </div>

        {/* User Responsibilities */}
        <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-400" />
            User Responsibilities
          </h2>
          <ul className="space-y-2 text-white/80 list-disc list-inside">
            <li>Provide accurate and complete information in your profile</li>
            <li>Maintain the security of your account credentials</li>
            <li>Use the service for personal, non-commercial purposes</li>
            <li>Respect trainers and other users in the community</li>
            <li>Follow all applicable laws and regulations</li>
            <li>Not attempt to reverse engineer or exploit the platform</li>
          </ul>
        </div>

        {/* Subscription and Payments */}
        <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-purple-400" />
            Subscription and Payments
          </h2>
          <div className="space-y-4 text-white/80">
            <p>
              <strong>Subscription Terms:</strong> Premium subscriptions are billed on a recurring basis. 
              You can cancel your subscription at any time through your account settings.
            </p>
            <p>
              <strong>Refund Policy:</strong> Refunds are handled on a case-by-case basis. 
              Please refer to our refund policy for specific details.
            </p>
            <p>
              <strong>Payment Security:</strong> All payments are processed securely through our payment partners. 
              We do not store your complete payment information.
            </p>
          </div>
        </div>

        {/* Trainer Services */}
        <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold mb-4">Trainer Services</h2>
          <div className="space-y-4 text-white/80">
            <p>
              <strong>Booking:</strong> Video sessions with trainers must be booked in advance. 
              Cancellations should follow our cancellation policy.
            </p>
            <p>
              <strong>Conduct:</strong> Both trainers and users must maintain professional conduct during sessions. 
              Harassment or inappropriate behavior will result in account termination.
            </p>
            <p>
              <strong>Technical Requirements:</strong> Users are responsible for having appropriate equipment 
              and internet connection for video sessions.
            </p>
          </div>
        </div>

        {/* Limitation of Liability */}
        <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-purple-400" />
            Limitation of Liability
          </h2>
          <p className="text-white/80 leading-relaxed">
            Bodometer is not liable for any indirect, incidental, special, or consequential damages 
            arising from your use of the service. Our liability is limited to the maximum extent 
            permitted by applicable law.
          </p>
        </div>

        {/* Termination */}
        <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold mb-4">Termination</h2>
          <p className="text-white/80 leading-relaxed">
            We reserve the right to suspend or terminate your account if you violate these Terms of Service 
            or engage in fraudulent or harmful activities. You may also terminate your account at any time 
            through your account settings.
          </p>
        </div>

        {/* Changes to Terms */}
        <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold mb-4">Changes to Terms</h2>
          <p className="text-white/80 leading-relaxed">
            We may update these Terms of Service from time to time. We will notify users of significant changes 
            through the app or email. Continued use of the service after changes constitutes acceptance.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-500/10 rounded-2xl p-8 border border-yellow-500/20">
          <p className="text-yellow-200 text-sm leading-relaxed">
            <strong>Disclaimer:</strong> This is a template terms of service. For actual legal compliance, 
            please consult with legal professionals to ensure these terms meet your specific requirements 
            and applicable laws in your jurisdiction.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
