export interface User {
    id: string;
    email: string;
    name: string;
    image?: string;
    provider: 'google' | 'github';
}

export interface JWTPayload {
  id: string;
  email: string;
  name: string;
  image?: string;
  provider: 'google' | 'github';
  iat?: number;  // issued at timestamp
  exp?: number;  // expiration timestamp
}
  
export interface GitHubEmail {
    email: string;
    primary: boolean;
    verified: boolean;
    visibility: string | null;
}