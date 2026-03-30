import { z } from 'zod';

export const NameSchema = z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters');
export const DescriptionSchema = z.string().max(1000, 'Description must be at most 1000 characters').or(z.null());
export const ProviderSchema = z.string().min(1, 'Provider is required').max(100, 'Provider must be at most 100 characters');
export const ProviderIdSchema = z.number().int().positive('Provider ID must be a positive integer');
export const UuidSchema = z.uuid('UUID must be a valid UUID string');
export const UrlSchema = z.url('URL must be a valid URL');
export const McVersionSchema = z.string().min(1, 'Minecraft version is required').max(20, 'Minecraft version must be at most 20 characters');
