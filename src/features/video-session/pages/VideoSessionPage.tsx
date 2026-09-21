import { Navigate, useParams } from "react-router-dom";
import VideoSession from "@/features/video-session/components/VideoSessionView";

function VideoSessionPage() {
  const { videoSessionId } = useParams<{ videoSessionId: string }>();

  if (!videoSessionId) {
    return <Navigate to="/" replace />;
  }

  return <VideoSession videoSessionId={videoSessionId} />;
}

export default VideoSessionPage;