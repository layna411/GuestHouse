import React, { useState } from 'react';
import { Mail, Lock, ArrowLeft, Key } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (email: string, password_hash: string) => void;
  onBackToLanding: () => void;
}

export function LoginScreen({ onLogin, onBackToLanding }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: Record<string, string> = {};
    let hasError = false;

    if (!email) {
      newErrors.email = 'Email is required';
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
      hasError = true;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      hasError = true;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    onLogin(email, password);
  };

  return (
    <div 
      className="min-h-screen relative flex items-center justify-center p-4 bg-background text-foreground font-sans transition-colors duration-300"
      style={{
        backgroundImage: 'linear-gradient(to bottom, var(--background-overlay-start), var(--background-overlay-end)), url("/images/image.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Back button */}
      <button 
        onClick={onBackToLanding}
        className="absolute top-6 left-6 z-10 glass-button px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 text-muted-foreground hover:text-foreground cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </button>

      {/* Auth Card */}
      <div className="max-w-md w-full relative z-10">
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-border/50 shadow-2xl">
          
          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-accent/15 border border-accent/25 flex items-center justify-center mb-4 shadow-lg shadow-accent/5">
              <Key className="w-6 h-6 text-accent" />
            </div>
            <h2 className="font-serif text-3xl font-bold tracking-wider text-foreground">
              Welcome Back
            </h2>
            <p className="text-xs text-accent uppercase tracking-widest mt-1 font-bold">
              Saveetha GuestHouse Booking
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  placeholder="john.doe@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input w-full pl-10 pr-4 py-2.5 text-sm"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input w-full pl-10 pr-4 py-2.5 text-sm"
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <button 
              type="submit" 
              className="glass-button-gold w-full py-3 rounded-xl font-bold uppercase tracking-wider text-sm shadow-lg mt-6 cursor-pointer"
            >
              Sign In
            </button>
          </form>



        </div>
      </div>
    </div>
  );
}
