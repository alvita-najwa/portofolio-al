import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../../lib/supabase.ts';
import { Profile } from '../../types.ts';
import { Save, User, FileText, Camera, Loader2, CheckCircle } from 'lucide-react';

export default function ManageProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form State
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (data) {
          setProfile(data);
          setFullName(data.full_name || '');
          setBio(data.bio || '');
          setAvatarUrl(data.avatar_url || '');
        }
      }
      setIsLoading(false);
    }
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        full_name: fullName,
        bio,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      });

      if (!error) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    }
    setIsSaving(false);
  };

  if (isLoading) return <div className="animate-pulse space-y-8">...</div>;

  return (
    <div className="max-w-4xl">
      <header className="mb-16">
        <p className="text-pink-500 text-[10px] uppercase tracking-[0.3em] font-black mb-2">Identify Control</p>
        <h1 className="text-5xl font-serif font-bold text-white mb-4">Edit Profile<span className="text-pink-600 italic">.</span></h1>
        <p className="text-neutral-500 max-w-md">Perbarui informasi publik yang akan muncul di landing page portofolio Anda.</p>
      </header>

      <form onSubmit={handleSave} className="space-y-12">
        <div className="glass rounded-[40px] p-10 space-y-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-600/5 blur-[100px] rounded-full -mr-32 -mt-32" />
          
          <div className="flex flex-col md:flex-row items-start lg:items-center gap-12 relative z-10">
            <div className="relative group">
              <div className="w-32 h-32 rounded-[40px] bg-white/5 overflow-hidden border border-white/10 group-hover:border-pink-600 transition-all duration-500">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-700">
                    <User className="w-12 h-12" />
                  </div>
                )}
              </div>
              <button type="button" className="absolute -bottom-4 -right-4 w-12 h-12 bg-white text-black rounded-2xl shadow-2xl flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all shadow-white/5">
                 <Camera className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 space-y-4 w-full">
               <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Legal Name / Alias</label>
               <input 
                 type="text"
                 value={fullName}
                 onChange={(e) => setFullName(e.target.value)}
                 className="w-full px-6 py-4 bg-white/[0.03] border border-white/5 rounded-2xl text-white outline-none focus:border-pink-600/50 focus:bg-white/[0.05] transition-all font-bold placeholder:text-neutral-800"
                 placeholder="Stefan William"
               />
            </div>
          </div>

          <div className="space-y-8 relative z-10">
             <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 flex items-center">
                  <FileText className="w-3 h-3 mr-2 text-pink-600" /> Professional Manifesto / Bio
                </label>
                <textarea 
                  rows={5}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-6 py-4 bg-white/[0.03] border border-white/5 rounded-[32px] text-white outline-none focus:border-pink-600/50 focus:bg-white/[0.05] transition-all resize-none leading-relaxed placeholder:text-neutral-800"
                  placeholder="Describe your design philosophy..."
                />
             </div>

             <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Profile Image Source (URL)</label>
                <input 
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full px-6 py-4 bg-white/[0.03] border border-white/5 rounded-2xl text-white outline-none focus:border-pink-600/50 focus:bg-white/[0.05] transition-all font-mono text-sm placeholder:text-neutral-800"
                  placeholder="https://images.unsplash.com/..."
                />
                <div className="flex items-center space-x-2 px-4">
                  <div className="w-1 h-1 bg-pink-600 rounded-full" />
                  <p className="text-[10px] uppercase font-bold tracking-widest text-neutral-700">Recommended resolution: 800x1000px</p>
                </div>
             </div>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isSaving}
            className="px-10 py-5 bg-white text-black rounded-full font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center space-x-3 hover:bg-pink-600 hover:text-white disabled:opacity-50 transition-all shadow-2xl shadow-white/5"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Synchronizing...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save Profile</span>
              </>
            )}
          </motion.button>
          
          {showSuccess && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center text-pink-500 font-black text-[10px] uppercase tracking-[0.2em]"
            >
               <CheckCircle className="w-4 h-4 mr-2" />
               Update Successful
            </motion.div>
          )}
        </div>
      </form>
    </div>
  );
}
