import React from "react";
import { ChatView } from "../components/ChatView";

const TrainerChatPage: React.FC = () => {
  return (
    <div className="w-full max-w-[1600px] mx-auto pb-12">
      {/*
       * Height strategy (trainer has NO navbar, no pt-[88px]):
       *   h-[calc(100dvh-100px)]
       *       100dvh          = full viewport height
       *       - 64px padding  = SidebarLayout p-8 top (32px) + bottom (32px)
       *       - 36px buffer   = top margin + rounding
       *
       * min-h-[520px] prevents collapse on small screens.
       * Same natural browser-scroll behavior as every other trainer page.
       */}
      <div className="w-full h-[calc(100dvh-100px)] min-h-[520px] rounded-2xl border border-white/10 overflow-hidden bg-[#0a0520]/95 shadow-2xl backdrop-blur-xl">
        <ChatView />
      </div>
    </div>
  );
};

export default TrainerChatPage;
