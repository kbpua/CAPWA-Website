import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*]/, 'Password must contain at least one special character'),
  phone: z.string().optional(),
});

export const incidentReportSchema = z.object({
  type: z.enum(['abandoned', 'injured', 'abuse', 'stray', 'other', 'emergency']),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  severity: z.enum(['critical', 'high', 'medium', 'low']),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    address: z.string().optional(),
    city: z.string().optional(),
    province: z.string().optional(),
    region: z.string().optional(),
  }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type IncidentReportFormData = z.infer<typeof incidentReportSchema>;

