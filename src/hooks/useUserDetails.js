import { useReadContract, useWatchContractEvent } from "wagmi";
import { useEffect } from "react";
import { STAKING_ADDRESS } from '../config/contract';
import stakingAbi from '../abi/stakingAbi.js';

const useUserDetails = (userAddress) => {
    // Read contract data with polling for real-time updates
    const { data, error, isLoading, refetch } = useReadContract({
        address: STAKING_ADDRESS,
        abi: stakingAbi,
        functionName: 'getUserDetails',
        args: [userAddress],
        enabled: !!userAddress,
        watch: true, // Enable real-time watching
        pollingInterval: 30000, // Poll every 30 seconds as fallback
    });

    // Handle empty data case (user has no staking data yet)
    // When contract returns "0x", it means no data exists for this user
    const userDetails = data || {
        stakedAmount: 0n,
        lastStakeTimestamp: 0n,
        pendingRewards: 0n,
        timeUntilUnlock: 0n,
        canWithdraw: false
    };

    // Suppress the specific error for empty data (0x) since it's expected for new users
    const displayError = error && !error.message.includes('returned no data') ? error : null;

    // Watch for staking-related events to trigger immediate updates
    useWatchContractEvent({
        address: STAKING_ADDRESS,
        abi: stakingAbi,
        eventName: 'Staked',
        onLogs: () => {
            console.log('Staked event detected, refetching user details');
            refetch();
        },
        enabled: !!userAddress,
    });

    useWatchContractEvent({
        address: STAKING_ADDRESS,
        abi: stakingAbi,
        eventName: 'Withdrawn',
        onLogs: () => {
            console.log('Withdrawn event detected, refetching user details');
            refetch();
        },
        enabled: !!userAddress,
    });

    useWatchContractEvent({
        address: STAKING_ADDRESS,
        abi: stakingAbi,
        eventName: 'RewardsClaimed',
        onLogs: () => {
            console.log('RewardsClaimed event detected, refetching user details');
            refetch();
        },
        enabled: !!userAddress,
    });

    useWatchContractEvent({
        address: STAKING_ADDRESS,
        abi: stakingAbi,
        eventName: 'EmergencyWithdrawn',
        onLogs: () => {
            console.log('EmergencyWithdrawn event detected, refetching user details');
            refetch();
        },
        enabled: !!userAddress,
    });

    return {
        userDetails,
        error: displayError,
        isLoading,
        refetch // Expose refetch for manual updates
    };
};

export default useUserDetails;
