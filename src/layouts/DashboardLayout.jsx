import { Navigate, Outlet } from "react-router-dom";
import ProtectedRoute from "../routes/ProtectedRoute";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout() {

    return (
        <ProtectedRoute>
            <main className="">
                <div className="min-h-screen flex bg-gray-100 flex-col">
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
