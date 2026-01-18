import React from "react";

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  render?: (row: T) => React.ReactNode;
}

export interface TableAction<T> {
  label: string;
  variant?: "primary" | "danger";
  onClick: (row: T) => void;
  visible?: (row: T) => boolean;
  disabled?: (row: T) => boolean;
}
