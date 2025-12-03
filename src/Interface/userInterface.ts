
export interface RegisterPayload{
    name:string,
    email:string,
    phone:string,
    password:string,
    confirmPassword:string
}

export interface RegisterSuccessData {
  id: string;
  name: string;
  email: string;
}