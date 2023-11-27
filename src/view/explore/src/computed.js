/* Calculation cache
matters need attention
1. The method dependency attribute defined here has not changed, and the previous cache is returned every time.
2. It cannot be defined by () = > {} arrow function
*/
// import ajax from "ajax";
import { convertToTargetTimeZone,getLastTimeStr } from "@/utils/convertTime";
import {formatFiveNumber} from "@/libs/common.js"
export default {
    oddNftList() {
        // 使用计算属性来筛选 nftList
        return this.nftList.filter((nft,index) => {
          
          return index % 2 == 1; 
        });
      },
      evenNftList() {
        // 使用计算属性来筛选 nftList
        return this.nftList.filter((nft,index) => {
          
          return index % 2 == 0; 
        });
      },
      convertToTargetTimeZone() {
        return convertToTargetTimeZone;
      },
      getLastTimeStr(){
        return getLastTimeStr
      },
      formatFiveNumber(){
        return formatFiveNumber
      }
};