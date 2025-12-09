import {
  Check,
  Clock,
  MinusCircle,
  XCircle,
  Circle
} from "lucide-react";

export const STATUS_OPTIONS = [
  {
    key: "online",
    label: "Available",
    icon: (props) => (
      <Check
        size={14}
        style={{ color: "black", backgroundColor: '#22c55e', borderRadius: '50%' }}
        {...props}
      />
    ),
  },
  {
    key: "busy",
    label: "Busy",
    icon: (props) => (
      <XCircle
        size={14}
        style={{ color: "black", backgroundColor: '#ef4444', borderRadius: '50%' }}
        {...props}
      />
    ),
  },
  {
    key: "dnd",
    label: "Do not disturb",
    icon: (props) => (
      <MinusCircle
        size={14}
        style={{ color: "black", backgroundColor: '#ef4444', borderRadius: '50%' }}
        {...props}
      />
    ),
  },
  {
    key: "idle",
    label: "Be right back",
    icon: (props) => (
      <Clock
        size={14}
        style={{ color: "black", backgroundColor: '#eab308', borderRadius: '50%' }}
        {...props}
      />
    ),
  },
  {
    key: "away",
    label: "Appear away",
    icon: (props) => (
      <Clock
        size={14}
        style={{ color: "black", backgroundColor: '#facc15', borderRadius: '50%' }}
        {...props}
      />
    ),
  },
  {
    key: "offline",
    label: "Appear offline",
    icon: (props) => (
      <XCircle
        size={12}
        style={{ color: "#9ca3af" }}
        {...props}
      />
    ),
  },
];

export const getStatusByKey = (key) => {
  return STATUS_OPTIONS.find((s) => s.key === key);
};
