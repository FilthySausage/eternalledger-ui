"use client";

import React from "react";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "info" | "success" | "warning" | "error";
  size?: "sm" | "md" | "lg" | "xs";
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  variant = "primary",
  size = "md",
  loading,
  disabled,
  iconLeft,
  iconRight,
  ...rest
}) => {
  const classes = [
    "btn w-full font-medium",
    variant ? `btn-${variant}` : "",
    size ? `btn-${size}` : "",
    loading ? "loading" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} disabled={disabled || loading} {...rest}>
      {iconLeft && <span className="mr-2 flex items-center">{iconLeft}</span>}
      <span className="truncate">{children}</span>
      {iconRight && <span className="ml-2 flex items-center">{iconRight}</span>}
    </button>
  );
};

export default Button;
