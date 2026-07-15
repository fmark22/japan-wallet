
import { useStore } from './store/useStore';
import { BottomTabBar } from './components/BottomTabBar';
import { Home } from './pages/Home';
import { Coin } from './pages/Coin';
import { Ledger } from './pages/Ledger';
import { Settings } from './pages/Settings';

function App() {
  const activeTab = useStore(state => state.activeTab);

  return (
    <div className="w-full min-h-screen bg-background-regular relative">
      {activeTab === 'home' && <Home />}
      {activeTab === 'coin' && <Coin />}
      {activeTab === 'ledger' && <Ledger />}
      {activeTab === 'settings' && <Settings />}
      
      <BottomTabBar />
    </div>
  );
}

export default App;
