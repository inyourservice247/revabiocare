import { z } from 'zod';
export const enquirySchema=z.object({name:z.string().trim().min(2).max(120),email:z.string().trim().email().max(254).transform(v=>v.toLowerCase()),phone:z.string().trim().min(5).max(64),requirement:z.string().trim().min(10).max(4000),website:z.string().max(0).optional()});
