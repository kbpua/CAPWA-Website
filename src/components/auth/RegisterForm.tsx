import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormData } from '../../utils/validation';
import { useAuth } from './AuthContext';
import { Button } from '../common/Button';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const RegisterForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await registerUser(data.email, data.password, data.name, data.phone);
      toast.success('Registration successful! Welcome!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 border-2 border-green-100">
      <div className="text-center mb-6">
        <img 
          src="/Logo.png" 
          alt="CAPWA Logo" 
          className="w-16 h-16 mx-auto mb-4 object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Join CAPWA</h2>
        <p className="text-sm text-gray-600">Create your account</p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
              errors.name ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-green-500'
            }`}
            placeholder="Juan Dela Cruz"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
              errors.email ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-green-500'
            }`}
            placeholder="juan@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone (Optional)
          </label>
          <input
            id="phone"
            type="tel"
            {...register('phone')}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
            placeholder="+63 917 123 4567"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            id="password"
            type="password"
            {...register('password')}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
              errors.password ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-green-500'
            }`}
            placeholder="Min. 8 characters with uppercase, number, and special char"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Must contain: uppercase letter, number, and special character
          </p>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Registering...' : 'Register'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

