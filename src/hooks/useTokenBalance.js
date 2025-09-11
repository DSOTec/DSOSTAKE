import { useReadContract, useWatchContractEvent } from "wagmi";
import { TOKEN_ADDRESS, STAKING_ADDRESS } from '../config/contract';
import { erc20Abi } from '../abi/erc20.js';
import stakingAbi from '../abi/stakingAbi.js';

const useTokenBalance = (userAddress) => {
    const { data, error, isLoading, refetch } = useReadContract({
        address: TOKEN_ADDRESS,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [userAddress],
        enabled: !!userAddress,
        watch: true,
        pollingInterval: 10000, // Poll every 10 seconds for balance updates
    });

    // Handle empty data case (user has no token balance yet)
    // When contract returns "0x", it means no balance exists for this user
    const balance = data || 0n;

    // Suppress the specific error for empty data (0x) since it's expected for users with no balance
    const displayError = error && !error.message.includes('returned no data') ? error : null;

    // Watch for staking events that affect token balance
    useWatchContractEvent({
        address: STAKING_ADDRESS,
        abi: stakingAbi,
        eventName: 'Staked',
        onLogs: () => {
            console.log('Staked event detected, refetching token balance');
            refetch();
        },
        enabled: !!userAddress,
    });

    useWatchContractEvent({
        address: STAKING_ADDRESS,
        abi: stakingAbi,
        eventName: 'Withdrawn',
        onLogs: () => {
            console.log('Withdrawn event detected, refetching token balance');
            refetch();
        },
        enabled: !!userAddress,
    });

    useWatchContractEvent({
        address: STAKING_ADDRESS,
        abi: stakingAbi,
        eventName: 'EmergencyWithdrawn',
        onLogs: () => {
            console.log('EmergencyWithdrawn event detected, refetching token balance');
            refetch();
        },
        enabled: !!userAddress,
    });

    return {
        balance,
        error: displayError,
        isLoading,
        refetch
    };
};

export default useTokenBalance;
