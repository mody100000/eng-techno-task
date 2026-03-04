"use client";

import { useState } from "react";
import {
  Archive,
  Calendar,
  Inbox,
  Kanban,
  LayoutDashboard,
  LogOut,
  Map,
  Menu,
  Search,
  SquareCheckBig,
  Tag,
  X,
} from "lucide-react";
import { UserBadge, TeamBadge } from "./common/Badges";
import { NavSection, type NavItem } from "./common/Navsection";
import { getNameInitials, getStringInitial } from "@/lib/string";

const currentUser = {
  name: "Mody Ahmed",
  email: "admin@example.com",
};
const currentTeam = {
  name: "Eng Tasks",
  email: "Engineering Team",
};

const generalItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "My Tasks", icon: SquareCheckBig },
  { label: "Inbox", icon: Inbox },
  { label: "Calendar", icon: Calendar },
];

const projectItems: NavItem[] = [
  { label: "Spring Board", icon: Kanban },
  { label: "Backlog", icon: Archive },
  { label: "Roadmap", icon: Map },
  { label: "Releases", icon: Tag },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [activeLabel, setActiveLabel] = useState("Dashboard");

  const firstLetter = getNameInitials(currentUser.name);
  const teamLetter = getStringInitial(currentTeam.name);

  const handleSelect = (label: string) => {
    setActiveLabel(label);
    setOpen(false);
  };

  const sidebarContent = (
    <>
      <div className="px-4 py-5">
        {/* Team header */}
        <div className="mb-5 flex items-start justify-between gap-1.5 px-1">
          <div className="flex items-start gap-1.5">
            <TeamBadge letter={teamLetter} />
            <div className="flex flex-col items-start px-1">
              <p className="font-semibold">{currentTeam.name}</p>
              <p className="text-xs text-[#A1A1AA]">{currentTeam.email}</p>
            </div>
          </div>
          {/* Close — mobile only */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 md:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search */}
        <div className="mb-5">
          <label className="group flex items-center gap-2 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] px-3 py-2.5 focus-within:border-zinc-400">
            <Search className="h-4 w-4 text-zinc-400" />
            <input
              type="search"
              placeholder="Search..."
              className="w-full bg-transparent text-sm text-zinc-700 outline-none placeholder:text-zinc-400"
            />
          </label>
        </div>

        {/* Nav */}
        <div className="space-y-5">
          <NavSection
            title="General"
            items={generalItems}
            activeLabel={activeLabel}
            onSelect={handleSelect}
          />
          <NavSection
            title="Projects"
            items={projectItems}
            activeLabel={activeLabel}
            onSelect={handleSelect}
          />
        </div>
      </div>

      {/* User button */}
      <button
        type="button"
        className="mt-auto flex w-full items-center gap-3 border-t border-[#E4E4E7] bg-white px-4 py-3 text-left transition hover:bg-zinc-50"
      >
        <UserBadge letter={firstLetter} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-zinc-900">
            {currentUser.name}
          </p>
          <p className="truncate text-xs text-zinc-500">{currentUser.email}</p>
        </div>
        <LogOut className="h-4 w-4 text-zinc-500" />
      </button>
    </>
  );

  return (
    <>
      {/*  control responsive behavior wiht backdrop  */}
      <aside className="hidden h-full w-64 shrink-0 flex-col border-r border-[#E4E4E7] bg-white text-zinc-900 md:flex">
        {sidebarContent}
      </aside>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-40 flex items-center justify-center rounded-xl border border-[#E4E4E7] bg-white p-2 text-zinc-500 shadow-sm md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>
      {/* ── Mobile: backdrop ── */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[#E4E4E7] bg-white text-zinc-900 shadow-xl transition-transform duration-300 ease-in-out md:hidden
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
