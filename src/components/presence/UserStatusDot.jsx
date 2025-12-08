import { Circle } from "lucide-react";
import { useSocket } from "../../store/socket.context";

export default function UserStatusDot({ userId }) {
  const { userStatuses } = useSocket();
  const status = userStatuses[userId]?.status;

  const color =
    status === "online" ? "text-green-500" :
    status === "idle" ? "text-yellow-400" :
    status === "away" ? "text-orange-400" :
    status === "on_call" ? "text-purple-400" :
    "text-gray-500";

  return <Circle size={10} className={`${color} fill-current`} />;
}
