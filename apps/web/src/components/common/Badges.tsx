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
