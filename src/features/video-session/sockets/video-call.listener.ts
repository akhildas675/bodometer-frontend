import {
  subscribeToCallRequest,
  unsubscribeFromCallRequest,
  VideoCallRequestEvent,
} from "@/features/video-session/sockets/video-session.socket";
import { useVideoCallStore } from "@/features/video-session/stores/video-call.store";

export const initializeVideoCallSocket = () => {
  const handleCallRequest = (data: VideoCallRequestEvent) => {
    console.log("Incoming video:call-request:", data.videoSessionId);
    useVideoCallStore.getState().setIncomingCall(data.videoSessionId);
  };

  subscribeToCallRequest(handleCallRequest);

  return () => {
    unsubscribeFromCallRequest(handleCallRequest);
  };
};
