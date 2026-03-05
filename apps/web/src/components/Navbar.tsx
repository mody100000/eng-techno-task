import { Bell, Settings } from "lucide-react";
import { Search } from "lucide-react";
import Breadcrumb from "./common/Breadcrumb";
import { getNameInitials } from "@/lib/string";
import { Badge } from "./common/Badges";

const currentUser = {
  name: "Mody Ahmed",
};

export default function Navbar() {
  const firstLetter = getNameInitials(currentUser.name);

  return (
    <header className="flex items-center justify-between border-b border-[#E4E4E7] bg-white px-4 py-3 sm:px-6">
      <Breadcrumb />

      {/* Right — search + actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden items-center sm:w-50 gap-2 rounded-lg border border-[#E4E4E7] bg-[#FAFAFA] px-3 py-2 sm:flex">
          <Search className="h-3.5 w-3.5 text-zinc-400" />
          <span className="text-sm text-zinc-400">Search...</span>
          <kbd className="ml-auto rounded-md border border-[#E4E4E7] bg-white px-1.5 py-0.5 text-[10px] font-medium text-zinc-400 shadow-sm">
            Ctrl K
          </kbd>
        </div>

        {/* Notification */}
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-[#E4E4E7] bg-[#FAFAFA] text-zinc-500 transition hover:bg-zinc-50 hover:text-zinc-800"
        >
          <Bell className="h-4 w-4 text-[#71717A]" />
        </button>

        {/* Settings */}
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E4E4E7] bg-[#FAFAFA] text-zinc-500 transition hover:bg-zinc-50 hover:text-zinc-800"
        >
          <Settings className="h-4 w-4 text-[#71717A]" />
        </button>

        {/* Divider */}
        <div />

        {/* User */}
        <button type="button" className="transition hover:opacity-80">
          <Badge letter={firstLetter} variant="user" />
        </button>
      </div>
    </header>
  );
}
