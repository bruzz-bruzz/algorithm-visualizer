import { useState } from 'react';
import type { AlgorithmCategory } from './types';
import SortingPanel from './components/SortingPanel';
import SearchingPanel from './components/SearchingPanel';
import PathfindingPanel from './components/PathfindingPanel';
import GraphPanel from './components/GraphPanel';
import TreePanel from './components/TreePanel';
import DSPanel from './components/DSPanel';
import RecursionPanel from './components/RecursionPanel';
import DPPanel from './components/DPPanel';
import GreedyPanel from './components/GreedyPanel';
import BacktrackingPanel from './components/BacktrackingPanel';
import StringPanel from './components/StringPanel';
import Github from './components/Github';

type Tab = AlgorithmCategory;

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'sorting', label: 'Sorting', icon: '📊' },
  { key: 'searching', label: 'Searching', icon: '🔍' },
  { key: 'pathfinding', label: 'Pathfinding', icon: '🗺️' },
  { key: 'graphs', label: 'Graphs', icon: '🔗' },
  { key: 'trees', label: 'Trees', icon: '🌳' },
  { key: 'datastructures', label: 'Data Structures', icon: '📦' },
  { key: 'recursion', label: 'Recursion', icon: '🌀' },
  { key: 'dynamicprog', label: 'DP', icon: '🧮' },
  { key: 'greedy', label: 'Greedy', icon: '💰' },
  { key: 'backtracking', label: 'Backtracking', icon: '🔙' },
  { key: 'strings', label: 'Strings', icon: '🔤' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('sorting');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col">
      <header className="border-b border-slate-700 bg-slate-900/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-xl">
                ⚡
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary-300 to-primary-500 bg-clip-text text-transparent">
                  Algorithm Visualizer
                </h1>
                <p className="text-xs text-slate-400">
                  Interactive visualizations of classic algorithms
                </p>
              </div>
            </div>
          </div>

          <nav className="flex gap-1 bg-slate-800/50 p-1 rounded-lg border border-slate-700 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 sm:px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'text-slate-300 hover:bg-slate-700/50'
                }`}
              >
                <span className="mr-1">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {activeTab === 'sorting' && <SortingPanel />}
        {activeTab === 'searching' && <SearchingPanel />}
        {activeTab === 'pathfinding' && <PathfindingPanel />}
        {activeTab === 'graphs' && <GraphPanel />}
        {activeTab === 'trees' && <TreePanel />}
        {activeTab === 'datastructures' && <DSPanel />}
        {activeTab === 'recursion' && <RecursionPanel />}
        {activeTab === 'dynamicprog' && <DPPanel />}
        {activeTab === 'greedy' && <GreedyPanel />}
        {activeTab === 'backtracking' && <BacktrackingPanel />}
        {activeTab === 'strings' && <StringPanel />}
      </main>

      <footer className="border-t border-slate-700 bg-slate-900/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <Github repo="https://github.com/frkho/algo-visualizer" />
        </div>
      </footer>
    </div>
  );
}
