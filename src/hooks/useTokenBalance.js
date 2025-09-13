import { useReadContract, useWatchContractEvent } from "wagmi";
import { TOKEN_ADDRESS, STAKING_ADDRESS } from '../config/contract';
import { erc20Abi } from '../abi/erc20.js';
import stakingAbi from '../abi/stakingAbi.js';
import { formatUnits } from 'viem';

const useTokenBalance = (userAddress) => {
    const { data: rawBalance, error, isLoading, refetch } = useReadContract({
        address: TOKEN_ADDRESS,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [userAddress],
        enabled: !!userAddress,
        watch: true,
        pollingInterval: 10000, // Poll every 10 seconds for balance updates
    });

    // Format balance to human readable form
    const balance = rawBalance ? formatUnits(rawBalance, 18) : '0';

    // Suppress the specific error for empty data (0x) since it's expected for users with no balance
    const displayError = error && !error.message.includes('returned no data') ? error : null;

    // Watch for token transfer events
    useWatchContractEvent({
        address: TOKEN_ADDRESS,
        abi: erc20Abi,
        eventName: 'Transfer',
        onLogs: (logs) => {
            // Only refetch if the transfer involves our user
            if (logs.some(log => 
                log.args.from === userAddress || 
                log.args.to === userAddress
            )) {
                console.log('Token transfer detected, refetching balance');
                refetch();
            }
        },
        enabled: !!userAddress,
    });

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
