import React from 'react';
import Header from './Header';
import type { UserTier } from '../types/dashboard';

interface WelcomeProps {
  userTier: UserTier;
  onTierChange: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ userTier, onTierChange }) => {
  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="w-full h-screen flex flex-col bg-gray-50 shadow-2xl">
        {/* Header */}
        <Header userTier={userTier} onTierChange={onTierChange} />

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome</h1>
            <p className="text-gray-500">Welcome page content will be added here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
