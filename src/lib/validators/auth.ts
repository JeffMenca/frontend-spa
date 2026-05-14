import { z } from "zod";

export const LoginRequestSchema = z.object({
  email: z.string().email("Correo electronico invalido"),
  password: z.string().min(1, "La contrasena es requerida"),
});

export const RegisterRequestSchema = z.object({
  email: z.string().email("Correo electronico invalido"),
  password: z.string().min(8, "La contrasena debe tener al menos 8 caracteres"),
  fullName: z.string().min(1, "El nombre completo es requerido"),
  organization: z.string().min(1, "La organizacion es requerida"),
  phone: z.string().min(1, "El telefono es requerido"),
  personalId: z
    .string()
    .min(1, "El DPI o identificacion es requerido")
    .regex(/^[a-zA-Z0-9]+$/, "La identificacion solo admite letras y numeros"),
  photoUrl: z.string().url("URL de foto invalida").optional(),
});

export const AuthResponseSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
});

export const SessionSchema = z.object({
  userId: z.string().uuid(),
  email: z.string().email(),
  fullName: z.string(),
  roles: z.array(
    z.enum(["SYSTEM_ADMIN", "CONGRESS_ADMIN", "PARTICIPANT", "GUEST_SPEAKER"]),
  ),
  exp: z.number(),
  iat: z.number(),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type AuthResponseData = z.infer<typeof AuthResponseSchema>;
export type SessionData = z.infer<typeof SessionSchema>;
