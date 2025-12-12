import { Navigate, Outlet } from "react-router-dom";
import ProtectedRoute from "../routes/ProtectedRoute";
import Navbar from "../components/navigation/Navbar";
import Sidebar from "../components/navigation/Sidebar";
import usePresence from "../hooks/usePresence";
import { useSocket } from "../store/socket.context";
import { useAuth } from "../store/auth.context";

export default function DashboardLayout() {
    const { isSocketConnected } = useSocket();
    const { auth } = useAuth();

    if (auth?.token && !isSocketConnected) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-black text-white">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full" />
                    <p className="text-sm text-gray-400">
                        Connecting to chat server...
                    </p>
                </div>
            </div>
        );
    }

    usePresence();

    return (
        <ProtectedRoute>
            <main className="">
                <div className="min-h-screen flex flex-col">
                    <Navbar />
                    <div className="h-[calc(100vh-3rem)] flex flex-row">
                        <Sidebar />
                        <Outlet />
                    </div>
                </div>
            </main>
        </ProtectedRoute>
    );
}
