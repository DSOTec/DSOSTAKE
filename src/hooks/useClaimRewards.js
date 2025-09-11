import { useCallback } from "react";
import { toast } from "sonner";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { STAKING_ADDRESS } from '../config/contract.js';
import stakingAbi from '../abi/stakingAbi.js';

const useClaimRewards = () => {
    const { address } = useAccount();
    const publicClient = usePublicClient();
    const { writeContractAsync } = useWriteContract();
    
    const claimRewards = useCallback(
        async () => {
            if (!address) {
                toast.error("Wallet not connected");
                throw new Error("Wallet not connected");
            }

            try {
                const result = await writeContractAsync({
                    address: STAKING_ADDRESS,
                    abi: stakingAbi,
                    functionName: 'claimRewards',
                    args: [],
                    account: address,
                    chain: publicClient.chain,
                });

                toast.success("Rewards claimed successfully!");
                return result;
            } catch (error) {
                toast.error("Claiming rewards failed");
                console.error("Claim rewards error:", error);
                throw error;
            }
        },
        [address, writeContractAsync, publicClient]
    );

    return { claimRewards };
};

export default useClaimRewards;