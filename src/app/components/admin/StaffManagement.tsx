import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Mail, Phone, Shield, Power, PowerOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../Card';
import { Button } from '../Button';
import { Input } from '../Input';
import { User } from '../../types';
import { customerApi } from '../../services/api';
import { toast } from 'sonner';

interface StaffManagementProps {
  staffList: User[];
  onAddStaff: (staff: Omit<User, 'id'>) => void;
  onEditStaff: (staff: User) => void;
  onDeleteStaff: (id: string) => void;
  onToggleActive: (id: string) => void;
}

export function StaffManagement({
  staffList,
  onAddStaff,
  onEditStaff,
  onDeleteStaff,
  onToggleActive
}: StaffManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingStaff, setEditingStaff] = useState<User | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredStaff = staffList.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.phone?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: staffList.length,
    active: staffList.filter(s => s.is_active !== false).length,
    disabled: staffList.filter(s => s.is_active === false).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Staff Login Management</h1>
          <p className="text-muted-foreground">Manage and control login credentials and portal access for guest house staff</p>
        </div>
        <Button variant="primary" onClick={() => setShowAddModal(true)} className="flex items-center gap-1">
          <Plus className="w-4 h-4" />
          Add Staff Account
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card glass>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Staff Accounts</p>
            <h3 className="text-2xl font-bold text-foreground">{stats.total}</h3>
          </CardContent>
        </Card>
        <Card glass>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Active Logins</p>
            <h3 className="text-2xl font-bold text-success">{stats.active}</h3>
          </CardContent>
        </Card>
        <Card glass>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Disabled Logins</p>
            <h3 className="text-2xl font-bold text-destructive">{stats.disabled}</h3>
          </CardContent>
        </Card>
      </div>

      <Card glass>
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search staff by name, email, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStaff.map((staff) => {
              const isActive = staff.is_active !== false;
              return (
                <Card key={staff.id} glass hoverable className={`border-l-4 ${isActive ? 'border-l-success/80' : 'border-l-destructive/80'}`}>
                  <CardContent className="p-5 flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isActive ? 'bg-primary/10' : 'bg-muted'}`}>
                            <span className={`text-lg font-bold ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                              {staff.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-bold text-foreground">{staff.name}</h4>
                            <p className="text-xs text-muted-foreground font-mono">ID: {staff.id}</p>
                          </div>
                        </div>
                        {staff.role === 'admin' && (
                          <Shield className="w-4 h-4 text-accent" title="Administrator" />
                        )}
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground truncate">{staff.email}</span>
                        </div>
                        {staff.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{staff.phone}</span>
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground">
                          Department: <strong className="text-foreground">{staff.department || 'Guest Relations'}</strong>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-4 border-t border-border/40 pt-3">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                          isActive ? 'bg-success/10 text-success border border-success/20' : 'bg-destructive/10 text-destructive border border-destructive/20'
                        }`}>
                          {isActive ? 'Active' : 'Disabled'}
                        </span>
                        <span className="text-xs font-semibold text-muted-foreground capitalize">
                          {staff.role}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        {staff.role !== 'admin' && (
                          <Button
                            variant={isActive ? 'destructive' : 'success'}
                            size="sm"
                            className="flex-1 flex items-center justify-center gap-1 font-bold text-xs uppercase"
                            onClick={() => onToggleActive(staff.id)}
                          >
                            {isActive ? (
                              <>
                                <PowerOff className="w-3.5 h-3.5" />
                                Disable
                              </>
                            ) : (
                              <>
                                <Power className="w-3.5 h-3.5" />
                                Enable
                              </>
                            )}
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingStaff(staff)}
                          className={staff.role === 'admin' ? 'w-full' : ''}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        {staff.role !== 'admin' && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              if (confirm(`Delete staff member ${staff.name}? This will permanently remove their credentials.`)) {
                                onDeleteStaff(staff.id);
                              }
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredStaff.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No staff members found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Staff account modal */}
      {showAddModal && (
        <StaffFormModal
          onSubmit={(data) => {
            onAddStaff(data);
            setShowAddModal(false);
          }}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* Edit Staff account modal */}
      {editingStaff && (
        <StaffFormModal
          staff={editingStaff}
          onSubmit={(data) => {
            onEditStaff({ ...data, id: editingStaff.id });
            setEditingStaff(null);
          }}
          onClose={() => setEditingStaff(null)}
        />
      )}
    </div>
  );
}

function StaffFormModal({
  staff,
  onSubmit,
  onClose,
}: {
  staff?: User;
  onSubmit: (data: Omit<User, 'id'>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: staff?.name || '',
    email: staff?.email || '',
    role: staff?.role || 'staff' as const,
    department: staff?.department || 'Front Desk',
    phone: staff?.phone || '',
    password: '',
  });

  const [errors, setErrors] = useState<any>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: any = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    
    if (!staff && !formData.password) {
      newErrors.password = 'Password is required for new accounts';
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card glass className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{staff ? 'Edit Staff Account' : 'Add New Staff Account'}</CardTitle>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
              <Plus className="w-5 h-5 rotate-45" />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={errors.name}
              placeholder="Priya Menon"
              required
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
              placeholder="priya.menon@simats.edu"
              required
            />

            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 98765 11111"
            />

            <Input
              label="Department"
              name="department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              placeholder="Front Desk / Housekeeping"
            />

            <Input
              label={staff ? "Change Password (Leave blank to keep current)" : "Password"}
              name="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={errors.password}
              placeholder="••••••••"
              required={!staff}
            />

            <div>
              <label className="block mb-2 text-sm text-foreground">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="staff">Staff Member</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="flex-1">
                {staff ? 'Update Account' : 'Create Account'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
