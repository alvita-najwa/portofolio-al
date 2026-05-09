import { useState } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase.ts';
import { Navigate } from 'react-router-dom';
import { Mail, Lock, Terminal, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

export default function Login({ session }: { session: any }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (session) {
    return <Navigate to="/admin" />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log('Attempting login with:', email);
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error('Login Error:', signInError);
        setError(signInError.message);
      } else {
        console.log('Login successful:', data);
      }
    } catch (err: any) {
      console.error('Connection Failed:', err);
      setError('Failed to connect to Supabase. Ensure URL and Anon Key are correct.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-brand-bg overflow-hidden">
      {/* Visual Side */}
      <div className="hidden md:flex md:w-1/2 bg-neutral-900 border-r border-white/5 items-center justify-center p-20 relative overflow-hidden">
        <div className="absolute top-1/4 -right-20 w-80 h-80 bg-pink-600/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-purple-600/10 blur-[100px] rounded-full" />
        
        <div className="absolute top-12 left-12 flex items-center space-x-2 text-white">
          <div className="w-8 h-8 bg-pink-600 rounded flex items-center justify-center">
            <Terminal className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl italic tracking-tight uppercase">ALVITA<span className="text-pink-600">.</span>DEV</span>
        </div>
        
        <div className="max-w-md relative z-10">
          <h2 className="text-5xl font-serif font-bold italic text-white mb-8 leading-tight">Building the Digital Future.</h2>
          <p className="text-neutral-500 leading-relaxed text-lg">
            Professional content management system to manage your digital identity with high precision.
          </p>
        </div>
        
        <div className="absolute bottom-12 left-12 right-12 flex justify-between text-neutral-600 text-[10px] uppercase tracking-[0.3em] font-black">
          <span>Secure Encrypted Access</span>
          <span>© 2026 Admin System</span>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-8 bg-brand-bg relative">
        <div className="w-full max-w-sm">
          <div className="md:hidden flex flex-col items-center mb-12">
            <div className="w-12 h-12 bg-pink-600 rounded-xl flex items-center justify-center mb-4">
              <Terminal className="w-8 h-8 text-white" />
            </div>
            <span className="font-bold text-2xl italic tracking-tight text-white uppercase">ALVITA<span className="text-pink-600">.</span>DEV</span>
          </div>

          <div className="mb-12 text-center md:text-left">
            <h1 className="text-4xl font-serif font-bold mb-3 text-white">Welcome Back</h1>
            <p className="text-neutral-500 text-sm font-medium">Authentication is required to proceed.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Email Address</label>
              <div className="relative">
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/5 rounded-2xl text-white placeholder:text-neutral-700 outline-none focus:border-pink-600/50 focus:bg-white/[0.05] transition-all"
                  placeholder="admin@example.com"
                  required
                />
                <Mail className="w-5 h-5 text-neutral-600 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Password</label>
              <div className="relative">
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/5 rounded-2xl text-white placeholder:text-neutral-700 outline-none focus:border-pink-600/50 focus:bg-white/[0.05] transition-all"
                  placeholder="••••••••"
                  required
                />
                <Lock className="w-5 h-5 text-neutral-600 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {error && (
              <div className="p-4 glass border-red-500/20 text-red-400 text-xs rounded-2xl flex items-start space-x-3">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-bold mb-1">Access Denied</p>
                  <p className="opacity-80">{error}</p>
                </div>
              </div>
            )}

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center space-x-3 hover:bg-pink-600 hover:text-white disabled:opacity-50 transition-all shadow-2xl shadow-white/5"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Sign In To Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          <p className="mt-16 text-center text-[10px] uppercase tracking-[0.4em] text-neutral-700 font-black">
            System Interface v2.0
          </p>
        </div>
      </div>
    </div>
  );
}
