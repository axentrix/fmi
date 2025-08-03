import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  userTier: 'Basic' | 'Pro' | 'Intelligence';
  onTierChange: () => void;
  showPanelToggle?: boolean;
  isRightPanelOpen?: boolean;
  onTogglePanel?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  userTier, 
  onTierChange, 
  showPanelToggle = false, 
  isRightPanelOpen = true, 
  onTogglePanel 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  const getMenuItemClass = (path: string) => {
    const isCurrentPage = location.pathname === path;
    return `block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
      isCurrentPage ? 'bg-blue-50' : ''
    }`;
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex-shrink-0">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 header-container">
        {/* Left Column - Logo */}
        <div className="lg:w-[70%] header-left-column">
          <img 
            src={`${import.meta.env.BASE_URL}images/logo.svg`} 
            alt="Logo" 
            className="h-6 sm:h-6"
          />
        </div>
        
        {/* Right Column - User Controls */}
        <div className="lg:w-[30%] flex flex-col sm:flex-row items-start sm:items-center justify-end gap-4 header-right-column">
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Avatar with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-[42px] h-[42px] bg-blue-600 rounded-full flex items-center justify-center text-white font-medium hover:bg-blue-700 transition-colors"
                aria-label="User menu"
              >
                U
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    <Link
                      to="/welcome"
                      onClick={() => setIsDropdownOpen(false)}
                      className={getMenuItemClass('/welcome')}
                    >
                      Welcome
                    </Link>
                    <Link
                      to="/"
                      onClick={() => setIsDropdownOpen(false)}
                      className={getMenuItemClass('/')}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/buy-credits"
                      onClick={() => setIsDropdownOpen(false)}
                      className={getMenuItemClass('/buy-credits')}
                    >
                      Buy Credits
                    </Link>
                    <Link
                      to="/my-account"
                      onClick={() => setIsDropdownOpen(false)}
                      className={getMenuItemClass('/my-account')}
                    >
                      My Account
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            <div className="text-xs sm:text-sm text-gray-500">
              User Tier: <span className="font-medium">{userTier}</span>
            </div>
            <button
              onClick={onTierChange}
              className="bg-blue-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm border-none cursor-pointer hover:bg-blue-700 transition-colors"
            >
             Upgrade Plan
            </button>
            
            {showPanelToggle && onTogglePanel && (
              <button
                onClick={onTogglePanel}
                aria-expanded={isRightPanelOpen}
                aria-label={isRightPanelOpen ? "Close details" : "Open details"}
                className="p-2 rounded hover:bg-gray-100 transition-colors"
                type="button"
              >
                <span aria-hidden="true">
                  {!isRightPanelOpen ? (
                    // SVG for when panel is closed
                    <svg 
                      aria-hidden="true" 
                      className="text-blue-600" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 16 16" 
                      fill="currentColor" 
                      role="img" 
                      focusable="false" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        fillRule="evenodd" 
                        clipRule="evenodd" 
                        d="M4.25 2C2.45508 2 1 3.45508 1 5.25V10.7499C1 12.5449 2.45508 13.9999 4.25 13.9999H11.75C13.5449 13.9999 15 12.5449 15 10.7499V5.25C15 3.45508 13.5449 2 11.75 2H4.25ZM2.5 10.4999C2.5 11.6045 3.39543 12.4999 4.5 12.4999H11.75C12.7165 12.4999 13.5 11.7164 13.5 10.7499V5.25C13.5 4.28351 12.7165 3.5 11.75 3.5H4.5C3.39543 3.5 2.5 4.39543 2.5 5.5V10.4999Z"
                      />
                      <rect x="9" y="3" width="1.5" height="10"/>
                      <rect x="14" y="3" width="0" height="10" className="sc-VtvDJ ctWROt"/>
                    </svg>
                  ) : (
                    // SVG for when panel is open - original design
                    <svg
                      aria-hidden="true"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="text-blue-600"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M4.25 2C2.45508 2 1 3.45508 1 5.25V10.7499C1 12.5449 2.45508 13.9999 4.25 13.9999H11.75C13.5449 13.9999 15 12.5449 15 10.7499V5.25C15 3.45508 13.5449 2 11.75 2H4.25ZM2.5 10.4999C2.5 11.6045 3.39543 12.4999 4.5 12.4999H11.75C12.7165 12.4999 13.5 11.7164 13.5 10.7499V5.25C13.5 4.28351 12.7165 3.5 11.75 3.5H4.5C3.39543 3.5 2.5 4.39543 2.5 5.5V10.4999Z"
                      />
                      <rect x="9" y="3" width="1.5" height="10" />
                      <rect x="10" y="3" width="4" height="10" className="opacity-75" />
                    </svg>
                  )}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
