'use client';

import { useState } from 'react';
import { ConversationView } from './ConversationView';
import { UsersList } from './UsersList';
import { OnlineUsersButton } from './OnlineUsersButton';
import { ErrorBoundary } from '../shared/ErrorBoundary';

export function MessagesLayout() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  return (
    <ErrorBoundary>
      <div className="flex h-[calc(100vh-4rem)] bg-white">
        {/* Left sidebar - User list */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Messages</h2>
        </div>
        <UsersList onUserSelect={setSelectedUserId} selectedUserId={selectedUserId} />
      </div>

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
      <OnlineUsersButton />
    </div>
    </ErrorBoundary>
  );
}