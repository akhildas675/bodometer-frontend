import axios from "axios";
import { ApiResponse } from "@/interface/api-response.interface";

export interface ParsedError {
  message: string;
  statusCode: number;
  errors?: Record<string, string>; 
}


export function parseApiError(error: unknown): ParsedError {
  const parsed: ParsedError = {
    message: "An unexpected error occurred.",
    statusCode: 500,
  };

  if (axios.isAxiosError(error)) {
    const apiResponse = error.response?.data as ApiResponse<unknown> | undefined;

    parsed.statusCode = error.response?.status || 500;
    
    if (apiResponse?.message) {
      parsed.message = apiResponse.message;
    } else if (parsed.statusCode >= 500) {
      parsed.message = "Something went wrong on the server. Please try again later.";
    } else {
      parsed.message = "An unexpected network error occurred.";
    }

    if (apiResponse?.errors && Array.isArray(apiResponse.errors)) {
      const fieldErrors: Record<string, string> = {};
      apiResponse.errors.forEach((err) => {
        const fieldName = err.field || err.path;
        if (fieldName) {
          fieldErrors[fieldName] = err.message;
        }
      });
      parsed.errors = fieldErrors;
    }
  } else if (error instanceof Error) {
    parsed.message = "An unexpected client error occurred.";
    console.error("Client error:", error.message);
  }

  return parsed;
}
