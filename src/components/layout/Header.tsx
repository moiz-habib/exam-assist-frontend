
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="font-semibold text-lg text-primary">
            <span className="font-bold">Pro</span>Assist
          </div>
          {user && <span className="text-sm text-gray-500 hidden md:inline">| {user.role === "teacher" ? "Teacher Dashboard" : "Student Portal"}</span>}
        </div>

        <div className="flex items-center">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2">
                <User size={18} className="text-gray-500" />
                <span className="text-sm font-medium">{user?.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
              >
                <LogOut size={18} />
                <span className="ml-1 hidden md:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <Button size="sm" onClick={() => navigate("/login")}>
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
