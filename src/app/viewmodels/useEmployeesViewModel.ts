import { useState, useEffect } from 'react';
import { User } from '../types';
import { employeeApi } from '../services/api';
import { toast } from 'sonner';

export function useEmployeesViewModel(currentUserRole?: 'admin' | 'employee') {
  const [employees, setEmployees] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEmployees = async () => {
    if (currentUserRole !== 'admin') return;
    setLoading(true);
    try {
      const data = await employeeApi.getAll();
      setEmployees(data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to retrieve employee rosters.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [currentUserRole]);

  const handleAddEmployee = async (employeeData: Omit<User, 'id'>) => {
    try {
      const newEmp = await employeeApi.create(employeeData);
      setEmployees(prev => [...prev, newEmp]);
      toast.success('Employee added successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to add employee.');
    }
  };

  const handleEditEmployee = async (employee: User) => {
    try {
      const updatedEmp = await employeeApi.update(employee);
      setEmployees(prev => prev.map(e => e.id === employee.id ? updatedEmp : e));
      toast.success('Employee updated successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update employee details.');
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    try {
      await employeeApi.delete(id);
      setEmployees(prev => prev.filter(e => e.id !== id));
      toast.success('Employee removed successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove employee.');
    }
  };

  return {
    employees,
    loading,
    refreshEmployees: fetchEmployees,
    handleAddEmployee,
    handleEditEmployee,
    handleDeleteEmployee
  };
}
