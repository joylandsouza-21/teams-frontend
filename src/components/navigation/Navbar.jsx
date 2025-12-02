import { CircleUser, Feather } from "lucide-react";

export default function Navbar() {
  return (
    <div className="w-screen bg-(--color-primary-background) h-12 border-b border-(--border-primary-color)  flex flex-row justify-between items-center px-4">
      <Feather className="" size={30}/>
      <CircleUser className="" size={30}/>
    </div>
  );
}
