'use client';

import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/layout/dashboard-layout';

export default function ChatSupportPage() {
  const { data: session } = useSession();

  if (!session) {
    return <div>Access denied</div>;
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Chat Support Dashboard</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <p>Welcome to the chat support dashboard!</p>
          <p>User: {session.user?.name}</p>
        </div>
      </div>
    </DashboardLayout>
  );
}