import { useCallback } from "react";
import { toast } from "sonner";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { STAKING_ADDRESS } from '../config/contract.js';
import stakingAbi from '../abi/stakingAbi.js';

const useEmergencyWithdraw = () => {
    const { address } = useAccount();
    const publicClient = usePublicClient();
    const { writeContractAsync } = useWriteContract();
    
    const emergencyWithdraw = useCallback(
        async () => {
            if (!address) {
                toast.error("Wallet not connected");
                throw new Error("Wallet not connected");
            }

            try {
                const result = await writeContractAsync({
                    address: STAKING_ADDRESS,
                    abi: stakingAbi,
                    functionName: 'emergencyWithdraw',
                    args: [],
                    account: address,
                    chain: publicClient.chain,
                });

                toast.success("Emergency withdrawal successful!");
                return result;
            } catch (error) {
                toast.error("Emergency withdrawal failed");
                console.error("Emergency withdrawal error:", error);
                throw error;
            }
        },
        [address, writeContractAsync, publicClient]
    );

    return { emergencyWithdraw };
};

export default useEmergencyWithdraw;