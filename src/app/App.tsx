import React, { useState, useEffect } from 'react';
import { SplashScreen } from './components/auth/SplashScreen';
import { RoleSelection } from './components/auth/RoleSelection';
import { LoginScreen } from './components/auth/LoginScreen';
import { Sidebar } from './components/navigation/Sidebar';
import { MobileHeader } from './components/navigation/MobileHeader';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { RoomManagement } from './components/admin/RoomManagement';
import { CustomerManagement } from './components/admin/CustomerManagement';
import { CustomerDashboard } from './components/customer/CustomerDashboard';
import { BookingForm } from './components/booking/BookingForm';
import { AllBookings } from './components/bookings/AllBookings';
import { MyBookings } from './components/bookings/MyBookings';
import { Settings } from './components/settings/Settings';
import { LandingPage } from './components/landing/LandingPage';
import { NotificationCenter } from './components/admin/NotificationCenter';
import { Room, Booking } from './types';
import { Toaster } from 'sonner';
import { LayoutDashboard, BedDouble, Calendar, Users } from 'lucide-react';
import { 
  useAuthViewModel, 
  useRoomsViewModel, 
  useBookingsViewModel, 
  useCustomersViewModel,
  useNotificationsViewModel
} from './viewmodels';

export default function App() {
  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const savedColorTheme = localStorage.getItem('colorTheme');
    if (savedColorTheme) {
      const colors: Record<string, { primary: string, accent: string, gold: string }> = {
        blue: { primary: '#0a2239', accent: '#4bd395', gold: '#4bd395' },
        green: { primary: '#064e3b', accent: '#34d399', gold: '#fbbf24' },
        rose: { primary: '#881337', accent: '#fb7185', gold: '#f59e0b' },
        purple: { primary: '#4c1d95', accent: '#a78bfa', gold: '#fbbf24' }
      };
      const selected = colors[savedColorTheme];
      if (selected) {
        document.documentElement.style.setProperty('--primary', selected.primary);
        document.documentElement.style.setProperty('--accent', selected.accent);
        document.documentElement.style.setProperty('--gold', selected.gold);
      }
    }
  }, []);

  // 1. Instantiate the MVVM hooks
  const authVM = useAuthViewModel();
  const roomsVM = useRoomsViewModel();
  const bookingsVM = useBookingsViewModel(
    authVM.currentUser?.id, 
    authVM.currentUser?.role, 
    roomsVM.refreshRooms // Automatically refresh room occupancy statuses when bookings change!
  );
  const customersVM = useCustomersViewModel(authVM.currentUser?.role);
  const notificationsVM = useNotificationsViewModel(authVM.currentUser?.role);

  // 2. View-specific local UI states
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // Handle booking form modal trigger
  const handleBookRoom = (roomId: string) => {
    const room = roomsVM.rooms.find(r => r.id === roomId);
    if (room) {
      setSelectedRoom(room);
      setShowBookingForm(true);
    }
  };

  const handleBookingSubmit = async (bookingData: any) => {
    await bookingsVM.handleBookingSubmit(bookingData);
    setShowBookingForm(false);
    setSelectedRoom(null);
    notificationsVM.refreshNotifications(); // Pull fresh notifications on booking submit
  };

  const handleLogout = () => {
    authVM.handleLogout();
    setActiveTab('dashboard'); // Reset active tab on logout
  };

  // Render Splash screen
  if (authVM.appState === 'splash') {
    return <SplashScreen onComplete={authVM.handleSplashComplete} />;
  }

  // Render Role Selection screen
  if (authVM.appState === 'role-selection') {
    return <RoleSelection onSelectRole={authVM.handleRoleSelect} />;
  }

  // Render Landing Page
  if (authVM.appState === 'landing-page') {
    return (
      <LandingPage
        rooms={roomsVM.rooms}
        currentUser={authVM.currentUser}
        onBookRoom={handleBookRoom}
        onOpenLogin={() => authVM.setAppState('login')}
        onLogout={handleLogout}
        onNavigateToDashboard={() => authVM.setAppState('dashboard')}
      />
    );
  }

  // Render Login screen
  if (authVM.appState === 'login') {
    return (
      <LoginScreen
        onLogin={authVM.handleLogin}
        onRegister={authVM.handleRegister}
        onBackToLanding={() => authVM.setAppState('landing-page')}
      />
    );
  }

  // Render main dashboard layout
  if (authVM.appState === 'dashboard' && authVM.currentUser) {
    const adminMenuItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'rooms', label: 'Room Management', icon: BedDouble },
      { id: 'bookings', label: 'All Bookings', icon: Calendar },
      { id: 'customers', label: 'Customers', icon: Users },
    ];

    const customerMenuItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'availability', label: 'Room Availability', icon: BedDouble },
      { id: 'bookings', label: 'My Bookings', icon: Calendar },
    ];

    const menuItems = authVM.currentUser.role === 'admin' ? adminMenuItems : customerMenuItems;

    const notifCenterComponent = authVM.currentUser.role === 'admin' ? (
      <NotificationCenter
        notifications={notificationsVM.notifications}
        unreadCount={notificationsVM.unreadCount}
        onMarkAsRead={notificationsVM.markAsRead}
        onMarkAllAsRead={notificationsVM.markAllAsRead}
        onNotificationClick={(bookingId) => {
          setActiveTab('bookings');
        }}
      />
    ) : undefined;

    return (
      <div 
        className="flex flex-col lg:flex-row h-screen overflow-hidden bg-background text-foreground font-sans transition-colors duration-300"
        style={{
          backgroundImage: 'linear-gradient(to bottom, var(--background-overlay-start), var(--background-overlay-end)), url("/images/image.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <Toaster position="top-right" richColors />

        <MobileHeader
          role={authVM.currentUser.role}
          userName={authVM.currentUser.name}
          activeTab={activeTab}
          menuItems={menuItems}
          onTabChange={setActiveTab}
          onLogout={handleLogout}
          notificationCenterEl={notifCenterComponent}
        />

        <div className="hidden lg:block">
          <Sidebar
            role={authVM.currentUser.role}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onLogout={handleLogout}
          />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Desktop Top Bar */}
          <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-card/30 backdrop-blur-md border-b border-border">
            <div>
              <h2 className="text-xl font-bold font-serif capitalize">
                {activeTab === 'dashboard' ? 'Overview' : activeTab.replace('-', ' ')}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              {notifCenterComponent}
              <div className="flex items-center gap-3 pl-4 border-l border-border">
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary">
                  {authVM.currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-semibold">{authVM.currentUser.name}</p>
                  <p className="text-[10px] text-muted-foreground capitalize">{authVM.currentUser.role}</p>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto">
            <div className="p-4 md:p-8">
              {authVM.currentUser.role === 'admin' && activeTab === 'dashboard' && (
                <AdminDashboard 
                  rooms={roomsVM.rooms} 
                  bookings={bookingsVM.bookings} 
                />
              )}

              {authVM.currentUser.role === 'admin' && activeTab === 'rooms' && (
                <RoomManagement
                  rooms={roomsVM.rooms}
                  onAddRoom={roomsVM.handleAddRoom}
                  onEditRoom={roomsVM.handleEditRoom}
                  onDeleteRoom={roomsVM.handleDeleteRoom}
                />
              )}

              {authVM.currentUser.role === 'customer' && activeTab === 'dashboard' && (
                <CustomerDashboard
                  rooms={roomsVM.rooms}
                  bookings={bookingsVM.bookings}
                  currentUserId={authVM.currentUser.id}
                  onBookRoom={handleBookRoom}
                  onTabChange={setActiveTab}
                  view="dashboard"
                />
              )}

              {authVM.currentUser.role === 'customer' && activeTab === 'availability' && (
                <CustomerDashboard
                  rooms={roomsVM.rooms}
                  bookings={bookingsVM.bookings}
                  currentUserId={authVM.currentUser.id}
                  onBookRoom={handleBookRoom}
                  onTabChange={setActiveTab}
                  view="availability"
                />
              )}

              {activeTab === 'bookings' && authVM.currentUser.role === 'admin' && (
                <AllBookings
                  bookings={bookingsVM.bookings}
                  rooms={roomsVM.rooms}
                  onCancelBooking={bookingsVM.handleCancelBooking}
                  onCompleteBooking={bookingsVM.handleCompleteBooking}
                  onConfirmBooking={bookingsVM.handleConfirmBooking}
                />
              )}

              {activeTab === 'bookings' && authVM.currentUser.role === 'customer' && (
                <MyBookings
                  bookings={bookingsVM.bookings}
                  rooms={roomsVM.rooms}
                  currentUserId={authVM.currentUser.id}
                />
              )}

              {activeTab === 'customers' && authVM.currentUser.role === 'admin' && (
                <CustomerManagement
                  customers={customersVM.customers}
                  onEditCustomer={customersVM.handleEditCustomer}
                  onDeleteCustomer={customersVM.handleDeleteCustomer}
                />
              )}



              {activeTab === 'settings' && (
                <Settings
                  currentUser={authVM.currentUser}
                  onUpdateProfile={authVM.handleUpdateProfile}
                />
              )}
            </div>
          </main>
        </div>

        {showBookingForm && selectedRoom && (
          <BookingForm
            room={selectedRoom}
            onSubmit={handleBookingSubmit}
            onClose={() => {
              setShowBookingForm(false);
              setSelectedRoom(null);
            }}
          />
        )}
      </div>
    );
  }

  return null;
}