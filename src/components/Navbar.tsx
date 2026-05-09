import { Link } from 'react-router-dom';
import { Menu, X, Terminal } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-brand-bg/50 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <a href="#hero" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white italic">ALVITA<span className="text-pink-600">.</span>DEV</span>
          </a>

          {/* Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#hero" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Home</a>
            <a href="#about" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">About</a>
            <a href="#skills" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Skills</a>
            <a href="#projects" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Projects</a>
            <a href="#certificates" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Certificates</a>
            <a href="#contact" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Contact</a>
            <Link to="/login" className="px-6 py-2.5 bg-white text-black text-sm font-bold rounded-full hover:bg-pink-600 hover:text-white transition-all ml-4">
              Sign In
            </Link>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-white">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass border-b border-white/5 px-4 pt-2 pb-8 space-y-2">
          <a href="#hero" onClick={() => setIsOpen(false)} className="block px-4 py-4 text-sm font-bold uppercase tracking-widest text-neutral-400">Home</a>
          <a href="#about" onClick={() => setIsOpen(false)} className="block px-4 py-4 text-sm font-bold uppercase tracking-widest text-neutral-400">About</a>
          <a href="#skills" onClick={() => setIsOpen(false)} className="block px-4 py-4 text-sm font-bold uppercase tracking-widest text-neutral-400">Skills</a>
          <a href="#projects" onClick={() => setIsOpen(false)} className="block px-4 py-4 text-sm font-bold uppercase tracking-widest text-neutral-400">Projects</a>
          <a href="#certificates" onClick={() => setIsOpen(false)} className="block px-4 py-4 text-sm font-bold uppercase tracking-widest text-neutral-400">Certificates</a>
          <a href="#contact" onClick={() => setIsOpen(false)} className="block px-4 py-4 text-sm font-bold uppercase tracking-widest text-neutral-400">Contact</a>
          <Link to="/login" onClick={() => setIsOpen(false)} className="block px-4 py-4 text-sm font-bold uppercase tracking-widest text-white italic">Admin Login</Link>
        </div>
      )}
    </nav>
  );
}
