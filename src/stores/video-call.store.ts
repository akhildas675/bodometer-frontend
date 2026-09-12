import { create } from "zustand";

interface VideoCallState {
  incomingVideoSessionId: string | null;
  setIncomingCall: (videoSessionId: string) => void;
  clearIncomingCall: () => void;
}

export const useVideoCallStore = create<VideoCallState>((set) => ({
  incomingVideoSessionId: null,
  setIncomingCall: (videoSessionId: string) =>
    set({ incomingVideoSessionId: videoSessionId }),
  clearIncomingCall: () => set({ incomingVideoSessionId: null }),
}));
