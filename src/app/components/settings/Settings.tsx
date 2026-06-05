import React, { useState, useEffect } from 'react';
import { User as UserIcon, Lock, Bell, Moon, Sun, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../Card';
import { Button } from '../Button';
import { Input } from '../Input';
import { User as UserType } from '../../types';
import { toast } from 'sonner';

interface SettingsProps {
  currentUser: UserType;
  onUpdateProfile: (data: Partial<UserType> & { password?: string }) => Promise<void>;
}

// Preset color themes for full functional personalization
export const themes = {
  blue: {
    name: 'Somerset Corporate (Navy & Mint)',
    primary: '#0a2239',
    accent: '#4bd395',
    gold: '#4bd395',
    class: 'blue-theme'
  },
  green: {
    name: 'Emerald Forest (Green & Mint)',
    primary: '#064e3b',
    accent: '#34d399',
    gold: '#fbbf24',
    class: 'green-theme'
  },
  rose: {
    name: 'Sunset Crimson (Rose & Amber)',
    primary: '#881337',
    accent: '#fb7185',
    gold: '#f59e0b',
    class: 'rose-theme'
  },
  purple: {
    name: 'Royal Amethyst (Purple & Lavender)',
    primary: '#4c1d95',
    accent: '#a78bfa',
    gold: '#fbbf24',
    class: 'purple-theme'
  }
};

export function Settings({ currentUser, onUpdateProfile }: SettingsProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'appearance'>('profile');
  
  // Track active dark mode state
  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains('dark'));

  // Track active color theme
  const [colorTheme, setColorTheme] = useState<'blue' | 'green' | 'rose' | 'purple'>(() => {
    const saved = localStorage.getItem('colorTheme');
    return (saved && saved in themes) ? (saved as any) : 'blue';
  });

  // Watch class changes or trigger manually
  const handleToggleDarkMode = (enabled: boolean) => {
    setIsDarkMode(enabled);
    if (enabled) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleSelectColorTheme = (themeKey: 'blue' | 'green' | 'rose' | 'purple') => {
    setColorTheme(themeKey);
    const selected = themes[themeKey];
    
    // Apply styling properties directly to root element
    document.documentElement.style.setProperty('--primary', selected.primary);
    document.documentElement.style.setProperty('--accent', selected.accent);
    document.documentElement.style.setProperty('--gold', selected.gold);
    
    localStorage.setItem('colorTheme', themeKey);
    toast.success(`Color Theme: ${selected.name} applied!`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-foreground mb-1">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your credentials, notifications, and visual styling preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar Card */}
        <Card glass className="lg:col-span-1 h-fit">
          <CardContent className="p-4">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === 'profile' 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                <UserIcon className="w-4 h-4" />
                <span className="font-semibold text-sm">Profile Settings</span>
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === 'security' 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span className="font-semibold text-sm">Security</span>
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === 'notifications' 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                <Bell className="w-4 h-4" />
                <span className="font-semibold text-sm">Notifications</span>
              </button>
              <button
                onClick={() => setActiveTab('appearance')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === 'appearance' 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                <span className="font-semibold text-sm">Appearance</span>
              </button>
            </nav>
          </CardContent>
        </Card>

        {/* Dynamic Display Area */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <ProfileSettings currentUser={currentUser} onUpdate={onUpdateProfile} />
          )}
          {activeTab === 'security' && (
            <SecuritySettings onUpdateProfile={onUpdateProfile} />
          )}
          {activeTab === 'notifications' && (
            <NotificationSettings />
          )}
          {activeTab === 'appearance' && (
            <AppearanceSettings 
              isDarkMode={isDarkMode} 
              setIsDarkMode={handleToggleDarkMode} 
              colorTheme={colorTheme}
              onSelectTheme={handleSelectColorTheme}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileSettings({ currentUser, onUpdate }: { currentUser: UserType; onUpdate: (data: Partial<UserType>) => Promise<void> }) {
  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone || '',
    department: currentUser.department || '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onUpdate(formData);
    } catch (err) {
      // toast is already fired inside authVM
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card glass>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Profile Information</CardTitle>
        <p className="text-xs text-muted-foreground">Update your personal account credentials</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border border-primary/25">
              <span className="text-3xl font-extrabold text-primary">
                {currentUser.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground">{currentUser.name}</h3>
              <p className="text-xs text-muted-foreground capitalize font-semibold">{currentUser.role} Account</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <Input
              label="Department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Saving Changes...' : 'Save Profile Changes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function SecuritySettings({ onUpdateProfile }: { onUpdateProfile: (data: Partial<UserType> & { password?: string }) => Promise<void> }) {
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwords.new || !passwords.confirm) {
      toast.error('Please fill in the new password fields');
      return;
    }
    if (passwords.new !== passwords.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    
    setSubmitting(true);
    try {
      // Send password update to database via mock API
      await onUpdateProfile({ password: passwords.new });
      toast.success('Your account security password has been updated successfully!');
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (err: any) {
      toast.error(err.message || 'Failed to update account password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card glass>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Security Settings</CardTitle>
        <p className="text-xs text-muted-foreground">Adjust passwords and protect access to your account</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            placeholder="••••••••"
            value={passwords.current}
            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
          />
          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
            value={passwords.new}
            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
          />
          <Input
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            value={passwords.confirm}
            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
          />

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? 'Updating...' : 'Update Password Credentials'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function NotificationSettings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    bookingAlerts: true,
    systemUpdates: false,
  });

  const handleSave = () => {
    toast.success('Notification preferences saved!');
  };

  return (
    <Card glass>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Notification Preferences</CardTitle>
        <p className="text-xs text-muted-foreground">Configure how and when you receive booking updates</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/40">
          <div>
            <h4 className="font-semibold text-foreground text-sm">Email Notifications</h4>
            <p className="text-xs text-muted-foreground">Receive daily email summaries for guest check-ins</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-muted peer-checked:bg-primary rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/40">
          <div>
            <h4 className="font-semibold text-foreground text-sm">Live Booking Alerts</h4>
            <p className="text-xs text-muted-foreground">Get desktop toaster notifications on new employee bookings</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.bookingAlerts}
              onChange={(e) => setSettings({ ...settings, bookingAlerts: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-muted peer-checked:bg-primary rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/40">
          <div>
            <h4 className="font-semibold text-foreground text-sm">System Updates</h4>
            <p className="text-xs text-muted-foreground">Receive maintenance warning emails for guest house scheduling</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.systemUpdates}
              onChange={(e) => setSettings({ ...settings, systemUpdates: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-muted peer-checked:bg-primary rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
        </div>

        <div className="flex justify-end pt-2">
          <Button onClick={handleSave} variant="primary">
            Save Preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface AppearanceSettingsProps {
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  colorTheme: 'blue' | 'green' | 'rose' | 'purple';
  onSelectTheme: (theme: 'blue' | 'green' | 'rose' | 'purple') => void;
}

function AppearanceSettings({ 
  isDarkMode, 
  setIsDarkMode, 
  colorTheme, 
  onSelectTheme 
}: AppearanceSettingsProps) {
  
  return (
    <Card glass>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Appearance Settings</CardTitle>
        <p className="text-xs text-muted-foreground">Modify theme modes and visual accents of the portal</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/40">
          <div>
            <h4 className="font-semibold text-foreground text-sm">Dark Mode</h4>
            <p className="text-xs text-muted-foreground">Switch between high-contrast dark theme or clean light theme</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isDarkMode}
              onChange={(e) => setIsDarkMode(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-muted peer-checked:bg-primary rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
        </div>

        {/* Theme Accent Color Selection */}
        <div className="p-4 bg-muted/30 rounded-xl border border-border/40">
          <h4 className="font-semibold text-foreground text-sm mb-1">Theme Palette Accent</h4>
          <p className="text-xs text-muted-foreground mb-4">Select an branding accent color for menus, highlights, and borders.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(Object.keys(themes) as Array<keyof typeof themes>).map((key) => {
              const th = themes[key];
              const isSelected = colorTheme === key;
              return (
                <button
                  key={key}
                  onClick={() => onSelectTheme(key)}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
                    isSelected 
                      ? 'border-primary bg-primary/5 shadow-sm' 
                      : 'border-border bg-card hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Visual Color Preview Dots */}
                    <div className="flex -space-x-1.5">
                      <span 
                        className="w-5 h-5 rounded-full border border-white" 
                        style={{ backgroundColor: th.primary }} 
                      />
                      <span 
                        className="w-5 h-5 rounded-full border border-white" 
                        style={{ backgroundColor: th.accent }} 
                      />
                    </div>
                    <div>
                      <span className="text-xs font-bold block text-foreground capitalize">{key} Theme</span>
                      <span className="text-[9px] text-muted-foreground block truncate max-w-[150px]">{th.name}</span>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                      <Check className="w-3.5 h-3.5 stroke-[3px]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
