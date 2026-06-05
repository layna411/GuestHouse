import { useState, useEffect } from 'react';
import { User } from '../types';
import { customerApi } from '../services/api';
import { toast } from 'sonner';

export function useCustomersViewModel(currentUserRole?: string) {
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCustomers = async () => {
    if (currentUserRole !== 'admin') return;
    setLoading(true);
    try {
      const data = await customerApi.getAll();
      setCustomers(data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to retrieve customer rosters.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [currentUserRole]);

  const handleAddCustomer = async (customerData: Omit<User, 'id'>) => {
    try {
      const newCust = await customerApi.create(customerData);
      setCustomers(prev => [...prev, newCust]);
      toast.success('Customer added successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to add customer.');
    }
  };

  const handleEditCustomer = async (customer: User) => {
    try {
      const updatedCust = await customerApi.update(customer);
      setCustomers(prev => prev.map(c => c.id === customer.id ? updatedCust : c));
      toast.success('Customer updated successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update customer details.');
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    try {
      await customerApi.delete(id);
      setCustomers(prev => prev.filter(c => c.id !== id));
      toast.success('Customer removed successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove customer.');
    }
  };

  return {
    customers,
    loading,
    refreshCustomers: fetchCustomers,
    handleAddCustomer,
    handleEditCustomer,
    handleDeleteCustomer
  };
}
