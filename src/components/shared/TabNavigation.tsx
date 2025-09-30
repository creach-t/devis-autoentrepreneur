
type TabId = 'entreprise' | 'conditions' | 'clauses' | 'data';

interface Tab {
  id: TabId;
  label: string;
  icon: string;
}

interface TabNavigationProps {
  activeTab: TabId;
  onTabChange: (tabId: TabId) => void;
}

const TABS: Tab[] = [
  { id: 'entreprise', label: 'Entreprise', icon: '🏢' },
  { id: 'conditions', label: 'Conditions', icon: '📋' },
  { id: 'clauses', label: 'Clauses Légales', icon: '⚖️' },
  { id: 'data', label: 'Données', icon: '💾' }
];

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="mb-6">
      <nav className="flex space-x-8 border-b border-gray-200">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

export type { TabId };
