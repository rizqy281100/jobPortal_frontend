export interface BodyRegister {
  name: string;
  username: string;
  password: string;
  email: string;
}

export interface ResponseRegister {
  message: string;
  status: string;
  statusCode: number;
}

export interface BodyLogin {
  username: string;
  password: string;
}

export interface DataLogin {
  email: string;
  refreshToken: string;
  role: string;
  token: string;
}

export interface ResponseLogin {
  message: string;
  status: string;
  statusCode: number;
  data: DataLogin;
}

export interface ResponseToken {
  message: string;
  status: string;
  statusCode: number;
  data: {
    token: string;
  };
}

export interface ResponseLogout {}
