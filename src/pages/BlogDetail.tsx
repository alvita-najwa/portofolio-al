import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase.ts';
import { Post } from '../types.ts';
import Navbar from '../components/Navbar.tsx';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Clock, Calendar, Share2 } from 'lucide-react';

export default function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      const { data } = await supabase.from('posts').select('*').eq('slug', slug).single();
      if (data) setPost(data);
      setIsLoading(false);
    }
    fetchPost();
  }, [slug]);

  if (isLoading) return <div className="flex items-center justify-center min-h-screen font-serif italic text-neutral-400">Memuat artikel...</div>;
  if (!post) return <div className="flex flex-col items-center justify-center min-h-screen">
    <h1 className="text-4xl font-serif font-bold mb-4">Post Tidak Ditemukan</h1>
    <Link to="/" className="text-neutral-500 hover:text-neutral-900 flex items-center"><ArrowLeft className="mr-2 w-4 h-4" /> Kembali Beranda</Link>
  </div>;

  return (
    <div className="min-h-screen bg-brand-bg text-white">
      <Navbar />

      <article className="pt-40 pb-20 px-6 max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.3em] text-neutral-600 hover:text-white mb-16 transition-colors group">
          <ArrowLeft className="w-4 h-4 mr-3 group-hover:-translate-x-1 transition-transform" /> Back to Collective
        </Link>

        <header className="mb-16">
          <div className="flex items-center space-x-6 text-[10px] uppercase font-black tracking-[0.2em] text-pink-600 mb-8">
             <span className="flex items-center"><Calendar className="w-3 h-3 mr-2" /> {new Date(post.created_at).toLocaleDateString('id-ID', { dateStyle: 'long' })}</span>
             <span className="flex items-center"><Clock className="w-3 h-3 mr-2 text-purple-600" /> 8 Min Read</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-serif font-bold leading-[1.1] mb-12 italic text-white/95">
            {post.title}
          </h1>
          {post.image_url && (
            <div className="aspect-[21/9] w-full rounded-[40px] overflow-hidden mb-16 border border-white/5 shadow-[0_0_80px_rgba(0,0,0,0.4)]">
               <img src={post.image_url} alt={post.title} className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition-all duration-1000" referrerPolicy="no-referrer" />
            </div>
          )}
        </header>

        <div className="prose prose-invert prose-pink prose-2xl max-w-none prose-headings:font-serif prose-headings:italic prose-a:text-pink-500 prose-img:rounded-[40px] prose-p:text-neutral-400 prose-p:leading-relaxed">
           <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        <footer className="mt-32 pt-16 border-t border-white/5 relative">
           <div className="absolute top-0 right-0 w-64 h-64 bg-pink-600/5 blur-[100px] rounded-full -mr-32 -mt-32" />
           <div className="flex flex-col md:flex-row justify-between items-center gap-12 relative z-10">
              <div className="flex items-center space-x-6">
                 <div className="w-16 h-16 rounded-3xl glass border border-white/10 flex items-center justify-center text-xl font-serif font-bold text-pink-600">A</div>
                 <div>
                    <p className="text-sm font-black uppercase tracking-[0.2em] text-white">Stefan William</p>
                    <p className="text-[10px] uppercase font-bold tracking-[0.1em] text-neutral-600">Creative Strategist & Narrative Designer</p>
                 </div>
              </div>
              <button className="flex items-center space-x-3 px-10 py-5 bg-white text-black rounded-full text-xs font-black uppercase tracking-[0.2em] border border-transparent hover:bg-pink-600 hover:text-white transition-all shadow-2xl">
                 <Share2 className="w-4 h-4" />
                 <span>Distribute Narrative</span>
              </button>
           </div>
        </footer>
      </article>

      <section className="bg-black/40 py-40 px-6 mt-20 relative overflow-hidden">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-1 bg-gradient-to-r from-transparent via-pink-600/10 to-transparent rotate-12" />
         <div className="max-w-4xl mx-auto text-center relative z-10">
            <p className="text-pink-600 text-[10px] font-black uppercase tracking-[0.4em] mb-4 text-center">Intellectual Loop</p>
            <h3 className="text-4xl md:text-6xl font-serif font-bold italic mb-8 text-white">Join the ecosystem.</h3>
            <p className="text-neutral-500 mb-12 max-w-md mx-auto leading-relaxed">Receive occasional insights regarding design, technology, and human behavior directly in your secure channel.</p>
            <form className="flex flex-col md:flex-row max-w-xl mx-auto gap-4">
               <input type="email" placeholder="SECURE_EMAIL_ADDRESS" className="flex-1 px-8 py-5 rounded-full border border-white/5 bg-white/[0.03] text-white outline-none focus:border-pink-600/50 transition-all font-mono text-sm" />
               <button className="bg-white text-black px-12 py-5 rounded-full font-black uppercase tracking-[0.2em] text-xs hover:bg-pink-600 hover:text-white transition-all shadow-xl">Subscribe</button>
            </form>
         </div>
      </section>
    </div>
  );
}
