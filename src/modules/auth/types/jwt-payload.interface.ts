export interface JwtPayload {
  sub: string; // user ID
  username: string;
  role: string;
  iat?: number; // issued at
  exp?: number; // expiration
}
