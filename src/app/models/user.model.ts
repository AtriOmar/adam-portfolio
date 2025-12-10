export interface User {
  _id: string;
  username: string;
  email: string;
  picture: string;
  active: number;
  accessId: number;
}

export interface CreateUserRequest {
  email: string;
  password: string;
}

export interface VerifyUserRequest {
  token: string;
  otp: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateUserResponse {
  data: {
    type: string;
    attributes: {
      token: string;
    };
  };
}

export interface VerifyUserResponse {
  data: {
    type: string;
    id: string;
    attributes: User;
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
