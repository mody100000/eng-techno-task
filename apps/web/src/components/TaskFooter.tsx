import { StatusBadge } from "./common/Badges";

const taskStats = {
  total: 8,
  inProgress: 3,
  blocked: 1,
  backlog: 2,
  done: 2,
};

export default function TaskFooter() {
  return (
    <footer className="flex items-center justify-between border-t border-[#E4E4E7] bg-white px-4 py-3 sm:px-6">
      {/* total tasks */}
      <span className="text-sm font-normal text-[#71717A]">
        {taskStats.total} Tasks
      </span>

      {/* status breakdown */}
      <div className="flex items-center gap-2 sm:gap-4">
        <StatusBadge
          count={taskStats.inProgress}
          label="In Progress"
          dotClass="bg-blue-500"
          textClass="text-blue-600"
        />
        <StatusBadge
          count={taskStats.blocked}
          label="Blocked"
          dotClass="bg-red-500"
          textClass="text-red-600"
        />
        <StatusBadge
          count={taskStats.backlog}
          label="Backlog"
          dotClass="bg-zinc-400"
          textClass="text-zinc-500"
        />
        <StatusBadge
          count={taskStats.done}
          label="Done"
          dotClass="bg-green-500"
          textClass="text-green-600"
        />
      </div>
    </footer>
  );
}
