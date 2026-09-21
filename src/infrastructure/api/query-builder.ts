export interface TableQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
  [key: string]: string | number | boolean | undefined | null;
}


export function buildQueryParams(params?: TableQueryParams): URLSearchParams {
  const urlParams = new URLSearchParams();
  if (!params) return urlParams;

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      urlParams.append(key, String(value));
    }
  });

  return urlParams;
}
