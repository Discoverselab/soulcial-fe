/*General method definition
matters need attention
1. It cannot be defined by () = > {} arrow function.
2. A large number of calculation methods are suggested to be computed.

ps: https://cn.vuejs.org/v2/api/#methods
*/
import { get, post } from "@/http/http";
import wethABI from "@/libs/weth.json";
import { ABIAddress, clearInfo } from "@/libs/common.js";
import { ethers } from "ethers";
const provider = window.ethereum ? window.ethereum : null;
let signer;
let providers;
providers = provider ? new ethers.providers.Web3Provider(provider) : null;
signer = providers ? providers.getSigner() : null;
const contract = new ethers.Contract(ABIAddress, wethABI, signer);
export default {
    handleBalance(balance) {
        let etherString = this.formatNumber(ethers.utils.formatEther(balance));
        this.WalletBalance = String(parseFloat(etherString).toFixed(5));
    },
    // 获取主链币钱包余额
    async getBalance() {
        let address = this.$loginData.Auth_Token;
        let provider = null;
        if (this.$loginData.loginType == 0) {
            provider = window.ethereum
                ? new ethers.providers.Web3Provider(window.ethereum)
                : null;
            provider.getBalance(address).then((balance) => {
                this.handleBalance(balance);
            });
        } else {
            if (window.web3.eth) {
                await window.web3.eth.getBalance(address, (err, balance) => {
                    if (err) {
                        this.WalletBalance = "0";
                        return;
                    }
                    this.handleBalance(balance);
                });
            }else{
                clearInfo();
            }
        }
    },
    // 获取W余额
    async BalanceOf() {
        let provider = window.ethereum ? window.ethereum : null;
        await provider.request({
            method: "eth_requestAccounts",
        });
        try {
            const BalanceOf = await contract.balanceOf(
                this.$loginData.Auth_Token
            );
            this.PoolBalance = ethers.utils.formatEther(
                this.formatNumber(parseInt(BalanceOf._hex))
            );
        } catch (error) {
            this.PoolBalance = "0";
            // this.$toast(error)
        }
    },
    async callBack(type, txHash, price) {
        this.addWallectHistory(type, txHash, price);
    },
    getWallectHistory() {
        if (this.walletCurrentPage < 2) {
            this.overlayshow = true;
        }
        let data = {
            pageNum: this.walletCurrentPage,
            pageSize: this.walletPageSize,
        };
        let url = this.$api.infor.getWallectHistory;

        get(url, data)
            .then(async (res) => {
                if (res.code === 200) {
                    if (res.data.total === 0) {
                        this.showNoWallet = true;
                    }
                    // this.WalletHistory = res.data.records;
                    this.WalletHistory = this.WalletHistory.concat(
                        res.data.records
                    );
                    this.walletLoading = false;
                    if (this.WalletHistory.length >= res.data.total) {
                        this.walletFinished = true;
                    }
                    await this.getBalance();
                    // this.BalanceOf();
                } else {
                    this.walletLoading = false;
                }
                this.overlayshow = false;
            })
            .catch((error) => {
                this.overlayshow = false;
            });
    },
    getVSoulBalance() {
        let url = this.$api.infor.getVSoulBalance;
        get(url)
            .then((res) => {
                if (res.code === 200) {
                    this.VSoulBalance = res.data.vsoulPrice;
                }
            })
            .catch((error) => {});
    },
    getVSoulHistory() {
        if (this.earnCurrentPage < 2) {
            this.overlayshow = true;
        }
        let data = {
            pageNum: this.earnCurrentPage,
            pageSize: this.earnPageSize,
        };
        let url = this.$api.infor.getVSoulHistory;

        get(url, data)
            .then((res) => {
                const { data, code } = res;
                if (data.total === 0) {
                    this.showNoData = true;
                }
                if (code === 200 && data.records && data.records.length > 0) {
                    this.VSoulHistory = this.VSoulHistory.concat(data.records);
                    this.earnLoading = false;
                    if (this.VSoulHistory.length >= data.total) {
                        this.earnFinished = true;
                    }
                } else {
                    this.earnLoading = false;
                }
            })
            .catch((error) => {})
            .finally(() => {
                this.overlayshow = false;
            });
    },
    // walletTypeNmae(index) {
    //     let Obj = {
    //         0:'Deposit',
    //         1:'Withdraw',
    //         2:'Earn',
    //         3:'Collect',
    //         4:'Refund',
    //         5:'Sell',
    //         6:'Creartor Earnings'
    //     }
    //     return index == 0 ? 'Deposit' : index == 1 ? 'Withdraw' : index == 2 ? 'Earn' : index == 4 ? 'Refund' : index == 5?'Sell':'Collect'
    // },
    // 添加钱包记录
    addWallectHistory(type, txHash, price) {
        this.overlayshow = true;
        let data = {
            type: type ? 0 : 1,
            txnHash: txHash,
            price: price,
        };
        let url = this.$api.infor.addWallectHistory;
        post(url, data, true)
            .then((res) => {
                if (res.code === 200) {
                    this.getWallectHistory();
                }
                this.overlayshow = false;
            })
            .catch((error) => {
                this.overlayshow = false;
            });
    },
    // 置换W币
    async addFunds(type) {
        if (type) {
            if (!Number(this.WalletBalance)) {
                return;
            }
        } else {
            if (!Number(this.PoolBalance)) {
                return;
            }
        }
        this.walletType = type;
        this.ReplaceShow = true;
    },
    formatNumber(number) {
        if (Number.isInteger(number)) {
            return number.toString(); // 如果是整数，直接返回
        } else {
            const roundedNumber = Math.round(number * 1000000) / 1000000; // 四舍五入到4位小数
            const decimalPlaces = roundedNumber.toString().split(".")[1]; // 获取小数部分
            if (decimalPlaces && decimalPlaces.length > 6) {
                return roundedNumber.toFixed(6); // 如果小数位超过4位，保留4位小数
            } else {
                return roundedNumber.toString(); // 如果小数位不超过4位，展示实际位数
            }
        }
    },
    erIDClick(item) {
        this.erID = item.id;
        this.getMintedNFTPage(item.id);
    },
    getMintedNFTPage(type) {
        this.overlayshow = true;
        let data = {
            current: 1,
            size: 99,
        };
        let url =
            type == 1
                ? this.$api.infor.getCollectNFTPage
                : this.$api.infor.getPicksNFTPage;
        this.NftList = [];
        get(url, data)
            .then((res) => {
                if (res.code === 200) {
                    this.NftList = res.data.records;
                }
                this.overlayshow = false;
            })
            .catch((error) => {
                this.overlayshow = false;
            });
    },
    onEarnLoad() {
        this.earnCurrentPage++;
        this.getVSoulHistory();
    },
    onWalletLoad() {
        this.walletCurrentPage++;
        this.getWallectHistory();
    },
    changeTabActive(id) {
        this.TabActive = id;
        if (this.TabActive === 1) {
            if (!this.VSoulHistory.length) {
                this.VSoulHistory = [];
                this.getVSoulHistory();
                this.getVSoulBalance();
            }
        }
    },
    jumpOP(){
        window.open('https://app.optimism.io/bridge/deposit', '_blank');
    }
};
