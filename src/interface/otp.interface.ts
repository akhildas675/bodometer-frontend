import type { OtpPurpose } from "../constants/otp";

export interface OtpVerifyPayload{
  email:string;
  otp:string;
  purpose:OtpPurpose
}
export interface OtpResendPayload{
  email:string;
  purpose:OtpPurpose
}


export interface OtpVerifyResponse{
  message:string;
  error?:string;
}