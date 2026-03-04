type StatusBadgeProps = {
  count: number;
  label: string;
  dotClass: string;
  textClass: string;
};

export function UserBadge({ letter }: { letter: string }) {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3B82F6] text-sm font-medium text-white">
      {letter}
    </div>
  );
}

export function TeamBadge({ letter }: { letter: string }) {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7C3AED] text-lg font-bold text-white">
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
