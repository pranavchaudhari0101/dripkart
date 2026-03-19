import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import gsap from 'gsap';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.auth-anim', 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
      const errorData = err.response?.data;
      if (typeof errorData === 'string') {
        setError(errorData);
      } else if (errorData?.error) {
        setError(errorData.error);
      } else if (errorData?.message) {
        setError(errorData.message);
      } else {
        setError('Failed to login. Please check your credentials or connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-gray-50 pt-[140px] pb-20 px-6 flex items-center justify-center">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-10 auth-anim">
          <h1 className="font-display text-[32px] md:text-[40px] mb-2 border-b border-gray-200 pb-4 uppercase tracking-tighter text-gray-900">
            Sign In
          </h1>
          <p className="font-body text-gray-500 text-[14px] font-medium mt-4">
            Enter your details to access your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="auth-anim bg-red-50 text-red-600 border border-red-200 p-4 text-[13px] font-body text-center font-bold rounded-sm">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div className="auth-anim">
              <label className="block font-body text-[11px] uppercase tracking-[0.15em] text-gray-700 font-bold mb-2 ml-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full p-4 bg-white border border-gray-300 rounded-sm font-body text-[13px] text-gray-900 outline-none focus:border-[#c8ff00] focus:ring-1 focus:ring-[#c8ff00] transition-all placeholder:text-gray-400"
              />
            </div>
            
            <div className="auth-anim">
              <div className="flex justify-between items-end mb-2 ml-1">
                <label className="block font-body text-[11px] uppercase tracking-[0.2em] text-gray-700 font-bold">Password</label>
                <button type="button" className="text-[10px] uppercase tracking-widest text-gray-500 hover:text-[#c8ff00] font-bold transition-colors">Forgot?</button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-4 bg-white border border-gray-300 rounded-sm font-body text-[13px] text-gray-900 outline-none focus:border-[#c8ff00] focus:ring-1 focus:ring-[#c8ff00] transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="auth-anim pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-gray-900 text-white font-body font-medium text-[12px] uppercase tracking-[0.2em] rounded-sm transition-all hover:bg-[#c8ff00] hover:text-gray-900 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? 'Processing...' : 'Sign In Now'}
            </button>
          </div>
        </form>

        <div className="auth-anim mt-10 text-center border-t border-gray-200 pt-8">
          <p className="font-body text-[14px] text-gray-700 font-bold">
            New to the collective? <Link to="/register" className="underline decoration-[#c8ff00] underline-offset-4 hover:text-[#c8ff00] transition-colors">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
