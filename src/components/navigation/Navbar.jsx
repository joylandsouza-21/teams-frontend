import { useEffect, useRef, useState } from "react";
import {
  CircleUser,
  Feather,
  Check,
  Clock,
  MinusCircle,
  XCircle,
  Circle
} from "lucide-react";
import { useAuth } from "../../store/auth.context";
import { useSocket } from "../../store/socket.context";

const STATUS_OPTIONS = [
  { key: "online", label: "Available", icon: <Check className="text-green-500" size={14} /> },
  { key: "busy", label: "Busy", icon: <XCircle className="text-red-500" size={14} /> },
  { key: "dnd", label: "Do not disturb", icon: <MinusCircle className="text-red-500" size={14} /> },
  { key: "idle", label: "Be right back", icon: <Clock className="text-yellow-500" size={14} /> },
  { key: "away", label: "Appear away", icon: <Clock className="text-yellow-400" size={14} /> },
  { key: "offline", label: "Appear offline", icon: <Circle className="text-gray-400" size={12} /> },
];

export default function Navbar() {
  const { auth, logout } = useAuth();
  const { socket, userStatuses } = useSocket();

  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  const myStatus = userStatuses?.[auth?.user?.id]?.status || "online";

  // ✅ Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Manual Status Change
  const handleStatusChange = (status) => {
    socket.emit("set_manual_status", { status });
    setOpen(false);
  };

  return (
    <div className="w-screen h-12 bg-(--color-primary-background)
        border-b border-(--border-primary-color)
        flex justify-between items-center px-4 relative">

      <Feather size={28} />

      {/* ✅ PROFILE ICON */}
      <div ref={menuRef} className="relative">
        <button onClick={() => setOpen(p => !p)}>
          {auth?.user?.profile_pic ? (
            <img
              src={auth.user.profile_pic}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <CircleUser size={30} />
          )}
        </button>

        {/* ✅ DROPDOWN */}
        {open && (
          <div className="absolute right-0 top-11 w-72 
              bg-[#1f1f1f] border border-gray-700
              rounded-xl shadow-xl z-50 overflow-hidden">

            {/* ✅ USER INFO */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-700">
              {auth?.user?.profile_pic ? (
                <img
                  src={auth.user.profile_pic}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <CircleUser size={44} />
              )}

              <div className="min-w-0">
                <div className="text-sm font-semibold text-white truncate">
                  {auth?.user?.name}
                </div>
                <div className="text-xs text-gray-400 truncate">
                  {auth?.user?.email}
                </div>
              </div>
            </div>

            {/* ✅ CURRENT STATUS */}
            <div className="px-4 py-2 border-b border-gray-700 text-sm text-gray-300 flex items-center gap-2">
              <span className="capitalize">{myStatus}</span>
            </div>

            {/* ✅ STATUS OPTIONS */}
            <div className="py-1">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s.key}
                  onClick={() => handleStatusChange(s.key)}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm
                    hover:bg-[#2b2b2b] transition
                    ${myStatus === s.key ? "bg-[#2b2b2b]" : ""}`}
                >
                  {s.icon}
                  <span className="flex-1 text-left">{s.label}</span>
                  {myStatus === s.key && <Check size={14} />}
                </button>
              ))}
            </div>

            {/* ✅ SIGN OUT */}
            <button
              onClick={logout}
              className="w-full text-left px-4 py-3 text-sm
                text-red-400 hover:bg-[#2b2b2b]
                border-t border-gray-700"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
