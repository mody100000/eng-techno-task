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
  Search,
  SquareCheckBig,
  Tag,
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
  const [activeLabel, setActiveLabel] = useState("Dashboard");

  const firstLetter = getNameInitials(currentUser.name);
  const teamLetter = getStringInitial(currentTeam.name);

  return (
    <aside className="flex h-screen w-full max-w-70 flex-col border-r border-[#E4E4E7] bg-white  text-zinc-900">
      <div className="px-4 py-5">
        <div className="flex items-start gap-1.5 px-1">
          <TeamBadge letter={teamLetter} />
          <div className="mb-5 flex flex-col items-start px-1">
            <p className="font-semibold">{currentTeam.name}</p>
            <p className="text-xs text-[#A1A1AA]">{currentTeam.email}</p>
          </div>
        </div>

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

        <div className="space-y-5">
          <NavSection
            title="General"
            items={generalItems}
            activeLabel={activeLabel}
            onSelect={setActiveLabel}
          />
          <NavSection
            title="Projects"
            items={projectItems}
            activeLabel={activeLabel}
            onSelect={setActiveLabel}
          />
        </div>
      </div>

      <button
        type="button"
        className="mt-auto flex w-full items-center gap-3 border-t border-[#E4E4E7] bg-white px-3 py-2.5 text-left transition hover:border-zinc-300 hover:bg-zinc-100"
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
    </aside>
  );
}
