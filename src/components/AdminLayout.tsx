import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase.ts';
import { 
  LayoutDashboard, 
  User, 
  Briefcase, 
  PenTool, 
  LogOut, 
  ChevronRight,
  Terminal,
  Globe,
  Award
} from 'lucide-react';

const navItems = [
  { path: '/admin', label: 'Overview', icon: LayoutDashboard },
  { path: '/admin/profile', label: 'My Profile', icon: User },
  { path: '/admin/projects', label: 'Projects', icon: Briefcase },
  { path: '/admin/blog', label: 'Blog Posts', icon: PenTool },
  { path: '/admin/certificates', label: 'Certificates', icon: Award },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-brand-bg overflow-hidden text-neutral-300">
      {/* Sidebar */}
      <aside className="w-72 bg-brand-card border-r border-white/5 flex flex-col">
        <div className="p-10 border-b border-white/5 mb-8 flex items-center space-x-3">
          <div className="w-10 h-10 bg-pink-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-pink-600/20">
            <Terminal className="w-6 h-6" />
          </div>
          <span className="font-bold text-2xl tracking-tighter text-white italic">CMS<span className="text-pink-600">.</span></span>
        </div>

        <nav className="flex-1 px-6 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-5 py-4 rounded-2xl transition-all group ${
                  isActive 
                    ? 'bg-white text-black shadow-xl shadow-white/5' 
                    : 'text-neutral-500 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-pink-600' : 'group-hover:text-pink-500'}`} />
                  <span className="text-sm font-black uppercase tracking-widest">{item.label}</span>
                </div>
                {isActive && <div className="w-1.5 h-1.5 bg-pink-600 rounded-full" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/5 space-y-2">
          <Link 
            to="/" 
            className="flex items-center space-x-4 px-5 py-4 text-neutral-500 hover:text-white transition-colors"
          >
            <Globe className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-widest">Visit Site</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-4 px-5 py-4 text-red-400/60 hover:text-red-400 hover:bg-red-400/5 rounded-2xl transition-all font-black text-xs uppercase tracking-widest"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-24 bg-brand-bg/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-end px-12 sticky top-0 z-10">
           <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Administrator</p>
                <p className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest">System Online</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center">
                <User className="w-6 h-6 text-neutral-500" />
              </div>
           </div>
        </header>
        
        <div className="p-16 max-w-7xl mx-auto">
           <Outlet />
        </div>
      </main>
    </div>
  );
}
