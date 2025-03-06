import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { CustomerFormData } from '../../types/Customer';
import customerService from '../../services/customerService';
import { toast } from 'react-toastify';

const AddCustomer: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<CustomerFormData>();

  const onSubmit = async (data: CustomerFormData) => {
    try {
      setLoading(true);
      const newCustomer = await customerService.createCustomer(data);
      toast.success('Customer added successfully');
      navigate(`/customers/${newCustomer.id}`);
    } catch (error) {
      console.error('Error adding customer:', error);
      toast.error('Failed to add customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add New Customer</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              id="prenom"
              className={`form-input ${errors.prenom ? 'border-red-500' : ''}`}
              {...register('prenom', { required: 'First name is required' })}
            />
            {errors.prenom && (
              <p className="form-error">{errors.prenom.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              id="nom"
              className={`form-input ${errors.nom ? 'border-red-500' : ''}`}
              {...register('nom', { required: 'Last name is required' })}
            />
            {errors.nom && (
              <p className="form-error">{errors.nom.message}</p>
            )}
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            className={`form-input ${errors.email ? 'border-red-500' : ''}`}
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
          />
          {errors.email && (
            <p className="form-error">{errors.email.message}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            id="telephone"
            className={`form-input ${errors.telephone ? 'border-red-500' : ''}`}
            {...register('telephone', { 
              required: 'Phone number is required',
              pattern: {
                value: /^[0-9+\-\s()]*$/,
                message: 'Invalid phone number'
              }
            })}
          />
          {errors.telephone && (
            <p className="form-error">{errors.telephone.message}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="adresse" className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <textarea
            id="adresse"
            rows={3}
            className={`form-input ${errors.adresse ? 'border-red-500' : ''}`}
            {...register('adresse', { required: 'Address is required' })}
          ></textarea>
          {errors.adresse && (
            <p className="form-error">{errors.adresse.message}</p>
          )}
        </div>
        
        <div className="mb-6">
          <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
            User ID (Optional)
          </label>
          <input
            type="number"
            id="userId"
            className="form-input"
            {...register('userId', { 
              valueAsNumber: true,
              validate: value => !value || value > 0 || 'User ID must be a positive number'
            })}
          />
          {errors.userId && (
            <p className="form-error">{errors.userId.message}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Leave blank to create a customer without linking to a user account.
          </p>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/customers')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Adding...' : 'Add Customer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCustomer;
