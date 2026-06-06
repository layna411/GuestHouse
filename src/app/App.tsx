import React, { useState, useEffect } from 'react';
import { LoginScreen } from './components/auth/LoginScreen';
import { Sidebar } from './components/navigation/Sidebar';
import { MobileHeader } from './components/navigation/MobileHeader';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { RoomManagement } from './components/admin/RoomManagement';
import { BookingForm } from './components/booking/BookingForm';
import { AllBookings } from './components/bookings/AllBookings';
import { Settings } from './components/settings/Settings';
import { LandingPage } from './components/landing/LandingPage';
import { NotificationCenter } from './components/admin/NotificationCenter';
import { StaffManagement } from './components/admin/StaffManagement';
import { RoomInventory } from './components/admin/RoomInventory';
import { RoomStatusGrid } from './components/admin/RoomStatusGrid';
import { GalleryManagement } from './components/admin/GalleryManagement';
import { RevenueTab } from './components/admin/RevenueTab';
import { Room, Booking } from './types';
import { Toaster } from 'sonner';
import { LayoutDashboard, BedDouble, Calendar, Users, CalendarDays, Image, BarChart3, Layers } from 'lucide-react';
import { 
  useAuthViewModel, 
  useRoomsViewModel, 
  useBookingsViewModel, 
  useNotificationsViewModel,
  useCustomersViewModel
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
        blue: { primary: '#0f766e', accent: '#00ccc4', gold: '#00ccc4' },
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
  const notificationsVM = useNotificationsViewModel(authVM.currentUser?.role);
  const staffVM = useCustomersViewModel(authVM.currentUser?.role);


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
        onBookingSubmit={handleBookingSubmit}
      />
    );
  }

  // Render Login screen
  if (authVM.appState === 'login') {
    return (
      <LoginScreen
        onLogin={authVM.handleLogin}
        onBackToLanding={() => authVM.setAppState('landing-page')}
      />
    );
  }

  // Render main dashboard layout
  if (authVM.appState === 'dashboard' && authVM.currentUser) {
    const menuItems = authVM.currentUser.role === 'admin' 
      ? [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'rooms', label: 'Room Management', icon: BedDouble },
          { id: 'bookings', label: 'All Bookings', icon: Calendar },
          { id: 'staff', label: 'Staff Management', icon: Users },
          { id: 'inventory', label: 'Room Inventory', icon: CalendarDays },
          { id: 'room-status', label: 'Room Booking & Status', icon: Layers },
          { id: 'revenue', label: 'Revenue Tab', icon: BarChart3 },
        ]
      : [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'rooms', label: 'Room Management', icon: BedDouble },
          { id: 'bookings', label: 'All Bookings', icon: Calendar },
          { id: 'inventory', label: 'Room Inventory', icon: CalendarDays },
          { id: 'room-status', label: 'Room Booking & Status', icon: Layers },
          { id: 'gallery', label: 'Gallery Management', icon: Image },
          { id: 'revenue', label: 'Revenue Tab', icon: BarChart3 },
        ];

    const notifCenterComponent = (
      <NotificationCenter
        notifications={notificationsVM.notifications}
        unreadCount={notificationsVM.unreadCount}
        onMarkAsRead={notificationsVM.markAsRead}
        onMarkAllAsRead={notificationsVM.markAllAsRead}
        onNotificationClick={(bookingId) => {
          setActiveTab('bookings');
        }}
      />
    );


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
          <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-card/30 backdrop-blur-md border-b border-border relative z-50">
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
              {bookingsVM.bookings.filter(b => b.status === 'pending').length > 0 && 
                (authVM.currentUser.role === 'admin' || authVM.currentUser.role === 'staff') && (
                <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between text-xs text-amber-300 backdrop-blur-sm shadow-md">
                  <div className="flex items-center gap-3">
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                    </span>
                    <div>
                      <p className="font-bold text-foreground">Pending Booking Requests Approval Required</p>
                      <p className="text-muted-foreground mt-0.5">There are {bookingsVM.bookings.filter(b => b.status === 'pending').length} reservations waiting for approval and room allocation.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('bookings')}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg transition-all cursor-pointer shadow-md text-[10px] uppercase tracking-wider"
                  >
                    View Ledger
                  </button>
                </div>
              )}

              {activeTab === 'dashboard' && (
                <AdminDashboard 
                  rooms={roomsVM.rooms} 
                  bookings={bookingsVM.bookings} 
                  role={authVM.currentUser.role}
                />
              )}
 
              {activeTab === 'rooms' && (
                <RoomManagement
                  rooms={roomsVM.rooms}
                  onAddRoom={roomsVM.handleAddRoom}
                  onEditRoom={roomsVM.handleEditRoom}
                  onDeleteRoom={roomsVM.handleDeleteRoom}
                  role={authVM.currentUser.role}
                />
              )}
 
              {activeTab === 'bookings' && (
                <AllBookings
                  bookings={bookingsVM.bookings}
                  rooms={roomsVM.rooms}
                  onCancelBooking={bookingsVM.handleCancelBooking}
                  onCompleteBooking={bookingsVM.handleCompleteBooking}
                  onConfirmBooking={bookingsVM.handleConfirmBooking}
                />
              )}

              {activeTab === 'staff' && authVM.currentUser.role === 'admin' && (
                <StaffManagement
                  staffList={staffVM.customers}
                  onAddStaff={staffVM.handleAddCustomer}
                  onEditStaff={staffVM.handleEditCustomer}
                  onDeleteStaff={staffVM.handleDeleteCustomer}
                  onToggleActive={staffVM.handleToggleActive}
                />
              )}

              {activeTab === 'inventory' && (
                <RoomInventory
                  role={authVM.currentUser.role}
                />
              )}

              {activeTab === 'room-status' && (
                <RoomStatusGrid
                  rooms={roomsVM.rooms}
                  bookings={bookingsVM.bookings}
                  onRefreshRooms={roomsVM.refreshRooms}
                  onRefreshBookings={bookingsVM.refreshBookings}
                  role={authVM.currentUser.role}
                  currentUser={authVM.currentUser}
                />
              )}

              {activeTab === 'gallery' && authVM.currentUser.role === 'staff' && (
                <GalleryManagement />
              )}

              {activeTab === 'revenue' && (
                <RevenueTab 
                  bookings={bookingsVM.bookings}
                  rooms={roomsVM.rooms}
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
      </div>
    );
  }

  return null;
}