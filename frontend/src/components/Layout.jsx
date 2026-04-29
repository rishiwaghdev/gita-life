import { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Users, UserPlus, BookOpen, LogOut, Home, Sparkles } from 'lucide-react';
import logo from '../assets/gita-life-logo.jpeg';

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
    <div className="min-h-screen bg-transparent lg:flex">
      {/* Sidebar */}
      <aside className="devotional-panel m-3 overflow-hidden lg:sticky lg:top-4 lg:m-4 lg:mr-0 lg:flex lg:min-h-[calc(100vh-2rem)] lg:w-72 lg:flex-col lg:self-start">
        <div className="border-b border-[#ecd8b7] bg-[#fff5e2] p-4 lg:p-5">
          <div className="flex items-center gap-4">
            <img
              src={logo}
              alt="Gita Life Program logo"
              className="h-12 w-12 shrink-0 rounded-[16px] border border-[#f1d19d] object-cover shadow-sm sm:h-14 sm:w-14 lg:h-16 lg:w-16 lg:rounded-[20px]"
            />
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-primary-700 sm:text-2xl">Gita Life</h2>
              <p className="devotional-muted mt-1 flex items-center gap-2 text-xs sm:text-sm">
                <Sparkles size={14} />
                Seva Desk Admin
              </p>
            </div>
          </div>
        </div>
        <nav className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-4 lg:flex lg:flex-1 lg:flex-col lg:overflow-y-auto lg:p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex min-h-11 items-center justify-center gap-2 rounded-md p-3 text-sm transition-colors sm:text-base lg:justify-start ${
                  isActive ? 'bg-[#ffebc8] text-primary-700 font-semibold border border-[#efcf98]' : 'text-[#6c5546] hover:bg-[#fff4de] hover:text-[#442d20]'
                }`}
              >
                <Icon className="shrink-0" size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-[#ecd8b7] p-3 lg:p-4">
          <button
            onClick={handleLogout}
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-md p-2 text-[#6c5546] transition-colors hover:bg-[#fff4de] hover:text-red-700 lg:justify-start"
          >
            <LogOut className="shrink-0" size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1 overflow-y-auto p-3 pt-0 sm:p-4 sm:pt-0 lg:p-6 xl:p-8">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
