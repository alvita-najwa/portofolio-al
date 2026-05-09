import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../../lib/supabase.ts';
import { Certificate } from '../../types.ts';
import { Plus, Trash2, Image as ImageIcon, Loader2, X, Save, Award } from 'lucide-react';

export default function ManageCertificates() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [year, setYear] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    fetchCerts();
  }, []);

  async function fetchCerts() {
    const { data } = await supabase.from('certificates').select('*').order('created_at', { ascending: false });
    if (data) setCerts(data);
    setIsLoading(false);
  }

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setIssuer('');
    setYear('');
    setCategory('');
    setImageUrl('');
    setIsModalOpen(false);
  };

  const handleEdit = (cert: Certificate) => {
    setEditingId(cert.id);
    setTitle(cert.title);
    setIssuer(cert.issuer || '');
    setYear(cert.year || '');
    setCategory(cert.category || '');
    setImageUrl(cert.image_url || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const certData = {
      user_id: user.id,
      title,
      issuer,
      year,
      category,
      image_url: imageUrl,
    };

    let error;
    if (editingId) {
      ({ error } = await supabase.from('certificates').update(certData).eq('id', editingId));
    } else {
      ({ error } = await supabase.from('certificates').insert([certData]));
    }

    if (!error) {
      fetchCerts();
      resetForm();
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this certificate?')) {
      const { error } = await supabase.from('certificates').delete().eq('id', id);
      if (!error) fetchCerts();
    }
  };

  if (isLoading) return <div className="flex items-center justify-center p-20 animate-pulse text-xs font-black uppercase tracking-widest text-neutral-800">Booting Interface...</div>;

  return (
    <div className="space-y-16">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <p className="text-pink-500 text-[10px] uppercase tracking-[0.3em] font-black mb-2">Auth Verification</p>
          <h1 className="text-5xl font-serif font-bold text-white mb-4">Credentials<span className="text-pink-600 italic">.</span></h1>
          <p className="text-neutral-500 max-w-md">Highlight your professional certifications and academic milestones.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-3 px-8 py-4 bg-white text-black rounded-full font-black uppercase tracking-[0.2em] text-xs hover:bg-pink-600 hover:text-white transition-all shadow-2xl shadow-white/5"
        >
          <Plus className="w-5 h-5" />
          <span>Add Credential</span>
        </motion.button>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {certs.map((cert) => (
          <motion.div 
            key={cert.id} 
            layout
            className="group relative"
          >
            <div className="aspect-video rounded-[32px] overflow-hidden bg-brand-card border border-white/5 relative shadow-2xl">
               {cert.image_url ? (
                 <img src={cert.image_url} alt={cert.title} className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-110 transition-all duration-1000" referrerPolicy="no-referrer" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-neutral-800">
                    <Award className="w-12 h-12" />
                 </div>
               )}
               
               {/* Categories badge */}
               <div className="absolute top-4 left-4 flex gap-2">
                 <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[8px] font-black uppercase text-white tracking-widest">{cert.category || 'Uncategorized'}</span>
               </div>

               {/* Controls Overlay */}
               <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center p-8 text-center">
                  <h3 className="text-xl font-bold text-white mb-1">{cert.title}</h3>
                  <p className="text-neutral-400 text-[10px] uppercase tracking-widest mb-6">{cert.issuer} • {cert.year}</p>
                  
                  <div className="flex items-center space-x-3">
                    <button onClick={() => handleEdit(cert)} className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all">
                      <Plus className="w-4 h-4 rotate-45" />
                    </button>
                    <button onClick={() => handleDelete(cert.id)} className="w-10 h-10 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
               </div>
            </div>
            
            <div className="mt-6 px-4">
              <h3 className="font-bold text-white text-md group-hover:text-pink-500 transition-colors">{cert.title}</h3>
              <p className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest mt-1">{cert.issuer}</p>
            </div>
          </motion.div>
        ))}
        {certs.length === 0 && (
          <div className="col-span-full py-32 text-center glass rounded-[48px] border-dashed border-white/10 flex flex-col items-center">
             <Award className="w-12 h-12 text-neutral-800 mb-4" />
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-700">No Credentials Verified Yet</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-neutral-950/80 backdrop-blur-xl" 
            onClick={resetForm} 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative bg-brand-bg w-full max-w-xl rounded-[48px] overflow-hidden shadow-2xl border border-white/5"
          >
            <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <h2 className="text-2xl font-serif font-bold text-white italic">{editingId ? 'Edit Credential' : 'New Credential'}</h2>
              <button onClick={resetForm} className="text-neutral-500 hover:text-white transition-all"><X className="w-6 h-6" /></button>
            </div>
            
            <form onSubmit={handleSave} className="p-10 space-y-6">
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-600 px-2">Title</label>
                    <input 
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-5 py-3 bg-white/[0.03] border border-white/5 rounded-xl text-white outline-none focus:border-pink-600/50 transition-all font-bold text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-600 px-2">Issuer</label>
                    <input 
                      type="text"
                      value={issuer}
                      onChange={(e) => setIssuer(e.target.value)}
                      className="w-full px-5 py-3 bg-white/[0.03] border border-white/5 rounded-xl text-white outline-none focus:border-pink-600/50 transition-all font-bold text-sm"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-600 px-2">Year</label>
                    <input 
                      type="text"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full px-5 py-3 bg-white/[0.03] border border-white/5 rounded-xl text-white outline-none focus:border-pink-600/50 transition-all font-bold text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-600 px-2">Category (Group)</label>
                    <input 
                      type="text"
                      placeholder="e.g. Aguna Course"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-5 py-3 bg-white/[0.03] border border-white/5 rounded-xl text-white outline-none focus:border-pink-600/50 transition-all font-bold text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-600 px-2">Certificate Image URL</label>
                  <input 
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-5 py-3 bg-white/[0.03] border border-white/5 rounded-xl text-white outline-none focus:border-pink-600/50 transition-all font-mono text-[10px]"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSaving}
                className="w-full py-4 bg-white text-black rounded-full font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center space-x-3 hover:bg-pink-600 hover:text-white disabled:opacity-50 transition-all"
              >
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                <span>{editingId ? 'Update Record' : 'Add Recording'}</span>
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
