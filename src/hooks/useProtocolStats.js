import { useReadContract, useWatchContractEvent } from "wagmi";
import { STAKING_ADDRESS } from '../config/contract';
import stakingAbi from '../abi/stakingAbi.js';

const useProtocolStats = () => {
    // Get initial APR
    const { data: aprData, error: aprError, isLoading: aprLoading, refetch: refetchApr } = useReadContract({
        address: STAKING_ADDRESS,
        abi: stakingAbi,
        functionName: 'initialApr',
        enabled: true,
        watch: true,
        pollingInterval: 30000,
    });

    // Get total staked amount
    const { data: totalStakedData, error: totalStakedError, isLoading: totalStakedLoading, refetch: refetchTotalStaked } = useReadContract({
        address: STAKING_ADDRESS,
        abi: stakingAbi,
        functionName: 'totalStaked',
        enabled: true,
        watch: true,
        pollingInterval: 30000,
    });

    // Get current reward rate
    const { data: rewardRateData, error: rewardRateError, isLoading: rewardRateLoading, refetch: refetchRewardRate } = useReadContract({
        address: STAKING_ADDRESS,
        abi: stakingAbi,
        functionName: 'currentRewardRate',
        enabled: true,
        watch: true,
        pollingInterval: 30000,
    });

    // Watch for events that affect protocol stats
    useWatchContractEvent({
        address: STAKING_ADDRESS,
        abi: stakingAbi,
        eventName: 'Staked',
        onLogs: () => {
            console.log('Staked event detected, refetching protocol stats');
            refetchApr();
            refetchTotalStaked();
            refetchRewardRate();
        },
    });

    useWatchContractEvent({
        address: STAKING_ADDRESS,
        abi: stakingAbi,
        eventName: 'Withdrawn',
        onLogs: () => {
            console.log('Withdrawn event detected, refetching protocol stats');
            refetchApr();
            refetchTotalStaked();
            refetchRewardRate();
        },
    });

    // Use actual reward rate from contract
    const rewardRate = rewardRateData ? rewardRateData.toString() : '0';

    return {
        apr: aprData,
        totalStaked: totalStakedData,
        rewardRate: rewardRate,
        errors: {
            apr: aprError,
            totalStaked: totalStakedError,
            rewardRate: rewardRateError
        },
        loading: {
            apr: aprLoading,
            totalStaked: totalStakedLoading,
            rewardRate: rewardRateLoading
        },
        refetch: {
            apr: refetchApr,
            totalStaked: refetchTotalStaked,
            rewardRate: refetchRewardRate
        }
    };
};

export default useProtocolStats;
