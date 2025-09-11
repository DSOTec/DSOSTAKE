import React, { useState, useEffect } from 'react';
import { createPublicClient, createWalletClient, http, custom, formatUnits, parseUnits } from 'viem';
import { mainnet } from 'viem/chains';

// Contract addresses - replace with your actual addresses
const TOKEN_ADDRESS = '0xd9145CCE52D386f254917e481eB44e9943F39138...'; // Your ERC20 token address
const STAKING_ADDRESS = '0x...'; // Your staking contract address

// ERC20 Token ABI
const TOKEN_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'bool' }]
  },
  {
    name: 'allowance',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }]
  }
];

// Staking Contract ABI
const STAKING_ABI = [
  {
    name: 'stake',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'amount', type: 'uint256' }],
    outputs: []
  },
  {
    name: 'withdraw',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'amount', type: 'uint256' }],
    outputs: []
  },
  {
    name: 'emergencyWithdraw',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: []
  },
  {
    name: 'getUserDetails',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [
      { name: 'stakedAmount', type: 'uint256' },
      { name: 'lastStakeTimestamp', type: 'uint256' },
      { name: 'pendingRewards', type: 'uint256' },
      { name: 'timeUntilUnlock', type: 'uint256' },
      { name: 'canWithdraw', type: 'bool' }
    ]
  }
];

const StakeWithdrawInterface = ({ tokenSymbol = "XYZ" }) => {
  const [account, setAccount] = useState('');
  const [stakeAmount, setStakeAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [stakePercentage, setStakePercentage] = useState(50);
  const [withdrawPercentage, setWithdrawPercentage] = useState(50);
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState(false);
  const [staking, setStaking] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  
  // Contract data
  const [available, setAvailable] = useState(0);
  const [staked, setStaked] = useState(0);
  const [allowance, setAllowance] = useState(0n);
  const [canWithdraw, setCanWithdraw] = useState(false);
  const [timeUntilUnlock, setTimeUntilUnlock] = useState(0);
  const [decimals, setDecimals] = useState(18);

  // Initialize clients
  const publicClient = createPublicClient({
    chain: mainnet,
    transport: http()
  });

  const walletClient = typeof window !== 'undefined' && window.ethereum 
    ? createWalletClient({
        chain: mainnet,
        transport: custom(window.ethereum)
      })
    : null;

  // Connect wallet
  const connectWallet = async () => {
    if (!walletClient) {
      alert('Please install MetaMask or another Web3 wallet');
      return;
    }

    try {
      const accounts = await walletClient.requestAddresses();
      setAccount(accounts[0]);
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  // Fetch all contract data
  const fetchContractData = async () => {
    if (!account) return;

    try {
      // Get decimals
      const decimalsResult = await publicClient.readContract({
        address: TOKEN_ADDRESS,
        abi: TOKEN_ABI,
        functionName: 'decimals'
      });
      setDecimals(Number(decimalsResult));

      // Get token balance
      const balance = await publicClient.readContract({
        address: TOKEN_ADDRESS,
        abi: TOKEN_ABI,
        functionName: 'balanceOf',
        args: [account]
      });
      setAvailable(Number(formatUnits(balance, Number(decimalsResult))));

      // Get allowance
      const allowanceResult = await publicClient.readContract({
        address: TOKEN_ADDRESS,
        abi: TOKEN_ABI,
        functionName: 'allowance',
        args: [account, STAKING_ADDRESS]
      });
      setAllowance(BigInt(allowanceResult));

      // Get user staking details
      const userDetails = await publicClient.readContract({
        address: STAKING_ADDRESS,
        abi: STAKING_ABI,
        functionName: 'getUserDetails',
        args: [account]
      });

      const [stakedAmount, lastStakeTimestamp, pendingRewards, unlockTime, withdrawable] = userDetails;
      setStaked(Number(formatUnits(stakedAmount, Number(decimalsResult))));
      setCanWithdraw(withdrawable);
      setTimeUntilUnlock(Number(unlockTime));

    } catch (error) {
      console.error('Error fetching contract data:', error);
    }
  };

  // Effect to fetch data when account changes
  useEffect(() => {
    if (account) {
      fetchContractData();
      // Set up polling for real-time updates
      const interval = setInterval(fetchContractData, 10000); // Every 10 seconds
      return () => clearInterval(interval);
    }
  }, [account]);

  // Percentage change handlers
  const handleStakePercentageChange = (percentage) => {
    setStakePercentage(percentage);
    const newAmount = (available * percentage) / 100;
    setStakeAmount(Number(newAmount.toFixed(6)));
  };

  const handleWithdrawPercentageChange = (percentage) => {
    setWithdrawPercentage(percentage);
    const newAmount = (staked * percentage) / 100;
    setWithdrawAmount(Number(newAmount.toFixed(6)));
  };

  const handleStakeAmountChange = (amount) => {
    const num = parseFloat(amount) || 0;
    setStakeAmount(num);
    setStakePercentage(available ? Math.min((num / available) * 100, 100) : 0);
  };

  const handleWithdrawAmountChange = (amount) => {
    const num = parseFloat(amount) || 0;
    setWithdrawAmount(num);
    setWithdrawPercentage(staked ? Math.min((num / staked) * 100, 100) : 0);
  };

  // Approval function
  const handleApprove = async () => {
    if (!account) return alert("Connect wallet first");
    if (!stakeAmount || stakeAmount <= 0) return alert("Enter stake amount");
    if (stakeAmount > available) return alert("Insufficient token balance");

    setApproving(true);
    try {
      // Approve maximum amount to avoid multiple approvals
      const maxAmount = parseUnits("115792089237316195423570985008687907853269984665640564039457584007913129639935", decimals);
      
      const { request } = await publicClient.simulateContract({
        address: TOKEN_ADDRESS,
        abi: TOKEN_ABI,
        functionName: 'approve',
        args: [STAKING_ADDRESS, maxAmount],
        account
      });

      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });
      
      alert(`Successfully approved ${tokenSymbol} for staking`);
      await fetchContractData(); // Refresh data
    } catch (err) {
      console.error("approval error:", err);
      alert("Approval failed — see console for details");
    } finally {
      setApproving(false);
    }
  };

  // Stake function
  const handleStake = async () => {
    if (!account) return alert("Connect wallet first");
    if (!stakeAmount || stakeAmount <= 0) return alert("Enter stake amount");
    if (stakeAmount > available) return alert("Insufficient token balance");

    setStaking(true);
    try {
      const parsedAmount = parseUnits(stakeAmount.toString(), decimals);

      // Check if we have enough allowance
      if (allowance < BigInt(parsedAmount)) {
        alert("Please approve tokens first before staking");
        return;
      }

      const { request } = await publicClient.simulateContract({
        address: STAKING_ADDRESS,
        abi: STAKING_ABI,
        functionName: 'stake',
        args: [parsedAmount],
        account
      });

      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });

      alert(`Successfully staked ${stakeAmount} ${tokenSymbol}`);
      setStakeAmount('');
      setStakePercentage(50);
      await fetchContractData(); // Refresh data
    } catch (err) {
      console.error("stake error:", err);
      alert("Stake failed — see console for details");
    } finally {
      setStaking(false);
    }
  };

  // Combined approve and stake function
  const handleConfirmStake = async () => {
    if (!account) return alert("Connect wallet first");
    if (!stakeAmount || stakeAmount <= 0) return alert("Enter stake amount");
    if (stakeAmount > available) return alert("Insufficient token balance");

    setLoading(true);
    try {
      const parsedAmount = parseUnits(stakeAmount.toString(), decimals);

      // If allowance is less than needed, approve first
      if (allowance < BigInt(parsedAmount)) {
        const maxAmount = parseUnits("115792089237316195423570985008687907853269984665640564039457584007913129639935", decimals);
        
        const { request: approveRequest } = await publicClient.simulateContract({
          address: TOKEN_ADDRESS,
          abi: TOKEN_ABI,
          functionName: 'approve',
          args: [STAKING_ADDRESS, maxAmount],
          account
        });

        const approveHash = await walletClient.writeContract(approveRequest);
        await publicClient.waitForTransactionReceipt({ hash: approveHash });
      }

      // Now stake
      const { request: stakeRequest } = await publicClient.simulateContract({
        address: STAKING_ADDRESS,
        abi: STAKING_ABI,
        functionName: 'stake',
        args: [parsedAmount],
        account
      });

      const stakeHash = await walletClient.writeContract(stakeRequest);
      await publicClient.waitForTransactionReceipt({ hash: stakeHash });

      alert(`Successfully staked ${stakeAmount} ${tokenSymbol}`);
      setStakeAmount('');
      setStakePercentage(50);
      await fetchContractData(); // Refresh data
    } catch (err) {
      console.error("stake error:", err);
      alert("Stake failed — see console for details");
    } finally {
      setLoading(false);
    }
  };

  // Withdraw function
  const handleConfirmWithdraw = async () => {
    if (!account) return alert("Connect wallet first");
    if (!withdrawAmount || withdrawAmount <= 0) return alert("Enter withdraw amount");
    if (withdrawAmount > staked) return alert("Requested withdraw exceeds staked balance");
    
    if (!canWithdraw) {
      const unlockTime = new Date(Number(timeUntilUnlock) * 1000);
      alert(`Tokens are locked until ${unlockTime.toLocaleString()}. Use emergency withdraw if needed.`);
      return;
    }

    setWithdrawing(true);
    try {
      const parsedAmount = parseUnits(withdrawAmount.toString(), decimals);

      const { request } = await publicClient.simulateContract({
        address: STAKING_ADDRESS,
        abi: STAKING_ABI,
        functionName: 'withdraw',
        args: [parsedAmount],
        account
      });

      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });

      alert(`Successfully withdrew ${withdrawAmount} ${tokenSymbol}`);
      setWithdrawAmount('');
      setWithdrawPercentage(50);
      await fetchContractData(); // Refresh data
    } catch (err) {
      console.error("withdraw error:", err);
      alert("Withdraw failed — see console for details");
    } finally {
      setWithdrawing(false);
    }
  };

  // Emergency withdraw function
  const handleEmergencyWithdraw = async () => {
    if (!account) return alert("Connect wallet first");
    if (staked <= 0) return alert("No staked tokens to withdraw");
    
    if (!confirm("Emergency withdraw will apply a penalty. Are you sure?")) {
      return;
    }

    setWithdrawing(true);
    try {
      const { request } = await publicClient.simulateContract({
        address: STAKING_ADDRESS,
        abi: STAKING_ABI,
        functionName: 'emergencyWithdraw',
        args: [],
        account
      });

      const hash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });

      alert(`Successfully emergency withdrew all staked tokens (penalty applied)`);
      setWithdrawAmount('');
      setWithdrawPercentage(50);
      await fetchContractData(); // Refresh data
    } catch (err) {
      console.error("emergency withdraw error:", err);
      alert("Emergency withdraw failed — see console for details");
    } finally {
      setWithdrawing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {!account ? (
          <div className="text-center mb-8">
            <button
              onClick={connectWallet}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-400">Connected Account:</p>
            <p className="font-mono text-sm break-all">{account}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Stake Card */}
          <div className="bg-gray-800 rounded-xl p-6 md:p-8 border border-gray-700">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">S</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white">Stake Tokens</h2>
            </div>

            <div className="mb-6">
              <label className="block text-gray-400 mb-3">Amount to Stake</label>
              <div className="flex items-center bg-gray-700 rounded-lg p-3 md:p-4">
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => handleStakeAmountChange(e.target.value)}
                  placeholder="0.00"
                  className="bg-transparent text-white text-lg font-semibold flex-1 outline-none"
                  step="0.000001"
                  min="0"
                  max={available}
                  disabled={loading}
                />
                <span className="text-gray-400 ml-3">{tokenSymbol}</span>
              </div>
            </div>

            {/* Percentage Slider */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <label className="text-gray-400">Percentage of Available</label>
                <span className="text-purple-400 font-semibold">{Math.round(stakePercentage)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={stakePercentage}
                onChange={(e) => handleStakePercentageChange(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-600 rounded-lg cursor-pointer"
                disabled={loading}
              />
              <div className="text-xs text-gray-500 mt-2">Available: {available.toLocaleString()} {tokenSymbol}</div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-gray-400">Approval Status</label>
                <span className={`font-semibold ${allowance > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {allowance > 0 ? 'Approved' : 'Not Approved'}
                </span>
              </div>
              <button
                onClick={handleApprove}
                disabled={!account || !stakeAmount || stakeAmount <= 0 || stakeAmount > available || approving}
                className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white font-semibold py-2 rounded-lg transition-all mb-4"
              >
                {account ? (approving ? "Approving..." : "Approve Tokens") : "Connect Wallet First"}
              </button>
            </div>

            <button
              onClick={handleStake}
              disabled={!account || !stakeAmount || stakeAmount <= 0 || stakeAmount > available || allowance <= 0 || staking}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-all mb-3"
            >
              {account ? (staking ? "Staking..." : "Stake Tokens") : "Connect Wallet First"}
            </button>

            <div className="text-center text-gray-400 text-sm mb-4">OR</div>

            <button
              onClick={handleConfirmStake}
              disabled={!account || !stakeAmount || stakeAmount <= 0 || stakeAmount > available || loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-all"
            >
              {account ? (loading ? "Processing..." : "Approve & Stake") : "Connect Wallet First"}
            </button>
          </div>

          {/* Withdraw Card */}
          <div className="bg-gray-800 rounded-xl p-6 md:p-8 border border-gray-700">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">W</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white">Withdraw Tokens</h2>
            </div>

            <div className="mb-6">
              <label className="block text-gray-400 mb-3">Amount to Withdraw</label>
              <div className="flex items-center bg-gray-700 rounded-lg p-3 md:p-4">
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => handleWithdrawAmountChange(e.target.value)}
                  placeholder="0.00"
                  className="bg-transparent text-white text-lg font-semibold flex-1 outline-none"
                  step="0.000001"
                  min="0"
                  max={staked}
                  disabled={loading}
                />
                <span className="text-gray-400 ml-3">{tokenSymbol}</span>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <label className="text-gray-400">Percentage of Staked</label>
                <span className="text-emerald-400 font-semibold">{Math.round(withdrawPercentage)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={withdrawPercentage}
                onChange={(e) => handleWithdrawPercentageChange(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-600 rounded-lg cursor-pointer"
                disabled={loading}
              />
              <div className="text-xs text-gray-500 mt-2">Staked: {staked.toLocaleString()} {tokenSymbol}</div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-gray-400">Lock Status</label>
                <span className={`font-semibold ${canWithdraw ? 'text-green-400' : 'text-red-400'}`}>
                  {canWithdraw ? 'Unlocked' : 'Locked'}
                </span>
              </div>
              {!canWithdraw && timeUntilUnlock > 0 && (
                <div className="text-xs text-gray-500 mb-3">
                  Unlocks at: {new Date(Number(timeUntilUnlock) * 1000).toLocaleString()}
                </div>
              )}
            </div>

            <button
              onClick={handleConfirmWithdraw}
              disabled={!account || !withdrawAmount || withdrawAmount <= 0 || withdrawAmount > staked || !canWithdraw || withdrawing}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-all mb-3"
            >
              {account ? (withdrawing ? "Withdrawing..." : "Withdraw Tokens") : "Connect Wallet First"}
            </button>

            {!canWithdraw && (
              <>
                <div className="text-center text-gray-400 text-sm mb-3">OR</div>
                <button
                  onClick={handleEmergencyWithdraw}
                  disabled={!account || staked <= 0 || withdrawing}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-all"
                >
                  {account ? (withdrawing ? "Emergency Withdrawing..." : "Emergency Withdraw (with penalty)") : "Connect Wallet First"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakeWithdrawInterface;