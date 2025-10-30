'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { FiMessageCircle } from 'react-icons/fi';
import ChatPopup from './ChatPopup';

export default function FloatingChatButton() {
  const { data: session } = useSession();
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  if (!session?.user) return null;

  return (
    <>
      <button
        className="fixed bottom-8 right-8 w-16 h-16 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 hover:scale-110 transition-all duration-300 z-50 flex items-center justify-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsOpen(true)}
        title="Open messages"
      >
        <FiMessageCircle 
          size={isHovered ? 28 : 24} 
          className="transition-all duration-300"
        />
      </button>
      {isOpen && <ChatPopup onClose={() => setIsOpen(false)} />}
    </>
  );
}