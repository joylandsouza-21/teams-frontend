import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";

import { joinCallApi, endCallApi } from "../../api/call.api";
import { useAuth } from "../../store/auth.context";
import { useSocket } from "../../store/socket.context";
import { toastError } from "../../utils/toast";
import CustomVideoConference from "../../features/calls/components/CustomVideoConference";

export default function CallPage() {
  const { callId } = useParams();
  const { auth } = useAuth();
  const { socket, isSocketConnected } = useSocket();

  const [lkToken, setLkToken] = useState(null);
  const [roomName, setRoomName] = useState(null);
  const [loading, setLoading] = useState(true);

  const joinedRef = useRef(false);

  useEffect(() => {
    if (!callId) return;
    if (!auth?.token) return;        
    if (!isSocketConnected) return; 
    if (joinedRef.current) return;

    joinedRef.current = true;

    const joinCall = async () => {
      try {
        const res = await joinCallApi({ token: auth?.token, body: { callId } });
        const { token, roomName } = res.data;
        setLkToken(token);
        setRoomName(roomName);
        setLoading(false);

        socket.emit("join_call_room", { callId });

      } catch (err) {
        console.error("Join call failed:", err);
        toastError(err?.response?.data?.error)
      }
    };

    joinCall();
  }, [callId, auth?.token, isSocketConnected, socket]);

  useEffect(() => {
    if (!socket) return;

    const onRemoteEnd = ({ callId: endedId }) => {
      if (endedId === callId) {
        console.log("Call ended by remote user");
      }
    };

    socket.on("call_ended", onRemoteEnd);

    return () => {
      socket.off("call_ended", onRemoteEnd);
    };
  }, [socket, callId]);

  const handleEndCall = async () => {
    try {
      await endCallApi({ token: auth?.token, body: { callId } });

      // notify others via socket
      socket.emit("leave_call", { callId });

    } catch (err) {
      console.error("End call failed:", err);
      toastError(err?.response?.data?.error)
    }
  };

  if (!isSocketConnected) return <div>Connecting secure channel...</div>;
  if (loading || !lkToken) return <div>Joining call...</div>;

  return (
    <div className="relative w-full h-screen">
      <LiveKitRoom
        token={lkToken}
        serverUrl={import.meta.env.VITE_LIVEKIT_URL}
        connect={true}
        video={true}
        audio={true}
        data-lk-theme="default"
        onDisconnected={handleEndCall}
        style={{ height: "100vh" }}
      >
        <CustomVideoConference />
      </LiveKitRoom>
    </div>
  );
}
