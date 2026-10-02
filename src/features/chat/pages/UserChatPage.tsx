import React from "react";
import { ChatView } from "../components/ChatView";
import { RecommendedTrainers } from "../components/RecommendedTrainers";

const UserChatPage: React.FC = () => {
  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-8 pb-12">
      {/*
       * Chat Workspace Card
       *
       * Height strategy — same natural scroll as every other page (Trainers, etc.):
       *   • h-[calc(100dvh-180px)] fills nearly the full viewport every time:
       *       100dvh           = full viewport height
       *       - 88px  navbar   = 88px  (pt-[88px] pushes content below fixed navbar)
       *       - 64px  padding  = SidebarLayout p-8 top (32px) + bottom (32px)
       *       - 28px  buffer   = space-y-8 top margin + rounding
       *   • min-h-[520px] prevents the card from collapsing on tiny screens.
       *
       * With this approach:
       *   - No extra scrollbar on the card itself for the layout.
       *   - The messages list inside ChatView scrolls via its own overflow-y-auto.
       *   - The browser's native scrollbar (same as Trainers page) lets the user
       *     scroll down to see RecommendedTrainers below.
       */}
      <div className="w-full h-[calc(100dvh-180px)] min-h-[520px] rounded-2xl border border-white/10 overflow-hidden bg-[#0a0520]/95 shadow-2xl backdrop-blur-xl">
        <ChatView />
      </div>

      {/* Recommended Trainers — naturally below, reached by browser scroll */}
      <RecommendedTrainers />
    </div>
  );
};

export default UserChatPage;
