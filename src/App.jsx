import React, { useState, useEffect } from 'react';
import { Clock, Coins, TrendingUp, Users, Wallet, AlertTriangle, Award } from 'lucide-react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import useApprove from "./hooks/useApprove"
import useStake from "./hooks/useStake"
import { parseUnits } from 'viem';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import useEmergencyWithdraw from "./hooks/useEmergencyWithdraw";
import useWithdraw from "./hooks/useWithdraw";
import useClaimRewards from "./hooks/useClaimRewards";
import useUserDetails from "./hooks/useUserDetails";
import useTokenBalance from "./hooks/useTokenBalance";
import useProtocolStats from "./hooks/useProtocolStats";
import LandingPage from './pages/LandingPage';
import { useAccount } from 'wagmi';
import { toast } from 'sonner';

const Dashboard = () => {
  const [stakeAmount, setStakeAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const { address } = useAccount();
  const { approve } = useApprove();
  const { stake } = useStake();
  const { emergencyWithdraw } = useEmergencyWithdraw();
  const { withdraw } = useWithdraw();  
  const { claimRewards } = useClaimRewards();
  
  // Get real-time user details from smart contract
  const { userDetails, error: userDetailsError, isLoading: userDetailsLoading } = useUserDetails(address);
  
  // Get real-time token balance
  const { balance, error: balanceError, isLoading: balanceLoading } = useTokenBalance(address);
  
  // Get protocol stats
  const { apr, totalStaked, rewardRate, errors: protocolErrors, loading: protocolLoading } = useProtocolStats();
  
  // Process user details data or use fallback values
  const userData = {
    userStake: userDetails?.stakedAmount ? userDetails.stakedAmount.toString() : '0',
    pendingRewards: userDetails?.pendingRewards ? userDetails.pendingRewards.toString() : '0',
    timeUntilUnlock: userDetails?.timeUntilUnlock ? userDetails.timeUntilUnlock.toString() : '0',
    canWithdraw: userDetails?.canWithdraw || false,
    currentApr: apr ? apr.toString() : '0',
    totalStaked: totalStaked ? totalStaked.toString() : '0',
    rewardRate: rewardRate ? rewardRate.toString() : '0',
    userBalance: balance ? balance.toString() : '0'
  };
  
  // Combined loading and error states
  const isLoading = userDetailsLoading || balanceLoading || protocolLoading.apr || protocolLoading.totalStaked;
  const error = userDetailsError || balanceError || protocolErrors.apr || protocolErrors.totalStaked;

  const handleStake = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
        toast.error('Please enter a valid amount to stake');
        return;
    }
    try {
        const amountInWei = parseUnits(stakeAmount, 18);
        toast.loading('Staking tokens...', { id: 'stake' });
        const tx = await stake(amountInWei);
        await tx.wait(); // Wait for transaction confirmation
        toast.success(`Successfully staked ${stakeAmount} tokens!`, { id: 'stake' });
        setStakeAmount('');
    } catch (error) {
        console.error('Stake process failed:', error);
        toast.error('Failed to stake tokens. Please try again.', { id: 'stake' });
    }
};


  const handleApprove = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
        toast.error('Please enter a valid amount to approve');
        return;
    }
    try {
        const amountInWei = parseUnits(stakeAmount, 18);
        toast.loading('Approving tokens...', { id: 'approve' });
        await approve(amountInWei);
        toast.success(`Successfully approved ${stakeAmount} tokens!`, { id: 'approve' });
        setStakeAmount('');
        
    } catch (error) {
        console.error('Approve process failed:', error);
        toast.error('Failed to approve tokens. Please try again.', { id: 'approve' });
    } finally {
    }
};

const handleWithdraw = async () => {
  if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error('Please enter a valid amount to withdraw');
      return;
  }
  try {
      const amountInWei = parseUnits(withdrawAmount, 18);
      toast.loading('Withdrawing tokens...', { id: 'withdraw' });
      const tx = await withdraw(amountInWei);
      await tx.wait(); // Wait for transaction confirmation
      toast.success(`Successfully withdrawn ${withdrawAmount} tokens!`, { id: 'withdraw' });
      setWithdrawAmount('');
  } catch (error) {
      console.error('Withdraw process failed:', error);
      toast.error('Failed to withdraw tokens. Please try again.', { id: 'withdraw' });
  }
};

const handleClaimRewards = async () => {
  try {
      await claimRewards();
  } catch (error) {
      console.error('Claim rewards process failed:', error);
  }
};

  const handleEmergencyWithdraw = async () => {
    try {
        toast.loading('Processing emergency withdrawal...', { id: 'emergency' });
        const tx = await emergencyWithdraw();
        await tx.wait(); // Wait for transaction confirmation
        toast.success('Emergency withdrawal successful!', { id: 'emergency' });
    } catch (error) {
        console.error('Emergency withdrawal failed:', error);
        toast.error('Emergency withdrawal failed. Please try again.', { id: 'emergency' });
    }
};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-medium text-gray-900">DSOSTAKE</h1>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <ConnectButton />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-6">
        {isLoading && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center text-sm text-blue-700">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 mr-2"></div>
              Loading user data...
            </div>
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center text-sm text-red-700">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Error loading user data: {error.message}
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Actions */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Staking Form */}
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h2 className="text-base font-medium text-gray-900 mb-4 flex items-center">
                <Coins className="w-4 h-4 text-gray-500 mr-2" />
                Stake Tokens
              </h2>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Amount to Stake
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    <div className="absolute right-3 top-2.5 text-xs text-gray-400">
                      Balance: {parseFloat(userData.userBalance).toLocaleString()} MTK
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={handleApprove}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2.5 px-4 rounded-md transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={handleStake}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 px-4 rounded-md transition-colors"
                  >
                    Stake
                  </button>
                </div>
              </div>
            </div>

            {/* Withdrawal Form */}
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h2 className="text-base font-medium text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-4 h-4 text-gray-500 mr-2" />
                Withdraw & Rewards
              </h2>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Amount to Withdraw
                  </label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-50 disabled:text-gray-400"
                    disabled={!userData.canWithdraw}
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={handleWithdraw}
                    disabled={!userData.canWithdraw}
                    className="bg-blue-50 hover:bg-blue-100 disabled:bg-gray-50 text-blue-700 disabled:text-gray-400 text-xs font-medium py-2 px-3 rounded-md transition-colors"
                  >
                    Withdraw
                  </button>
                  <button
                    onClick={handleClaimRewards}
                    className="bg-green-50 hover:bg-green-100 text-green-700 text-xs font-medium py-2 px-3 rounded-md transition-colors flex items-center justify-center"
                  >
                    <Award className="w-3 h-3 mr-1" />
                    Rewards
                  </button>
                  <button
                    onClick={handleEmergencyWithdraw}
                    className="bg-red-50 hover:bg-red-100 text-red-700 text-xs font-medium py-2 px-3 rounded-md transition-colors flex items-center justify-center"
                  >
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Emergency
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Stats */}
          <div className="space-y-3 overflow-y-auto">
            
            {/* User Position */}
            <div className="bg-white rounded border border-gray-200 p-3">
              <h3 className="text-xs font-medium text-gray-900 mb-2 flex items-center">
                <Wallet className="w-3.5 h-3.5 text-gray-500 mr-1" />
                Your Position
              </h3>
              
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Staked</span>
                  <span className="text-xs font-medium text-gray-900">{userData.userStake}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Rewards</span>
                  <span className="text-xs font-medium text-green-600">{userData.pendingRewards}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600 flex items-center">
                    <Clock className="w-2.5 h-2.5 mr-0.5" />
                    Unlock
                  </span>
                  <span className="text-xs font-medium text-orange-600">{userData.timeUntilUnlock}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Status</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${userData.canWithdraw ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {userData.canWithdraw ? 'Unlocked' : 'Locked'}
                  </span>
                </div>
              </div>
            </div>

            {/* Protocol Stats */}
            <div className="bg-white rounded border border-gray-200 p-3">
              <h3 className="text-xs font-medium text-gray-900 mb-2 flex items-center">
                <Users className="w-3.5 h-3.5 text-gray-500 mr-1" />
                Protocol Stats
              </h3>
              
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">APR</span>
                  <span className="text-xs font-medium text-blue-600">{userData.currentApr}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Total Staked</span>
                  <span className="text-xs font-medium text-gray-900">{userData.totalStaked}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Rate</span>
                  <span className="text-xs font-medium text-purple-600">{userData.rewardRate}</span>
                </div>
              </div>
            </div>

            {/* APR Info */}
            <div className="bg-blue-50 rounded border border-blue-100 p-2.5">
              <div className="flex items-start space-x-1.5">
                <TrendingUp className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-medium text-blue-900 mb-0.5">Dynamic APR</h4>
                  <p className="text-xs text-blue-700 leading-tight">
                    APR adjusts based on total staked. Early stakers get higher rewards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const { isConnected } = useAccount();
  const location = useLocation();

  // Handle wallet connection-based routing
  if (isConnected && location.pathname === '/') {
    return <Navigate to="/dashboard" replace />;
  }
  
  if (!isConnected && location.pathname !== '/') {
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<Navigate to={isConnected ? "/dashboard" : "/"} replace />} />
    </Routes>
  );
};

export default App;