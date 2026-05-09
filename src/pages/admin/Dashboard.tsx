import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase.ts';
import { Briefcase, PenTool, Eye, Calendar, Sparkles, Award } from 'lucide-react';
import { BASE_PROJECTS } from '../../constants.ts';

export default function Dashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    posts: 0,
    certificates: 0
  });

  useEffect(() => {
    async function fetchStats() {
      const { count: pCount } = await supabase.from('projects').select('*', { count: 'exact', head: true });
      const { count: bCount } = await supabase.from('posts').select('*', { count: 'exact', head: true });
      const { count: cCount } = await supabase.from('certificates').select('*', { count: 'exact', head: true });
      
      const projectCount = (pCount || 0) === 0 ? BASE_PROJECTS.length : (pCount || 0);
      
      setStats({
        projects: projectCount,
        posts: bCount || 0,
        certificates: cCount || 0
      });
    }
    fetchStats();
  }, []);

  return (
    <div className="space-y-16">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-pink-500 text-[10px] uppercase tracking-[0.3em] font-black mb-2">Overview Control</p>
          <h1 className="text-5xl font-serif font-bold text-white">Console Dashboard<span className="text-pink-600 italic">.</span></h1>
        </div>
        <div className="flex items-center space-x-4 glass px-6 py-3 rounded-2xl">
          <Calendar className="w-4 h-4 text-neutral-500" />
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}</span>
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-10">
        <div className="p-10 glass rounded-[40px] group cursor-pointer hover:bg-white/[0.05] transition-all relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-600/5 blur-3xl -mr-16 -mt-16 group-hover:bg-pink-600/10 transition-colors" />
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-neutral-500 mb-8 group-hover:text-pink-500 transition-colors">
            <Briefcase className="w-8 h-8" />
          </div>
          <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-2">Portfolio Volume</p>
          <p className="text-6xl font-serif font-bold text-white italic">{stats.projects}</p>
        </div>

        <div className="p-10 glass rounded-[40px] group cursor-pointer hover:bg-white/[0.05] transition-all relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-600/5 blur-3xl -mr-16 -mt-16 group-hover:bg-pink-600/10 transition-colors" />
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-neutral-500 mb-8 group-hover:text-pink-500 transition-colors">
            <Award className="w-8 h-8" />
          </div>
          <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-2">Certifications</p>
          <p className="text-6xl font-serif font-bold text-white italic">{stats.certificates}</p>
        </div>

        <div className="p-10 glass rounded-[40px] group cursor-pointer hover:bg-white/[0.05] transition-all relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 blur-3xl -mr-16 -mt-16 group-hover:bg-purple-600/10 transition-colors" />
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-neutral-500 mb-8 group-hover:text-purple-500 transition-colors">
            <PenTool className="w-8 h-8" />
          </div>
          <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-2">Intellectual Posts</p>
          <p className="text-6xl font-serif font-bold text-white italic">{stats.posts}</p>
        </div>

        <div className="p-10 bg-pink-600 rounded-[40px] relative overflow-hidden shadow-2xl shadow-pink-600/20 group">
          <Sparkles className="absolute -top-4 -right-4 w-40 h-40 text-white/10 rotate-12 group-hover:scale-110 transition-transform duration-1000" />
          <div className="relative z-10">
            <p className="text-[10px] font-black text-pink-200 uppercase tracking-[0.2em] mb-12">Intelligence Tip</p>
            <p className="text-2xl font-serif italic text-white leading-tight">
              "Excellence is not an act, but a habit. Keep your portfolio breathing with updates."
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
         <div className="glass rounded-[40px] p-10">
            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-10 flex items-center">
               <Eye className="mr-3 w-5 h-5 text-neutral-600" />
               Realtime Activity
            </h3>
            <div className="space-y-10">
               <div className="flex items-center space-x-6 relative">
                  <div className="absolute left-1.5 top-8 bottom-0 w-px bg-white/5" />
                  <div className="w-3 h-3 bg-pink-500 rounded-full shadow-[0_0_10px_rgba(236,72,153,0.5)] relative z-10" />
                  <div>
                    <p className="text-xs font-black text-white uppercase tracking-widest">Authentication Successful</p>
                    <p className="text-[10px] text-neutral-600 mt-1 uppercase font-bold">Secure Root Access Granted • ID-JKT-01</p>
                  </div>
                  <span className="ml-auto text-[10px] font-black text-neutral-700 uppercase tracking-widest">Just Now</span>
               </div>
               <div className="flex items-center space-x-6">
                  <div className="w-3 h-3 bg-neutral-800 rounded-full relative z-10" />
                  <div>
                    <p className="text-xs font-black text-neutral-500 uppercase tracking-widest">Database Sync</p>
                    <p className="text-[10px] text-neutral-700 mt-1 uppercase font-bold">Encrypted Handshake Complete</p>
                  </div>
                  <span className="ml-auto text-[10px] font-black text-neutral-700 uppercase tracking-widest">48m Ago</span>
               </div>
            </div>
         </div>
         
         <div className="bg-white/5 rounded-[40px] p-10 group relative overflow-hidden flex flex-col justify-between items-start border border-white/5">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white mb-6">
               <Sparkles className="w-8 h-8 opacity-20" />
            </div>
            <div>
              <h3 className="text-3xl font-serif font-bold text-white mb-4">Elevate your brand.</h3>
              <p className="text-sm text-neutral-500 leading-relaxed max-w-xs mb-8">
                Your portfolio is your story. Make sure it's told with the highest level of craftsmanship.
              </p>
              <button className="text-[10px] font-black text-pink-500 hover:text-white uppercase tracking-[0.3em] transition-colors">
                Add New Case Study →
              </button>
            </div>
         </div>
      </div>
    </div>
  );
}
