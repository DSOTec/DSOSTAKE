import { writeContract, waitForTransactionReceipt } from 'wagmi/actions';

// --- Stake ---
const handleConfirmStake = async () => {
  if (!stakeAmount) return;

  try {
    const parsedAmount = parseUnits(stakeAmount, 18);

    // 1. Approve
    const approveTx = await writeContract(config, {
      address: TOKEN_ADDRESS,
      abi: tokenAbi,
      functionName: 'approve',
      args: [STAKING_ADDRESS, parsedAmount],
    });

    // wait for mining
    await waitForTransactionReceipt(config, { hash: approveTx });

    // 2. Stake
    const stakeTx = await writeContract(config, {
      address: STAKING_ADDRESS,
      abi: stakingAbi,
      functionName: 'stake',
      args: [parsedAmount],
    });

    await waitForTransactionReceipt(config, { hash: stakeTx });

    console.log('Stake successful!');
    setStakeAmount('');
    await refetchBalances();
  } catch (error) {
    console.error('Stake error:', error);
  }
};

// --- Withdraw ---
const handleConfirmWithdraw = async () => {
  if (!withdrawAmount) return;

  try {
    const parsedAmount = parseUnits(withdrawAmount, 18);

    const withdrawTx = await writeContract(config, {
      address: STAKING_ADDRESS,
      abi: stakingAbi,
      functionName: 'withdraw',
      args: [parsedAmount],
    });

    await waitForTransactionReceipt(config, { hash: withdrawTx });

    console.log('Withdraw successful!');
    setWithdrawAmount('');
    await refetchBalances();
  } catch (error) {
    console.error('Withdraw error:', error);
  }
};
