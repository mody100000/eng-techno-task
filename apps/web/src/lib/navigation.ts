export type NavItem = {
  label: string;
  href: string;
};

export const generalNavItems: NavItem[] = [
  { label: "Dashboard", href: "/" },
  { label: "My Tasks", href: "/tasks" },
  { label: "Inbox", href: "/inbox" },
  { label: "Calendar", href: "/calendar" },
];

export const projectNavItems: NavItem[] = [
  { label: "Spring Board", href: "/spring-board" },
  { label: "Backlog", href: "/backlog" },
  { label: "Roadmap", href: "/roadmap" },
  { label: "Releases", href: "/releases" },
];

export function isActiveRoute(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}
