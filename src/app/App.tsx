import React, { useState, useEffect } from 'react';
import { SplashScreen } from './components/auth/SplashScreen';
import { RoleSelection } from './components/auth/RoleSelection';
import { LoginScreen } from './components/auth/LoginScreen';
import { Sidebar } from './components/navigation/Sidebar';
import { MobileHeader } from './components/navigation/MobileHeader';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { RoomManagement } from './components/admin/RoomManagement';
import { EmployeeManagement } from './components/admin/EmployeeManagement';
import { EmployeeDashboard } from './components/employee/EmployeeDashboard';
import { BookingForm } from './components/booking/BookingForm';
import { AllBookings } from './components/bookings/AllBookings';
import { MyBookings } from './components/bookings/MyBookings';
import { Settings } from './components/settings/Settings';
import { Room, Booking } from './types';
import { Toaster } from 'sonner';
import { LayoutDashboard, BedDouble, Calendar, Users } from 'lucide-react';
import { 
  useAuthViewModel, 
  useRoomsViewModel, 
  useBookingsViewModel, 
  useEmployeesViewModel 
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
        blue: { primary: '#1e3a8a', accent: '#22d3ee', gold: '#fbbf24' },
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
  const employeesVM = useEmployeesViewModel(authVM.currentUser?.role);

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

  // Render Login screen
  if (authVM.appState === 'login') {
    return (
      <LoginScreen
        onLogin={authVM.handleLogin}
      />
    );
  }

  // Render main dashboard layout
  if (authVM.appState === 'dashboard' && authVM.currentUser) {
    const adminMenuItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'rooms', label: 'Room Management', icon: BedDouble },
      { id: 'bookings', label: 'All Bookings', icon: Calendar },
      { id: 'employees', label: 'Employees', icon: Users },
    ];

    const employeeMenuItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'availability', label: 'Room Availability', icon: BedDouble },
      { id: 'bookings', label: 'My Bookings', icon: Calendar },
    ];

    const menuItems = authVM.currentUser.role === 'admin' ? adminMenuItems : employeeMenuItems;

    return (
      <div className="flex flex-col lg:flex-row h-screen bg-background overflow-hidden">
        <Toaster position="top-right" richColors />

        <MobileHeader
          role={authVM.currentUser.role}
          userName={authVM.currentUser.name}
          activeTab={activeTab}
          menuItems={menuItems}
          onTabChange={setActiveTab}
          onLogout={handleLogout}
        />

        <div className="hidden lg:block">
          <Sidebar
            role={authVM.currentUser.role}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onLogout={handleLogout}
          />
        </div>

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

            {authVM.currentUser.role === 'employee' && activeTab === 'dashboard' && (
              <EmployeeDashboard
                rooms={roomsVM.rooms}
                bookings={bookingsVM.bookings}
                onBookRoom={handleBookRoom}
                onTabChange={setActiveTab}
                view="dashboard"
              />
            )}

            {authVM.currentUser.role === 'employee' && activeTab === 'availability' && (
              <EmployeeDashboard
                rooms={roomsVM.rooms}
                bookings={bookingsVM.bookings}
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
              />
            )}

            {activeTab === 'bookings' && authVM.currentUser.role === 'employee' && (
              <MyBookings
                bookings={bookingsVM.bookings}
                rooms={roomsVM.rooms}
                currentUserId={authVM.currentUser.id}
              />
            )}

            {activeTab === 'employees' && authVM.currentUser.role === 'admin' && (
              <EmployeeManagement
                employees={employeesVM.employees}
                onAddEmployee={employeesVM.handleAddEmployee}
                onEditEmployee={employeesVM.handleEditEmployee}
                onDeleteEmployee={employeesVM.handleDeleteEmployee}
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