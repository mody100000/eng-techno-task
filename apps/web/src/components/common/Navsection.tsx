import type { ComponentType } from "react";

export type NavItem = {
  label: string;
  icon: ComponentType<{ className?: string }>;
  href?: string;
};

type NavSectionProps = {
  title: string;
  items: NavItem[];
  activeLabel: string;
  onSelect: (label: string, href?: string) => void;
};

export function NavSection({
  title,
  items,
  activeLabel,
  onSelect,
}: NavSectionProps) {
  return (
    <section className="space-y-2">
      <p className="px-2 text-[10px] font-bold uppercase text-[#A1A1AA]">
        {title}
      </p>
      <ul className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = item.label === activeLabel;

          return (
            <li key={item.label}>
              <button
                type="button"
                onClick={() => onSelect(item.label, item.href)}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-medium transition
                  ${
                    isActive
                      ? "bg-[#EDE9FE] text-[#7C3AED]"
                      : "text-[#3F3F46] hover:bg-[#ede9fe98] hover:text-zinc-900"
                  }`}
              >
                <Icon
                  className={`h-4 w-4 ${isActive ? "text-[#7C3AED]" : "text-[#71717A]"}`}
                />
                <span>{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
