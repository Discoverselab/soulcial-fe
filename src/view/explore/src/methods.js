/*General method definition
matters need attention
1. It cannot be defined by () = > {} arrow function.
2. A large number of calculation methods are suggested to be computed.

ps: https://cn.vuejs.org/v2/api/#methods
*/
import { get, post } from "../../../http/http";
import { RuntimeConnector, Extension } from "@dataverse/runtime-connector";
const runtimeConnector = new RuntimeConnector(Extension);
const app = "soulcial";
export default {
    _isMobile() {
        let flag = navigator.userAgent.match(
          /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
        );
        return flag;
      },
    async updataStream() {
        //Update stream
        const encrypted = JSON.stringify({
            level: false,
            charisma: false,
            extroversion: false,
            energy: false,
            wisdom: false,
            art: false,
            courage: false,
            soulscore: false,
        });
        await runtimeConnector.updateStream({
            streamId:
                "kjzl6kcym7w8y9exy11mvicci8yoc4uaiaefslcoew664o3qrypfhh641nwnl2p",
            streamContent: {
                level: "88",
                charisma: 88,
                extroversion: 88,
                energy: 88,
                wisdom: 88,
                art: 88,
                courage: 88,
                soulscore: 88,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                encrypted,
            },
        });
    },
    changeTab(id) {
        this.TabActive = id;
        this.showBackground = false
        if (this.TabActive === 1) {
            this.finished = false;
            this.nftList = [];
            this.currentPage = 1;
            this.pageType = 0;
            this.getData();
        } else if (this.TabActive === 2) {
            this.finished = false;
            this.nftList = [];
            this.currentPage = 1;
            this.pageType = 1;
            this.getData();
        } else if (this.TabActive === 3) {
            this.activityList = [];
            this.currentPage = 1;
           this.getActivityData()
        }
    },
    getActivityData(){
        if (this.currentPage < 2) {
            this.overlayshow = true;
        }
        let url =
            this.$api.nft.getActivePage +
            `?current=${this.currentPage}&size=${this.pageSize}`;
        get(url)
            .then((res) => {
                const {code, data} = res 
                if (code === 200 && data.records && data.records.length > 0) {
                    this.activityList = this.activityList.concat(data.records);
                    // 加载状态结束
                    this.activityLoading = false;
                    // 数据全部加载完成
                    if (this.activityList.length >= data.total) {
                        this.activityFinished = true;
                    }
                    console.log(this.activityList,'this.activityList')
                } else {
                    // 加载状态结束
                    this.activityLoading = false;
                }
            })
            .catch((error) => {
                
            })
            .finally(() => {
                this.overlayshow = false;
            });
    },
    linkNftDetail(id){
        this.$router.push(`/explore_details?id=${id}&path=`)
    },
    urls() {
        var urls = [
            "Label_01",
            "Label_02",
            "Label_03",
            "Label_04",
            "Label_05",
            "Label_06",
            "Label_07",
            "Label_08",
            "Label_09",
            "Label_10",
        ];
        //Randomly get a value from the array
        return urls[Math.floor(Math.random() * urls.length)];
    },
    getNFTLevels() {
        let url = this.$api.nft.getNFTLevel;
        get(url)
            .then((res) => {
                if (res.code === 200) {
                    this.getNFTLevelList = res.data.records;
                }
            })
            .catch((error) => {});
    },
    pass(data) {
        this.orderColumn = data.orderColumn;
        this.orderType = data.orderType;
        this.nftList = [];
        this.currentPage = 1;
        this.getData();
    },
    getData() {
        if (this.currentPage < 2) {
            this.overlayshow = true;
        }
        let url = this.$api.nft.getNFTPage;
        let data = {
            current: this.currentPage,
            size: this.pageSize,
            orderColumn: this.orderColumn,
            orderType: this.orderType,
            pickStatus: 1,
            pageType: this.pageType,
            // level:0,
            // match:1,
            // price:2,
            // likes:3,
            // listTime:4
        };
        get(url, data)
            .then((res) => {
                const { data, code } = res;
                if (data.total === 0) {
                    this.showBackground = true;
                }
                if (code === 200 && data.records && data.records.length > 0) {
                    if (this.orderColumn == 4) {
                        let randomNftList = data.records;
                        this.shuffleArray(randomNftList);
                        this.nftList = this.nftList.concat(randomNftList);
                    } else {
                        this.nftList = this.nftList.concat(data.records);
                    }
                    // 加载状态结束
                    this.loading = false;
                    // 数据全部加载完成
                    if (this.nftList.length >= data.total) {
                        this.finished = true;
                    }
                } else {
                    // 加载状态结束
                    this.loading = false;
                }
            })
            .catch((error) => {})
            .finally(() => {
                this.overlayshow = false;
            });
    },
    shuffleArray(array) {
        // 随机排序数组
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    },
    onLoad() {
        this.currentPage++; // 更新页数
        this.getData();
    },
    onActivityLoad(){
        this.currentPage++; // 更新页数
        this.getActivityData();
    },
    getSoulSbtiStyle(soul) {
        const soulLength = String(soul).length;
        const k = 0.0052;
        return { fontSize: `${(375 / soulLength) * k}rem` };
    },
};
