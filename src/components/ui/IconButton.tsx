import type { ReactNode, ButtonHTMLAttributes } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "dark" | "accent";
  size?: "sm" | "md";
  children: ReactNode;
}

const variantClasses = {
  default: "bg-transparent",
  dark: "bg-black text-white",
  accent: "bg-white",
};

const sizeClasses = {
  sm: "w-10 h-10",
  md: "w-12 h-12",
};

export function IconButton({
  variant = "default",
  size = "md",
  children,
  className = "",
  ...props
}: IconButtonProps) {
  return (
    <button
      className={`flex items-center justify-center rounded-icon shrink-0 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
