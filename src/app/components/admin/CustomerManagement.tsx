import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Mail, Phone, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../Card';
import { Button } from '../Button';
import { Input } from '../Input';
import { User } from '../../types';

interface CustomerManagementProps {
  customers: User[];
  onEditCustomer: (customer: User) => void;
  onDeleteCustomer: (id: string) => void;
}

export function CustomerManagement({ customers, onEditCustomer, onDeleteCustomer }: CustomerManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCustomer, setEditingCustomer] = useState<User | null>(null);

  const filteredCustomers = customers.filter(cust =>
    cust.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cust.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cust.phone?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: customers.length,
    admin: customers.filter(c => c.role === 'admin').length,
    customer: customers.filter(c => c.role === 'customer').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Customer Management</h1>
          <p className="text-muted-foreground">Manage guest customer accounts and credentials</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card glass>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Customers</p>
            <h3 className="text-2xl font-bold text-foreground">{stats.total}</h3>
          </CardContent>
        </Card>
        <Card glass>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Administrators</p>
            <h3 className="text-2xl font-bold text-primary">{stats.admin}</h3>
          </CardContent>
        </Card>
        <Card glass>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Registered Customers</p>
            <h3 className="text-2xl font-bold text-accent">{stats.customer}</h3>
          </CardContent>
        </Card>
      </div>

      <Card glass>
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search customers by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCustomers.map((customer) => (
              <Card key={customer.id} glass hoverable>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-lg font-bold text-primary">
                          {customer.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground">{customer.name}</h4>
                        <p className="text-xs text-muted-foreground">ID: {customer.id}</p>
                      </div>
                    </div>
                    {customer.role === 'admin' && (
                      <Shield className="w-4 h-4 text-gold" />
                    )}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground truncate">{customer.email}</span>
                    </div>
                    {customer.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{customer.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <span className={`px-2 py-1 rounded-md text-xs ${
                      customer.role === 'admin'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-accent/10 text-accent'
                    }`}>
                      {customer.role === 'admin' ? 'Administrator' : 'Customer'}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setEditingCustomer(customer)}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (confirm(`Remove customer ${customer.name} from the system?`)) {
                          onDeleteCustomer(customer.id);
                        }
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCustomers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No customers found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {editingCustomer && (
        <CustomerFormModal
          customer={editingCustomer}
          onSubmit={(customerData) => {
            onEditCustomer({ ...customerData, id: editingCustomer.id });
            setEditingCustomer(null);
          }}
          onClose={() => {
            setEditingCustomer(null);
          }}
        />
      )}
    </div>
  );
}

function CustomerFormModal({
  customer,
  onSubmit,
  onClose,
}: {
  customer?: User;
  onSubmit: (data: Omit<User, 'id'>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: customer?.name || '',
    email: customer?.email || '',
    role: customer?.role || 'customer' as const,
    department: customer?.department || 'Customer',
    phone: customer?.phone || '',
  });

  const [errors, setErrors] = useState<any>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: any = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';

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
            <CardTitle>{customer ? 'Edit Customer' : 'Add New Customer'}</CardTitle>
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
              placeholder="John Doe"
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
              placeholder="john.doe@email.com"
            />

            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 XXXXX XXXXX"
            />

            <div>
              <label className="block mb-2 text-sm text-foreground">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="customer">Customer</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="flex-1">
                Update Customer
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
