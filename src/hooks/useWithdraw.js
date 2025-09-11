import { useCallback } from "react";
import { toast } from "sonner";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { STAKING_ADDRESS } from '../config/contract';
import stakingAbi from '../abi/stakingAbi.js';

const useWithdraw = () => {
    const { address } = useAccount();
    const publicClient = usePublicClient();
    const { writeContractAsync } = useWriteContract();
    
    const withdraw = useCallback(
        async (amount) => {
            if (!address) {
                toast.error("Wallet not connected");
                throw new Error("Wallet not connected");
            }

            try {
                const result = await writeContractAsync({
                    address: STAKING_ADDRESS,
                    abi: stakingAbi,
                    functionName: 'withdraw',
                    args: [amount],
                    account: address,
                    chain: publicClient.chain,
                });

                toast.success("Withdrawal successful!");
                return result;
            } catch (error) {
                toast.error("Withdrawal failed");
                console.error("Withdrawal error:", error);
                throw error;
            }
        },
        [address, writeContractAsync, publicClient]
    );

    return { withdraw };
};

export default useWithdraw;