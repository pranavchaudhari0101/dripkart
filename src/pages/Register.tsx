import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import gsap from 'gsap';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
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
      const payload = {
        name,
        email,
        password,
        ...(phone ? { phone } : {})
      };
      const res = await api.post('/auth/register', payload);
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err: any) {
      console.error('Registration error:', err);
      const errorData = err.response?.data;
      if (typeof errorData === 'string') {
        setError(errorData);
      } else if (errorData?.error?.issues) {
        // Handle Zod validation errors
        setError(errorData.error.issues[0].message);
      } else if (errorData?.error) {
        setError(errorData.error);
      } else if (errorData?.message) {
        setError(errorData.message);
      } else {
        setError('Failed to create account. Please check your connection.');
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
            Create Account
          </h1>
          <p className="font-body text-gray-500 text-[14px] font-medium mt-4">
            Join the collective. Get exclusive access to drops.
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
              <label className="block font-body text-[11px] uppercase tracking-[0.2em] text-gray-700 font-bold mb-2 ml-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Alexander McQueen"
                className="w-full p-4 bg-white border border-gray-300 rounded-sm font-body text-[13px] text-gray-900 outline-none focus:border-[#c8ff00] focus:ring-1 focus:ring-[#c8ff00] transition-all placeholder:text-gray-400"
              />
            </div>

            <div className="auth-anim">
              <label className="block font-body text-[11px] uppercase tracking-[0.2em] text-gray-700 font-bold mb-2 ml-1">Email Address</label>
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
              <label className="block font-body text-[11px] uppercase tracking-[0.2em] text-gray-700 font-bold mb-2 ml-1">Phone Number (Optional)</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className="w-full p-4 bg-white border border-gray-300 rounded-sm font-body text-[13px] text-gray-900 outline-none focus:border-[#c8ff00] focus:ring-1 focus:ring-[#c8ff00] transition-all placeholder:text-gray-400"
              />
            </div>

            <div className="auth-anim">
              <label className="block font-body text-[11px] uppercase tracking-[0.2em] text-gray-700 font-bold mb-2 ml-1">Secure Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full p-4 bg-white border border-gray-300 rounded-sm font-body text-[13px] text-gray-900 outline-none focus:border-[#c8ff00] focus:ring-1 focus:ring-[#c8ff00] transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="auth-anim pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-gray-900 text-white font-body font-bold text-[13px] uppercase tracking-[0.2em] rounded-sm transition-all hover:bg-[#c8ff00] hover:text-gray-900 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? 'Processing...' : 'Create Account'}
            </button>
          </div>
        </form>

        <div className="auth-anim mt-10 text-center border-t border-gray-200 pt-8">
          <p className="font-body text-[13px] text-gray-500 font-medium">
            Already a member?{' '}
            <Link to="/login" className="text-gray-900 font-bold hover:underline underline-offset-4 decoration-[#c8ff00] decoration-2">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
