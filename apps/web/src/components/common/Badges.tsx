type StatusBadgeProps = {
  count: number;
  label: string;
  dotClass: string;
  textClass: string;
};

type BadgeProps = {
  letter: string;
  variant?: "user" | "task" | "team";
  color?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function Badge({
  letter,
  variant = "user",
  color,
  size = "md",
  className = "",
}: BadgeProps) {
  // size map
  const sizeClasses = {
    sm: "h-6 w-6 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-lg font-bold",
  };

  const variantClasses = {
    user: "rounded-full bg-[#3B82F6] text-white font-medium",
    team: `rounded-xl text-white font-bold ${color || "bg-[#7C3AED]"}`,
    task: "rounded-lg text-white font-bold",
  };

  return (
    <div
      className={`flex items-center justify-center ${sizeClasses[size]} ${variantClasses[variant]} ${className || ""}`}
    >
      {letter}
    </div>
  );
}

export function StatusBadge({
  count,
  label,
  dotClass,
  textClass,
}: StatusBadgeProps) {
  return (
    <span
      className={`flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-normal sm:px-3 ${textClass}`}
    >
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotClass}`} />
      {/* label hidden on mobile */}
      <span className="hidden sm:inline">
        {count} {label}
      </span>
      <span className="sm:hidden">{count}</span>
    </span>
  );
}
