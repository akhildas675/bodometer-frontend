import React from "react";
import { ChatView } from "../components/ChatView";

const UserChatPage: React.FC = () => {
  return (
    <div className="py-4 px-2 sm:px-4 md:px-6">
      <ChatView />
    </div>
  );
};

export default UserChatPage;
