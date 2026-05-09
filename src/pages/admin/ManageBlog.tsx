import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../../lib/supabase.ts';
import { Post } from '../../types.ts';
import { Plus, Trash2, Edit3, Loader2, X, Save, Type, Link as LinkIcon, FileText } from 'lucide-react';

export default function ManageBlog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (data) setPosts(data);
    setIsLoading(false);
  }

  const generateSlug = (val: string) => {
    return val.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingId) setSlug(generateSlug(val));
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setSlug('');
    setContent('');
    setImageUrl('');
    setIsModalOpen(false);
  };

  const handleEdit = (post: Post) => {
    setEditingId(post.id);
    setTitle(post.title);
    setSlug(post.slug);
    setContent(post.content);
    setImageUrl(post.image_url || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const postData = {
      user_id: user.id,
      title,
      slug,
      content,
      image_url: imageUrl,
      updated_at: new Date().toISOString(),
    };

    let error;
    if (editingId) {
      ({ error } = await supabase.from('posts').update(postData).eq('id', editingId));
    } else {
      ({ error } = await supabase.from('posts').insert([postData]));
    }

    if (!error) {
      fetchPosts();
      resetForm();
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Hapus postingan ini?')) {
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (!error) fetchPosts();
    }
  };

  if (isLoading) return <div>...</div>;

  return (
    <div className="space-y-16">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <p className="text-purple-500 text-[10px] uppercase tracking-[0.3em] font-black mb-2">Editor Control</p>
          <h1 className="text-5xl font-serif font-bold text-white mb-4">Intellectual Posts<span className="text-purple-600 italic">.</span></h1>
          <p className="text-neutral-500 max-w-md">Tulis dan terbitkan pemikiran serta tutorial Anda dalam format profesional.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-3 px-8 py-4 bg-white text-black rounded-full font-black uppercase tracking-[0.2em] text-xs hover:bg-purple-600 hover:text-white transition-all shadow-2xl shadow-white/5"
        >
          <Plus className="w-5 h-5" />
          <span>Write New Article</span>
        </motion.button>
      </header>

      <div className="glass rounded-[40px] overflow-hidden border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.02] text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 border-b border-white/5">
                <th className="px-10 py-6 text-pink-600 opacity-50">Article Identity</th>
                <th className="px-10 py-6">Unique Slug</th>
                <th className="px-10 py-6">Timestamp</th>
                <th className="px-10 py-6 text-right">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {posts.map((post) => (
                <tr key={post.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-10 py-8">
                     <p className="font-bold text-white group-hover:text-pink-500 transition-colors truncate max-w-xs">{post.title}</p>
                  </td>
                  <td className="px-10 py-8">
                     <code className="text-[10px] font-mono text-neutral-500 bg-white/5 px-3 py-1 rounded-full border border-white/5 tracking-wider">/{post.slug}</code>
                  </td>
                  <td className="px-10 py-8">
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600">{new Date(post.created_at).toLocaleDateString('id-ID', { dateStyle: 'short' })}</p>
                  </td>
                  <td className="px-10 py-8 text-right space-x-4">
                     <button onClick={() => handleEdit(post)} className="w-10 h-10 rounded-xl bg-white/5 text-neutral-500 hover:text-white transition-all border border-transparent hover:border-white/10 inline-flex items-center justify-center"><Edit3 className="w-4 h-4" /></button>
                     <button onClick={() => handleDelete(post.id)} className="w-10 h-10 rounded-xl bg-red-500/5 text-red-500/50 hover:text-red-500 transition-all border border-transparent hover:border-red-500/10 inline-flex items-center justify-center"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {posts.length === 0 && (
          <div className="py-32 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
              <FileText className="text-neutral-700" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500">Archive Manifest Empty</p>
          </div>
        )}
      </div>

      {/* Modal Editor - Cinema Mode */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-neutral-950/90 backdrop-blur-2xl" onClick={resetForm} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-brand-bg w-full max-w-6xl h-[85vh] rounded-[60px] overflow-hidden shadow-2xl flex flex-col border border-white/5"
          >
             <div className="p-10 md:p-16 border-b border-white/5 flex justify-between items-center relative overflow-hidden flex-shrink-0">
                <div className="absolute top-0 left-0 w-32 h-32 bg-purple-600/10 blur-3xl -ml-16 -mt-16" />
                <div className="relative z-10">
                  <p className="text-purple-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Syncing Editor</p>
                  <h2 className="text-4xl font-serif font-bold text-white italic">{editingId ? 'Refine Post' : 'New Thought'}</h2>
                </div>
                <button onClick={resetForm} className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-neutral-500 hover:text-white transition-all"><X className="w-5 h-5" /></button>
             </div>
             
             <form onSubmit={handleSave} className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-10 md:p-16 space-y-12 scrollbar-hide">
                   <div className="space-y-6">
                      <div className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 px-1">
                        <Type className="w-3 h-3 text-purple-600" /> <span>Article Core</span>
                      </div>
                      <input 
                        type="text"
                        placeholder="Define your narrative title..."
                        value={title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        className="w-full text-5xl font-serif font-bold bg-transparent border-none text-white placeholder:text-neutral-800 outline-none focus:ring-0 p-0 leading-tight"
                        required
                      />
                      <div className="flex items-center space-x-3 text-neutral-600 text-xs font-mono tracking-tighter">
                         <span className="opacity-40 uppercase tracking-widest font-sans font-bold">URI:</span>
                         <input 
                           type="text"
                           value={slug}
                           onChange={(e) => setSlug(generateSlug(e.target.value))}
                           className="bg-transparent border-none outline-none focus:ring-0 p-0 text-white/50 w-full"
                         />
                      </div>
                   </div>

                   <div className="grid md:grid-cols-2 gap-10">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 px-1">
                          <LinkIcon className="w-3 h-3 text-purple-600" /> <span>Cover Asset URL</span>
                        </div>
                        <input 
                          type="text"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full px-6 py-4 bg-white/[0.03] border border-white/5 rounded-2xl text-white outline-none focus:border-purple-600/50 focus:bg-white/[0.05] transition-all font-mono text-xs placeholder:text-neutral-800"
                        />
                      </div>
                   </div>

                   <div className="space-y-4 flex-1 flex flex-col min-h-[500px]">
                      <div className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 px-1">
                        <FileText className="w-3 h-3 text-purple-600" /> <span>Narrative Content (MD)</span>
                      </div>
                      <textarea 
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Begin your creative journey using Markdown syntax..."
                        className="w-full flex-1 px-8 py-8 bg-white/[0.02] rounded-[40px] border border-white/5 text-white outline-none focus:border-purple-600/50 focus:bg-white/[0.04] transition-all font-mono text-sm leading-relaxed scrollbar-hide resize-none placeholder:text-neutral-800"
                        required
                      />
                   </div>
                </div>

                <div className="p-10 md:p-16 border-t border-white/5 bg-brand-bg flex flex-col md:flex-row justify-between items-center gap-6 flex-shrink-0">
                   <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600 italic">State: Ready for deployment</p>
                   </div>
                   <motion.button 
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     type="submit"
                     disabled={isSaving}
                     className="px-12 py-5 bg-white text-black rounded-full font-black uppercase tracking-[0.2em] text-xs flex items-center space-x-4 hover:bg-purple-600 hover:text-white disabled:opacity-50 transition-all shadow-2xl shadow-white/5"
                   >
                     {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                     <span>Commit & Publish</span>
                   </motion.button>
                </div>
             </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
