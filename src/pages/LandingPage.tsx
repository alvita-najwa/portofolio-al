import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.ts';
import { Project, Post, Profile } from '../types.ts';
import Navbar from '../components/Navbar.tsx';
import { motion } from 'motion/react';
import { ArrowRight, Github, Linkedin, Mail, ExternalLink, Terminal, PenTool, Award, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BASE_PROJECTS } from '../constants.ts';
import { Certificate } from '../types.ts';

export default function LandingPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const { data: profileData } = await supabase.from('profiles').select('*').limit(1).single();
      const { data: projectsData } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      const { data: postsData } = await supabase.from('posts').select('*').order('created_at', { ascending: false }).limit(3);
      const { data: certsData } = await supabase.from('certificates').select('*').order('created_at', { ascending: false });

      if (profileData) setProfile(profileData);
      if (projectsData) setProjects(projectsData);
      if (postsData) setPosts(postsData);
      if (certsData) setCerts(certsData);
    }
    fetchData();
  }, []);

  const certificateGroups = [
    { title: 'Aguna Course', issuer: 'Training Certification', year: '2025' },
    { title: 'Fortinet', issuer: 'Network Security', year: '2025' },
    { title: 'Always Ngoding', issuer: 'Web Development', year: '2024' },
    { title: 'RedHat', issuer: 'Linux System', year: '2024' },
    { title: 'CCNA', issuer: 'Cisco Certified', year: '2025' },
    { title: 'Events', issuer: 'IT Community & Workshops', year: '2024-2025' }
  ];

  // Merge static categories with database categories
  const categories = Array.from(new Set([...certificateGroups.map(g => g.title), ...certs.map(c => c.category || '')])).filter(Boolean);

  const getFilteredCerts = (cat: string) => {
    return certs.filter(c => c.category === cat);
  };

  return (
    <div className="min-h-screen bg-brand-bg text-neutral-200">
      <Navbar />

      {/* Hero Section */}
      <section id="hero" className="relative pt-40 pb-20 px-4 overflow-hidden">
        <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] bg-pink-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 -left-20 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full" />
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass mb-8">
              <span className="w-2 h-2 bg-pink-500 rounded-full animate-ping" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">Full Stack Web Developer</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-serif font-bold leading-tight mb-8">
              {profile?.full_name || 'Alvita Najwa'}
            </h1>
            
            <div className="w-24 h-1 bg-pink-500 mb-8" />
            
            <p className="text-xl text-neutral-400 mb-10 max-w-md leading-relaxed">
              {profile?.bio || 'Building meaningful digital experiences through intuitive design and precision code.'}
            </p>

            <div className="flex flex-wrap gap-6">
              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#contact" 
                className="px-8 py-4 bg-white text-black rounded-full font-black uppercase tracking-[0.2em] text-xs hover:bg-pink-600 hover:text-white transition-all shadow-2xl flex items-center"
              >
                Contact Me Now
              </motion.a>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 glass border border-white/10 text-white rounded-full font-black uppercase tracking-[0.2em] text-xs hover:bg-white/10 transition-all flex items-center"
              >
                Download CV
              </motion.button>
            </div>
          </motion.div>

          {/* Photo */}
          <div className="relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative z-10 aspect-[4/5] rounded-[60px] overflow-hidden glass p-4"
            >
              <div className="w-full h-full rounded-[45px] overflow-hidden bg-neutral-900/50 flex items-center justify-center">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" referrerPolicy="no-referrer" />
                ) : (
                  <div className="text-neutral-700 text-8xl font-serif italic uppercase">{profile?.full_name?.charAt(0) || 'S'}</div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="aspect-square rounded-[60px] overflow-hidden glass p-4 rotate-3 hover:rotate-0 transition-transform duration-700">
                <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover grayscale brightness-90" />
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-pink-600 rounded-[40px] flex items-center justify-center -rotate-6">
                <span className="text-4xl font-serif font-bold text-white italic">A.N</span>
              </div>
            </div>
            <div>
              <p className="text-pink-600 text-[10px] font-black uppercase tracking-[0.4em] mb-6">Discovery</p>
              <h2 className="text-6xl font-serif font-bold text-white mb-10 italic">Hello, I'm Alvita Najwa<span className="text-pink-600">.</span></h2>
              <p className="text-neutral-400 text-lg leading-relaxed mb-8">
                I am a student at SMK Negeri 1 Nglegok majoring in Computer and Network Engineering (TKJ). I am active in the IT Community extracurricular, where I hone my technical skills and technological experience.
              </p>
              <p className="text-neutral-500 leading-relaxed mb-12">
                My main interests are Web Programming and System Administration, two fields I am passionate about developing further. I aspire to be a Full Stack Web Developer, capable of creating digital solutions that benefit many people.
              </p>
              <div className="flex items-center space-x-6">
                 <div>
                    <p className="text-3xl font-bold text-white">3+</p>
                    <p className="text-[10px] uppercase font-bold text-neutral-600 tracking-widest">Years Experience</p>
                 </div>
                 <div className="w-px h-10 bg-white/10" />
                 <div>
                    <p className="text-3xl font-bold text-white">50+</p>
                    <p className="text-[10px] uppercase font-bold text-neutral-600 tracking-widest">Projects Done</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-32 px-4 bg-black/20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24">
          <div>
            <p className="text-pink-600 text-[10px] font-black uppercase tracking-[0.4em] mb-6">Expertise</p>
            <h2 className="text-6xl font-serif font-bold mb-10 leading-[1.1]">My Professional <br/><span className="text-pink-500 italic">Skills</span></h2>
            <p className="text-neutral-500 text-lg leading-relaxed max-w-md mb-12">
              Transforming your ideas into visually stunning and highly functional digital realities with modern technologies.
            </p>
            <div className="w-16 h-1 bg-pink-500/20" />
          </div>
          
          <div className="space-y-6">
            {[
              { title: 'Frontend Web Development', level: '95%' },
              { title: 'Backend Web Development', level: '90%' },
              { title: 'Debian Linux Administration', level: '85%' },
              { title: 'MikroTik Network Config', level: '88%' },
              { title: 'Cisco Networking & Routing', level: '85%' },
              { title: 'Ubuntu & GitLab Setup', level: '82%' },
              { title: 'Web Server & Hosting', level: '90%' },
              { title: 'Network Security', level: '80%' },
              { title: 'Database Management', level: '85%' }
            ].map((skill, i) => (
              <motion.div 
                key={i}
                whileHover={{ x: 10 }}
                className="group p-8 glass rounded-[32px] border-none"
              >
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-bold text-white uppercase tracking-widest">{skill.title}</h4>
                  <span className="text-pink-600 font-black text-xs tracking-widest">{skill.level}</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: skill.level }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="h-full bg-pink-600"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section Grid */}
      <section id="projects" className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
            <div>
              <h2 className="text-6xl font-serif font-bold mb-4">My Portfolio</h2>
              <p className="text-neutral-500 uppercase tracking-[0.3em] text-[10px] font-black">Success Stories</p>
            </div>
            <a href="#projects" className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 hover:text-white flex items-center group transition-colors">
              Explore All My Works <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </a>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {projects.length > 0 ? projects.map((project) => (
              <motion.div 
                key={project.id}
                whileHover={{ y: -15 }}
                className="group relative"
              >
                <div className="aspect-[4/5] rounded-[48px] overflow-hidden bg-brand-card mb-8 border border-white/5 shadow-2xl relative">
                  {project.image_url ? (
                    <img src={project.image_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-800 text-6xl font-serif italic">P</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-10">
                    <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-pink-400 text-xs font-bold uppercase tracking-widest">Case Study →</p>
                  </div>
                </div>
                <div className="px-4">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-pink-500 transition-colors">{project.title}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full" />
                    <p className="text-neutral-500 text-[10px] uppercase tracking-[0.2em] font-bold">Concept / Development</p>
                  </div>
                </div>
              </motion.div>
            )) : BASE_PROJECTS.map((project, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -15 }}
                className="group relative"
              >
                <div className="aspect-[4/5] rounded-[48px] overflow-hidden bg-brand-card mb-8 border border-white/5 shadow-2xl relative">
                  <div className="w-full h-full flex items-center justify-center text-neutral-800 text-6xl font-serif italic">{project.title.charAt(0)}</div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-10">
                    <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-neutral-400 text-xs mb-4 line-clamp-2">{project.desc}</p>
                    <p className="text-pink-400 text-xs font-bold uppercase tracking-widest">Explore Modular Work →</p>
                  </div>
                </div>
                <div className="px-4">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-pink-500 transition-colors">{project.title}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-pink-500 rounded-full" />
                    <p className="text-neutral-500 text-[10px] uppercase tracking-[0.2em] font-bold">{project.year} • Tech Work</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certificates Section */}
      <section id="certificates" className="py-32 px-4 bg-black/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
             <p className="text-pink-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4">Verification</p>
             <h2 className="text-6xl font-serif font-bold text-white italic">Certificates<span className="text-pink-600">.</span></h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((cat, i) => {
              const staticGroup = certificateGroups.find(g => g.title === cat);
              const linkedCerts = getFilteredCerts(cat);
              const count = linkedCerts.length;

              return (
                <motion.div 
                  key={i}
                  whileHover={{ y: -5 }}
                  onClick={() => count > 0 && setSelectedCategory(cat)}
                  className={`p-10 glass rounded-[48px] border-white/5 hover:border-pink-600/30 transition-all text-left ${count > 0 ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-12 h-12 bg-pink-600/20 rounded-2xl flex items-center justify-center">
                      <Award className="text-pink-500 w-6 h-6" />
                    </div>
                    {count > 0 && (
                      <span className="px-3 py-1 bg-pink-600 text-[8px] font-black uppercase tracking-widest text-white rounded-full">
                        {count} Certificate{count > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">{cat}</h4>
                  <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest">
                    {staticGroup?.issuer || 'Certified Achievement'} • {staticGroup?.year || '2024-2025'}
                  </p>
                  {count > 0 && (
                    <p className="mt-6 text-pink-600 text-[10px] font-black uppercase tracking-widest flex items-center">
                      View Documents <ArrowRight className="ml-2 w-3 h-3" />
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Blog / Insights Section */}
      <section id="blog" className="py-32 px-4 bg-brand-bg relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
            <div>
              <p className="text-pink-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4">Thoughts</p>
              <h2 className="text-6xl font-serif font-bold text-white italic">Recent Blog<span className="text-pink-600">.</span></h2>
            </div>
            <a href="#" className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 hover:text-white flex items-center group transition-colors">
              Read All Stories <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {posts.length > 0 ? posts.map((post) => (
              <Link 
                key={post.id} 
                to={`/blog/${post.slug}`}
                className="group block"
              >
                <div className="aspect-[16/10] rounded-[40px] overflow-hidden glass mb-8 border border-white/5">
                  {post.image_url ? (
                    <img src={post.image_url} alt={post.title} className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-700" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-800"><PenTool className="w-10 h-10" /></div>
                  )}
                </div>
                <div className="px-4">
                  <p className="text-pink-600 text-[10px] font-black uppercase tracking-[0.3em] mb-3">{new Date(post.created_at).toLocaleDateString()}</p>
                  <h3 className="text-2xl font-serif font-bold text-white mb-4 group-hover:text-pink-500 transition-colors leading-snug">{post.title}</h3>
                  <div className="flex items-center space-x-2 text-neutral-500 group-hover:text-white transition-colors">
                    <span className="text-[10px] font-black uppercase tracking-widest">Read Article</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            )) : (
              <div className="col-span-full py-20 text-center glass rounded-[48px] border-dashed border-white/5 opacity-50">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-600">Writing the future... Check back soon.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section id="contact" className="py-40 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 text-center flex flex-col items-center">
            <h2 className="text-6xl md:text-9xl font-bold text-white mb-12 leading-none font-serif tracking-tighter">
              Let's craft <br/> something <br/> <span className="italic text-pink-500 text-gradient font-black">legendary</span> together.
            </h2>
            
            <div className="flex flex-wrap items-center justify-center gap-6">
              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="mailto:alvita@example.com" 
                className="group relative inline-flex items-center justify-center px-12 py-6 bg-pink-600 text-white rounded-full font-black uppercase tracking-[0.2em] text-sm shadow-2xl shadow-pink-600/20 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-[-20deg]" />
                <Mail className="mr-3 w-5 h-5" />
                Send Inquiry
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://wa.me/..." 
                className="px-12 py-6 bg-white/[0.03] border border-white/5 text-white rounded-full font-black uppercase tracking-[0.2em] text-sm hover:bg-white/10 transition-all flex items-center"
              >
                Direct WhatsApp
              </motion.a>
            </div>
            
            <div className="mt-40 w-full pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
               <div className="flex flex-col items-start gap-2">
                 <div className="flex items-center space-x-2">
                   <div className="w-4 h-4 bg-pink-600 rounded" />
                   <span className="text-white font-bold italic tracking-widest">PORTFOLIO<span className="text-pink-600">.</span></span>
                 </div>
                 <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-600">Built with love & precision © 2026</p>
               </div>
               
               <div className="flex items-center space-x-12">
                 <Link to="/login" className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-700 hover:text-pink-500 transition-colors">Admin Access</Link>
                 {['Dribbble', 'Behance', 'Instagram', 'Twitter'].map((social) => (
                   <a key={social} href="#" className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 hover:text-pink-500 transition-colors">{social}</a>
                 ))}
               </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-pink-600/50 to-transparent" />
      </section>

      {/* Certificate Modal Overlay */}
      {selectedCategory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-neutral-950/90 backdrop-blur-2xl" 
            onClick={() => setSelectedCategory(null)} 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative bg-brand-card w-full max-w-5xl max-h-[85vh] rounded-[48px] overflow-hidden shadow-2xl border border-white/5 flex flex-col"
          >
            <div className="p-8 md:p-12 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <div>
                <p className="text-pink-600 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Verified Documents</p>
                <h2 className="text-3xl font-serif font-bold text-white italic">{selectedCategory}</h2>
              </div>
              <button 
                onClick={() => setSelectedCategory(null)} 
                className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-neutral-500 hover:text-white transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 md:p-12">
              <div className="grid sm:grid-cols-2 gap-8">
                {getFilteredCerts(selectedCategory).map((cert) => (
                  <div key={cert.id} className="space-y-6 group">
                     <div className="aspect-[4/3] rounded-[32px] overflow-hidden glass border border-white/5 shadow-xl relative">
                        {cert.image_url ? (
                          <img src={cert.image_url} alt={cert.title} className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-800"><Award className="w-16 h-16" /></div>
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <a href={cert.image_url || '#'} target="_blank" className="px-6 py-3 bg-white text-black rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-pink-600 hover:text-white transition-all shadow-2xl">View Original</a>
                        </div>
                     </div>
                     <div className="px-4">
                        <h4 className="text-xl font-bold text-white mb-2">{cert.title}</h4>
                        <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">{cert.issuer} • {cert.year}</p>
                     </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
