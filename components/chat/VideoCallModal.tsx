"use client";
import {
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track } from "livekit-client";
import { X } from "lucide-react";

interface VideoCallModalProps {
  room: string;
  token: string;
  onDisconnect: () => void;
}

export default function VideoCallModal({ room, token, onDisconnect }: VideoCallModalProps) {
  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md">
      <div className="relative w-full max-w-4xl h-[80vh] bg-black rounded-[40px] overflow-hidden shadow-2xl border border-white/10">
        
        {/* ক্লোজ বাটন */}
        <button 
          onClick={onDisconnect}
          className="absolute top-6 right-6 z-10 p-3 bg-white/10 hover:bg-red-500 rounded-2xl text-white transition-all"
        >
          <X size={20} />
        </button>

        <LiveKitRoom
          video={true}
          audio={true}
          token={token}
          serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
          onDisconnected={onDisconnect}
          data-lk-theme="default"
          style={{ height: '100%' }}
        >
          <MyVideoConference />
          <RoomAudioRenderer />
          <ControlBar />
        </LiveKitRoom>
      </div>
    </div>
  );
}

function MyVideoConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );
  return (
    <GridLayout tracks={tracks} style={{ height: 'calc(100% - 75px)' }}>
      <ParticipantTile />
    </GridLayout>
  );
}