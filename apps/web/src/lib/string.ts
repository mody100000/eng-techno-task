export function getStringInitial(name?: string) {
  return name?.[0]?.toUpperCase() ?? "U";
}
export function getNameInitials(name?: string) {
  if (!name?.trim()) return "UN";

  const parts = name.trim().split(" ");
  return parts
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}
