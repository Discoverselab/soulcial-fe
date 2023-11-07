import { formatTimeToDateMinute } from "./format";
/**
 * 解析地址览参数
 * @param {*} urlStr url字符串
 * @param {*} key 需要获取的参数
 * @returns
 */
export function analysisUrl(urlStr, key) {
  const url = new URL(urlStr); // 字符串转换成url格式
  const paramsStr = url.search.slice(1); // 获取'?'后面的参数字符串
  const paramsArr = paramsStr.split("&"); // 分割'&'字符 获得参数数组
  for (let i = 0; i < paramsArr.length; i++) {
    const tempArr = paramsArr[i].split("=");
    if (tempArr[0] === key) {
      return tempArr[1];
    }
  }
}

/**
 * 枚举转成数组
 * @param {String} map
 */
export function transferArray(map = {}, key = "key", name = "name") {
  const keys = typeof map === "object" && Object.keys(map);
  if (!keys) {
    return [];
  }
  let values = [];
  keys.forEach((k) => {
    const obj = {};
    obj[key] = map[k].code;
    obj[name] = map[k].desc;
    values.push(obj);
  });
  return values;
}

// 姓名脱敏
export function noPassByName(str) {
  if (null !== str && str !== undefined) {
    if (str.length === 2) {
      return str.substring(0, 1) + "*"; //截取name 字符串截取第一个字符，
    } else if (str.length === 3) {
      return str.substring(0, 1) + "*" + str.substring(2, 3); //截取第一个和第三个字符
    } else if (str.length > 3) {
      return (
        str.substring(0, 1) + "*" + "*" + str.substring(3, str.length)
      ); //截取第一个和大于第4个字符
    }
  } else {
    return "";
  }
}

// 手机号脱敏
export function noPassByPhone(str) {
  if (null !== str && str !== undefined) {
    return (
      String(str).substring(0, 3) +
      "****" +
      String(str).substring(String(str).length - 4)
    );
  }
  return "";
}

/**
 * 获取几天后的日期时间
 * @param {*} day 天数
 * @param {*} date 特定日期
 * @returns
 */
export function getDay(day, date) {
  let today = date ? new Date(date.replace(/-/g, "/")) : new Date();
  let targetdayMilliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
  today.setTime(targetdayMilliseconds / 1000);
  return formatTimeToDateMinute(+new Date(today));
}

/* ===  公共方法：常用业务类  === */

/**
 * 判断是否空数组
 * @param {*} arr
 */
export const isEmptyArray = (arr) => {
  if (arr instanceof Array && arr.length > 0) {
    return false;
  }
  return true;
};

/**
 * 隐藏手机号码
 * @param {String} phone
 *  */
export const formatHiddenPhoneNumber = (phone) => {
  if (typeof phone === "string" || typeof phone === "number") {
    const head = phone.slice(0, 3);
    const btm = phone.slice(phone.length - 4, phone.length);
    return `${head}****${btm}`;
  }
  return "";
};

/**
 * 判断是否运行在支付宝小程序
 * @return {Boolean}
 *  */
export const isAliMiniApp = () => {
  return window.navigator.userAgent.toLowerCase().indexOf("aliapp") > -1;
};

/**
 * 判断是否运行在安卓手机
 * @return {Boolean}
 *  */
export const isAndroidClient = () => {
  return window.navigator.userAgent.toLowerCase().indexOf("android") > -1;
};

/**
 * 判断是否运行在iOS手机
 * @return {Boolean}
 *  */
export const isIOSClient = () => {
  return window.navigator.userAgent.toLowerCase().indexOf("iphone") > -1;
};

// 获取数值对应的百分比宽度
export function getWidth(num, tNum) {
  const newN = Number(num);
  const newTNum = Number(tNum);
  if (isNaN(newN) || isNaN(newTNum) || !newTNum) {
    return "0%";
  }
  if (newN === newTNum) {
    return "100%";
  }
  const percent = parseFloat((newN / newTNum) * 100);
  if (percent >= 100) {
    return "100%";
  }
  return `${percent.toFixed(2)}%`;
}

/**
 * 根据可访问url下载
 *  */
export const downloadFileByUrl = (url, newFileName) => {
  getBlob(url).then((res) => {
    saveFile(res, newFileName);
  });
};

// 请求文件url，获取二进制流
export const getBlob = (url) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.response);
      } else {
        reject("error");
      }
    };
    xhr.send();
  });
};

// 根据二进制流，保存文件
export const saveFile = (blob, filename) => {
  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob, filename);
  } else {
    const anchor = document.createElement("a");
    const body = document.querySelector("body");
    anchor.href = window.URL.createObjectURL(blob);
    anchor.download = filename;
    anchor.style.display = "none";
    body.appendChild(anchor);
    anchor.click();
    body.removeChild(anchor);
    window.URL.revokeObjectURL(anchor.href);
  }
};

// 处理不同长度字符的字体大小
export const getSoulSbtiStyle = (soul, num) => {
  const soulLength = String(soul).length;
  const k = 0.0052;
  return { fontSize: `${(num / soulLength) * k}rem` };
};
