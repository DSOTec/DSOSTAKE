import { useCallback } from "react";
import { toast } from "sonner";
import { useAccount, usePublicClient, useWalletClient, useWriteContract } from "wagmi";
import {TOKEN_ADDRESS, STAKING_ADDRESS} from '../config/contract';
import {erc20Abi} from '../abi/erc20.js';

const useApprove = () => {
    const { address } = useAccount();
    const publicClient = usePublicClient();
    const { data: walletClient } = useWalletClient();
    const { writeContractAsync } = useWriteContract();
    
    const approve = useCallback(
    async (amount) => { // Change parameter type to bigint
        if (!address) {
            toast.error("Wallet not connected");
            throw new Error("Wallet not connected");
        }

        try {
            const result = await writeContractAsync({
                address: TOKEN_ADDRESS ,
                abi: erc20Abi,
                functionName: 'approve',
                args: [STAKING_ADDRESS, amount],
                account: address,
                chain: publicClient.chain,
            });

            toast.success("Approval successful!");
            return result;
        } catch (error) {
            toast.error("Approval failed");
            console.error("Approval error:", error);
            throw error;
        }
    },
    [address, writeContractAsync]
);

    return { approve };
};

export default useApprove;