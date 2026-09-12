import {
  subscribeToCallRequest,
  unsubscribeFromCallRequest,
  VideoCallRequestEvent,
} from "@/modules/video.session/socket/video-session.socket";
import { useVideoCallStore } from "@/stores/video-call.store";

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
