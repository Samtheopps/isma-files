import { verifyToken, JWTPayload } from './auth';

/**
 * Vérifie qu'un token JWT appartient à un utilisateur admin
 */
export const verifyAdmin = (token: string): JWTPayload => {
  const payload = verifyToken(token);
  
  if (!payload) {
    throw new Error('Invalid or expired token');
  }
  
  if (payload.role !== 'admin') {
    throw new Error('Access denied: Admin role required');
  }
  
  return payload;
};

/**
 * Extrait et vérifie le token depuis les headers de la requête
 */
export const getAdminFromRequest = (request: Request): JWTPayload => {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }
  
  const token = authHeader.substring(7);
  return verifyAdmin(token);
};
