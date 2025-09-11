import { useCallback } from "react";
import { toast } from "sonner";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { STAKING_ADDRESS } from '../config/contract';
import  stakingAbi  from '../abi/stakingAbi.js';



const useStake = () => {
    const { address } = useAccount();
    const publicClient = usePublicClient();
    const { writeContractAsync } = useWriteContract();
    
    const stake = useCallback(
        async (amount) => {
            if (!address) {
                toast.error("Wallet not connected");
                throw new Error("Wallet not connected");
            }

            try {
                const result = await writeContractAsync({
                    address: STAKING_ADDRESS,
                    abi: stakingAbi,
                    functionName: 'stake',
                    args: [amount],
                    account: address,
                    chain: publicClient.chain,
                });

                toast.success("Staking successful!");
                return result;
            } catch (error) {
                toast.error("Staking failed");
                console.error("Staking error:", error);
                throw error;
            }
        },
        [address, writeContractAsync, publicClient]
    );

    return { stake };
};

export default useStake;