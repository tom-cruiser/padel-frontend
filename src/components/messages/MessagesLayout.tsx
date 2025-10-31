'use client';

import { useState } from 'react';
import { ConversationView } from './ConversationView';
import { UsersList } from './UsersList';
import { ErrorBoundary } from '../shared/ErrorBoundary';
import { useAuth } from '@/contexts/AuthContext';
import { SelectUserDialog } from './SelectUserDialog';
import { User } from '@/types';

export function MessagesLayout() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const [isSelectUserDialogOpen, setIsSelectUserDialogOpen] = useState(false);
  const { user } = useAuth();

  return (
    <ErrorBoundary>
      <div className="flex h-[calc(100vh-4rem)] bg-white">
        {/* Left sidebar - User list */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Messages</h2>
            <button
              onClick={() => setIsSelectUserDialogOpen(true)}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              New Chat
            </button>
          </div>
          <UsersList onUserSelect={setSelectedUserId} selectedUserId={selectedUserId} />
        </div>

        {/* Select User Dialog */}
        <SelectUserDialog
          isOpen={isSelectUserDialogOpen}
          onClose={() => setIsSelectUserDialogOpen(false)}
          onSelectUser={(selectedUser: User) => {
            setSelectedUserId(selectedUser.id);
            setIsSelectUserDialogOpen(false);
          }}
          currentUserId={user?.id || ''}
        />

      {/* Right side - Conversation */}
      <div className="flex-1 flex flex-col">
        {selectedUserId ? (
          <ConversationView userId={selectedUserId} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-500">
                Choose a user from the list to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
    </ErrorBoundary>
  );
}