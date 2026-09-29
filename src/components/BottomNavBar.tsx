import React from 'react';
import { Home, Sunrise, BookOpen, Compass, BookLock, Trophy } from 'lucide-react';
import { useSacredStore } from '../store/useSacredStore';

export const BottomNavBar: React.FC = () => {
  const { activeTab, setActiveTab } = useSacredStore();

  const navItems = [
    { id: 'sanctuary', label: 'Sanctuary', icon: Home },
    { id: 'anchor', label: 'Anchor', icon: Sunrise },
    { id: 'stepJournal', label: '12 Steps', icon: BookOpen },
    { id: 'guide', label: 'S.T.E.P.', icon: Compass },
    { id: 'journal', label: 'Vault', icon: BookLock },
    { id: 'milestones', label: 'Journey', icon: Trophy },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#FFF9F5]/95 backdrop-blur-md border-t border-[#E8DED6] py-1.5 px-1 shadow-lg">
      <div className="max-w-xl mx-auto flex items-center justify-between">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const IconComponent = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-0.5 py-1 px-1 sm:px-2 rounded-xl transition-all duration-200 relative flex-1 ${
                isActive
                  ? 'text-[#2D2421]'
                  : 'text-[#796B64] hover:text-[#2D2421]'
              }`}
            >
              <div 
                className={`p-1.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-[#E6D5F0]/60 text-[#2D2421] scale-105'
                    : 'bg-transparent text-[#796B64]'
                }`}
              >
                <IconComponent className="w-4 h-4" />
              </div>
              <span 
                className={`text-[9px] sm:text-[10px] font-sans transition-all leading-tight text-center ${
                  isActive ? 'font-semibold text-[#2D2421]' : 'text-[#796B64]'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
