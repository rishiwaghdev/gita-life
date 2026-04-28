import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Users, UserPlus, BookOpen, LogOut, Home, Sparkles } from 'lucide-react';
import logo from '../assets/gita-life-logo.png';

const Layout = ({ children }) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: Home },
    { label: 'Leads', path: '/dashboard/leads', icon: UserPlus },
    { label: 'Students', path: '/dashboard/students', icon: Users },
    { label: 'Batches', path: '/dashboard/batches', icon: BookOpen },
  ];

  return (
    <div className="flex min-h-screen bg-transparent">
      {/* Sidebar */}
      <aside className="w-72 devotional-panel flex flex-col m-4 mr-0 overflow-hidden">
        <div className="p-5 border-b border-[#ecd8b7] bg-[#fff5e2]">
          <div className="flex items-center gap-4">
            <img
              src={logo}
              alt="Gita Life Program logo"
              className="h-16 w-16 rounded-[20px] border border-[#f1d19d] object-cover shadow-sm"
            />
            <div>
              <h2 className="text-2xl font-bold text-primary-700">Gita Life</h2>
              <p className="text-sm devotional-muted mt-1 flex items-center gap-2">
                <Sparkles size={14} />
                Seva Desk Admin
              </p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 p-3 rounded-md transition-colors ${
                  isActive ? 'bg-[#ffebc8] text-primary-700 font-semibold border border-[#efcf98]' : 'text-[#6c5546] hover:bg-[#fff4de] hover:text-[#442d20]'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-[#ecd8b7]">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-[#6c5546] hover:text-red-700 w-full p-2 transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
