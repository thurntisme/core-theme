import QuickStats from '@/components/pages/dashboard/quick-stats';
import ToolsGrid from '@/components/pages/dashboard/tools-grid';
import { getGreeting } from '@/lib/utils';

export default function DashboardPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      {/* Welcome Section */}
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold text-gray-900">
          {getGreeting()}, Welcome back! 👋
        </h2>
        <p className="text-gray-600">
          Here's your freelancer toolkit. Choose a tool to get started with your
          work.
        </p>
      </div>

      <QuickStats />

      <ToolsGrid />
    </main>
  );
}
