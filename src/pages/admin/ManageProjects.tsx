import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../../lib/supabase.ts';
import { Project } from '../../types.ts';
import { Plus, Trash2, ExternalLink, Image as ImageIcon, Loader2, X, Save, Lock } from 'lucide-react';
import { BASE_PROJECTS } from '../../constants.ts';

export default function ManageProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (data) setProjects(data);
    setIsLoading(false);
  }

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setImageUrl('');
    setLink('');
    setIsModalOpen(false);
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setTitle(project.title);
    setDescription(project.description || '');
    setImageUrl(project.image_url || '');
    setLink(project.link || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const projectData = {
      user_id: user.id,
      title,
      description,
      image_url: imageUrl,
      link,
    };

    let error;
    if (editingId) {
      ({ error } = await supabase.from('projects').update(projectData).eq('id', editingId));
    } else {
      ({ error } = await supabase.from('projects').insert([projectData]));
    }

    if (!error) {
      fetchProjects();
      resetForm();
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Hapus proyek ini?')) {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (!error) fetchProjects();
    }
  };

  if (isLoading) return <div>...</div>;

  return (
    <div className="space-y-16">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <p className="text-pink-500 text-[10px] uppercase tracking-[0.3em] font-black mb-2">Portfolio Control</p>
          <h1 className="text-5xl font-serif font-bold text-white mb-4">Case Studies<span className="text-pink-600 italic">.</span></h1>
          <p className="text-neutral-500 max-w-md">Kurasi dan kelola karya terbaik Anda dalam grid profesional.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-3 px-8 py-4 bg-white text-black rounded-full font-black uppercase tracking-[0.2em] text-xs hover:bg-pink-600 hover:text-white transition-all shadow-2xl shadow-white/5"
        >
          <Plus className="w-5 h-5" />
          <span>Deploy New Project</span>
        </motion.button>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {projects.length > 0 ? projects.map((project) => (
          <motion.div 
            key={project.id} 
            layout
            className="group relative"
          >
            <div className="aspect-[4/5] rounded-[48px] overflow-hidden bg-brand-card border border-white/5 relative shadow-2xl">
               {project.image_url ? (
                 <img src={project.image_url} alt={project.title} className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-110 transition-all duration-1000" referrerPolicy="no-referrer" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-neutral-800">
                    <ImageIcon className="w-12 h-12" />
                 </div>
               )}
               
               {/* Controls Overlay */}
               <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center p-8 text-center">
                  <h3 className="text-2xl font-serif font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-neutral-400 text-[10px] uppercase tracking-widest mb-8 line-clamp-2">{project.description}</p>
                  
                  <div className="flex items-center space-x-3">
                    <button onClick={() => handleEdit(project)} className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all">
                      <Plus className="w-5 h-5 rotate-45" />
                    </button>
                    <button onClick={() => handleDelete(project.id)} className="w-12 h-12 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
               </div>
            </div>
            
            <div className="mt-8 px-4 flex justify-between items-start">
              <div>
                <h3 className="font-bold text-white text-lg group-hover:text-pink-500 transition-colors">{project.title}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="w-1 h-1 bg-pink-600 rounded-full" />
                  <p className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest">Active Showcase</p>
                </div>
              </div>
              {project.link && (
                <a href={project.link} target="_blank" className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center text-neutral-700 hover:text-white hover:border-white/20 transition-all">
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </motion.div>
        )) : BASE_PROJECTS.map((project, i) => (
          <motion.div 
            key={i} 
            layout
            className="group relative opacity-60 hover:opacity-100 transition-opacity"
          >
            <div className="aspect-[4/5] rounded-[48px] overflow-hidden bg-white/[0.03] border border-white/5 relative flex items-center justify-center">
               <div className="text-white/10 text-6xl font-serif italic">{project.title.charAt(0)}</div>
               <div className="absolute top-6 right-6">
                 <div className="px-3 py-1 bg-white/5 rounded-full border border-white/5 flex items-center space-x-2">
                    <Lock className="w-3 h-3 text-neutral-600" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-neutral-600">Static Base</span>
                 </div>
               </div>
            </div>
            
            <div className="mt-8 px-4">
              <h3 className="font-bold text-white/40 text-lg">{project.title}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className="w-1 h-1 bg-neutral-800 rounded-full" />
                <p className="text-[10px] text-neutral-700 font-bold uppercase tracking-widest italic">Default Baseline Item</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal - Professional Dark */}
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
            className="relative bg-brand-bg w-full max-w-2xl rounded-[60px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/5"
          >
            <div className="p-10 md:p-16 border-b border-white/5 flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-32 h-32 bg-pink-600/10 blur-3xl -ml-16 -mt-16" />
              <div className="relative z-10">
                <p className="text-pink-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Project Editor</p>
                <h2 className="text-4xl font-serif font-bold text-white italic">{editingId ? 'Refine Work' : 'Initialize Work'}</h2>
              </div>
              <button onClick={resetForm} className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-neutral-500 hover:text-white transition-all"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSave} className="p-10 md:p-16 space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 px-4 whitespace-nowrap">Project Identity</label>
                  <input 
                    type="text"
                    placeholder="E.g. Modern E-commerce Interface"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-6 py-4 bg-white/[0.03] border border-white/5 rounded-2xl text-white outline-none focus:border-pink-600/50 focus:bg-white/[0.05] transition-all font-bold placeholder:text-neutral-800"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 px-4 whitespace-nowrap">Context & Brief</label>
                  <textarea 
                    placeholder="Define the problem and your creative solution..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-6 py-4 bg-white/[0.03] border border-white/5 rounded-[32px] text-white outline-none focus:border-pink-600/50 focus:bg-white/[0.05] transition-all resize-none leading-relaxed placeholder:text-neutral-800"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 px-4 whitespace-nowrap">Asset URL</label>
                    <input 
                      type="text"
                      placeholder="Image Direct Link"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full px-6 py-4 bg-white/[0.03] border border-white/5 rounded-2xl text-white outline-none focus:border-pink-600/50 focus:bg-white/[0.05] transition-all font-mono text-xs placeholder:text-neutral-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 px-4 whitespace-nowrap">Deployment Link</label>
                    <input 
                      type="text"
                      placeholder="Live URL"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      className="w-full px-6 py-4 bg-white/[0.03] border border-white/5 rounded-2xl text-white outline-none focus:border-pink-600/50 focus:bg-white/[0.05] transition-all font-mono text-xs placeholder:text-neutral-800"
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSaving}
                className="w-full py-5 bg-white text-black rounded-full font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center space-x-3 hover:bg-pink-600 hover:text-white disabled:opacity-50 transition-all shadow-2xl shadow-white/5 mt-8"
              >
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                <span>{editingId ? 'Sync Updates' : 'Commit To Portfolio'}</span>
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
