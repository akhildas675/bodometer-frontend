import { Navigate, useParams } from "react-router-dom";
import VideoSession from "../components/video.session";

function VideoSessionPage() {
  const { videoSessionId } = useParams<{ videoSessionId: string }>();

  if (!videoSessionId) {
    return <Navigate to="/" replace />;
  }

  return <VideoSession videoSessionId={videoSessionId} />;
}

export default VideoSessionPage;