export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user_id: string;
  id: string;
  active: boolean;
  code: string;
  email: string;
  username: string;
  points: any[];
  type: string;
  service?: string;
  image?: string;
  certificacoes?: string;
  descricao?: string;
  endTime?: string;
  startTime?: string;
  lunchEndTime?: string;
  lunchStartTime?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface RegisterResponse {
  message: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  message: string;
  accessToken: string;
}

export interface RecoverPasswordRequest {
  email: string;
}

export interface RecoverPasswordResponse {
  message: string;
}

export interface SendVerificationCodeRequest {
  email: string;
}

export interface SendVerificationCodeResponse {
  message: string;
}

export interface ValidateCodeRequest {
  email: string;
  code: string;
}

export interface ValidateCodeResponse {
  message: string;
}

export interface ResetPasswordRequest {
  email: string;
  password: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface User {
  id: string;
  active: boolean;
  code: string;
  email: string;
  username: string;
  points: any[];
  type: string;
  service?: string;
  image?: string;
  certificacoes?: string;
  descricao?: string;
  endTime?: string;
  startTime?: string;
  lunchEndTime?: string;
  lunchStartTime?: string;
}
