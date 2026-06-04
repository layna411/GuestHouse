import React, { useState } from 'react';
import { Building2, Mail, Lock, ArrowLeft } from 'lucide-react';
import { Card } from '../Card';
import { Input } from '../Input';
import { Button } from '../Button';
import { UserRole } from '../../types';

interface LoginScreenProps {
  onLogin: (email: string, password: string) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ email: '', password: '' });

    let hasError = false;
    const newErrors = { email: '', password: '' };

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card glass className="p-8">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 animate-pulse">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
              Sign In
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Guest House Management Portal
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Input
                type="email"
                label="Email Address"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
              />
            </div>

            <div>
              <Input
                type="password"
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" className="rounded text-primary focus:ring-primary" />
                <span className="text-muted-foreground">Remember me</span>
              </label>
              {/* <button type="button" className="text-primary hover:underline font-medium">
                Forgot password?
              </button> */}
            </div>

            <Button type="submit" variant="primary" className="w-full py-2.5 font-semibold">
              Sign In
            </Button>
          </form>

          {/* <div className="mt-6 pt-6 border-t border-border text-center text-sm text-muted-foreground">
            <p className="font-semibold text-foreground mb-2 text-xs uppercase tracking-wider">Demo Credentials</p>
            <div className="bg-muted/40 backdrop-blur-sm border border-border/50 rounded-lg p-3 space-y-1.5 text-left text-xs">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Admin:</span>
                <span className="font-mono text-primary font-medium select-all">admin@simats.edu</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Employee:</span>
                <span className="font-mono text-accent font-medium select-all">priya.menon@simats.edu</span>
              </div>
              <div className="flex justify-between items-center text-[10px] text-muted-foreground pt-1.5 border-t border-border/30">
                <span>Password:</span>
                <span className="font-mono font-medium">password123</span>
              </div>
            </div> */}
          {/* </div> */}
        </Card>
      </div>
    </div>
  );
}
