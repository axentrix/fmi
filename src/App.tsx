import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Welcome from './components/Welcome';
import BuyCredits from './components/BuyCredits';
import MyAccount from './components/MyAccount';
import type { UserTier } from './types/dashboard';

function App() {
  const [userTier, setUserTier] = useState<UserTier>('Basic');

  const handleTierChange = () => {
    setUserTier(userTier === 'Basic' ? 'Pro' : userTier === 'Pro' ? 'Intelligence' : 'Basic');
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard userTier={userTier} onTierChange={handleTierChange} />} />
        <Route path="/welcome" element={<Welcome userTier={userTier} onTierChange={handleTierChange} />} />
        <Route path="/buy-credits" element={<BuyCredits userTier={userTier} onTierChange={handleTierChange} />} />
        <Route path="/my-account" element={<MyAccount userTier={userTier} onTierChange={handleTierChange} />} />
      </Routes>
    </Router>
  );
}

export default App;
