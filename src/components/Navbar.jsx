import { CircleUser, Feather } from "lucide-react";

export default function Navbar() {
  return (
    <div className="w-screen bg-black h-12 border-b border-gray-800  flex flex-row justify-between items-center px-4">
      <Feather className="text-white" size={30}/>
      <CircleUser className="text-white" size={30}/>
    </div>
  );
}
