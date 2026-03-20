import type { FC } from 'react';
import type { Task } from '@/types';

interface DashboardProps {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const Dashboard: FC<DashboardProps> = ({ tasks, loading, error }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg font-semibold">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded">
        <h2 className="text-red-800 font-semibold">Error</h2>
        <p className="text-red-700 text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Tasks Dashboard</h1>
      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No tasks found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
            >
              <h3 className="font-semibold">{task.title}</h3>
              <p className="text-gray-600 text-sm mt-1">{task.description}</p>
              <span className="inline-block mt-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                {task.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;