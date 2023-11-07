import { addChain_Params } from "@/libs/common.js";
import { Toast } from "vant";

export const addVTNetwork = async (
    successCallback = () => {},
    failCallback = () => {}
) => {
    let provider = window.ethereum;
    if (!provider) {
        Toast("Please install metamask wallet");
        return;
    }
    try {
        let accounts = [];
        if (provider) {
            await provider.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: addChain_Params.chainId }],
            });
            accounts = await provider.request({
                method: "eth_requestAccounts",
            });
        }
        setTimeout(() => {
            successCallback(provider, accounts);
        }, 300);
    } catch (error) {
        console.log("🔥🔥🔥🚀 ~ file: methods.js:43 ~ error:", error);
        if (
            error.code === 4902 ||
            error.code == -32602 ||
            error.code == -32603
        ) {
            try {
                await provider.request({
                    method: "wallet_addEthereumChain",
                    params: [addChain_Params],
                });
                const accounts = await provider.request({
                    method: "eth_requestAccounts",
                });
                setTimeout(() => {
                    failCallback(provider, accounts);
                }, 300);
            } catch (addError) {
                console.log("add network error");
            }
        } else {
            Toast(error.message);
        }
    }
};
