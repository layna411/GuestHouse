import React from 'react';
import { Shield, Users } from 'lucide-react';
import { Card } from '../Card';
import { UserRole } from '../../types';
import { motion } from 'motion/react';

interface RoleSelectionProps {
  onSelectRole: (role: UserRole) => void;
}

export function RoleSelection({ onSelectRole }: RoleSelectionProps) {
  return (
    <div 
      className="min-h-screen relative flex items-center justify-center p-4 bg-background text-foreground font-sans transition-colors duration-300"
      style={{
        backgroundImage: 'linear-gradient(to bottom, var(--background-overlay-start), var(--background-overlay-end)), url("/images/image.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full"
      >
        <div className="text-center mb-12">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Welcome to Saveetha GuestHouse Booking</h1>
          <p className="text-muted-foreground">Select your role to continue</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectRole('admin')}
          >
            <Card glass hoverable className="cursor-pointer h-full border-border/50">
              <div className="p-8 text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="w-10 h-10 text-primary" />
                  </div>
                </div>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-3">Administrator</h2>
                <p className="text-muted-foreground mb-6">
                  Manage rooms, employees, bookings, and view analytics
                </p>
                <ul className="text-sm text-left space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Complete system control
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Employee management
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Analytics & reports
                  </li>
                </ul>
              </div>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectRole('employee')}
          >
            <Card glass hoverable className="cursor-pointer h-full border-border/50">
              <div className="p-8 text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
                    <Users className="w-10 h-10 text-accent" />
                  </div>
                </div>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-3">Employee</h2>
                <p className="text-muted-foreground mb-6">
                  Book rooms, manage guest details, and view availability
                </p>
                <ul className="text-sm text-left space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    Room booking & search
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    Guest management
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    Booking history
                  </li>
                </ul>
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
