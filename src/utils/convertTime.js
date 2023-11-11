import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import { formatTimeToMinute, formatTimeTo } from "./format.js";
// 启用插件
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime); // 相对时间
dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "a few seconds",
    m: "1 minute",
    mm: "%d minutes",
    h: "1 hour",
    hh: "%d hours",
    d: "1 day",
    dd: "%d days",
    M: "1 month",
    MM: "%d months",
    y: "1 year",
    yy: "%d years",
  },
});

export function getTimeDescription(time) {
  const currentTime = new Date(); // 当前时间
  const diff = Math.abs(currentTime - new Date(time)); // 计算时间差，单位为毫秒

  // 时间描述
  let description = "";
  if (diff < 60000) {
    // 小于1分钟
    description = "1 min";
  } else if (diff < 3600000) {
    // 1分钟至1小时
    const minutes = Math.floor(diff / 60000); // 计算分钟数
    description = `${minutes} ${minutes === 1 ? "min" : "mins"}`;
  } else if (diff < 86400000) {
    // 1小时至1天
    const hours = Math.floor(diff / 3600000); // 计算小时数
    description = `${hours} ${hours === 1 ? "hour" : "hours"}`;
  } else if (diff < 2592000000) {
    // 1天至30天
    const days = Math.floor(diff / 86400000); // 计算天数
    description = `${days} ${days === 1 ? "day" : "days"}`;
  } else {
    // 超过30天
    const formattedDate = new Date(time).toISOString().split("T")[0]; // 格式化日期为 YYYY-MM-DD
    description = formattedDate;
  }
  return description;
}

// 聊天记录时间展示逻辑
export const getTimeDiffText = (time1, time2) => {
  const diffInMinutes = Math.abs(
    (time1.getTime() - time2.getTime()) / (1000 * 60)
  );
  // 转秒时间戳
  const tt = +new Date(time1) / 1000;
  if (diffInMinutes < 5) {
    return false;
  } else if (isToday(time1)) {
    return formatTimeToMinute(tt);
  } else if (isYesterday(time1)) {
    return "Yesterday " + formatTimeToMinute(tt);
  } else if (isWithinAWeek(time1)) {
    return getWeekdayName(time1) + " " + formatTimeToMinute(tt);
  } else {
    return formatTimeTo(tt);
  }
};

function isToday(date) {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

function isYesterday(date) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
}

function isWithinAWeek(date) {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  return date >= oneWeekAgo;
}

function getWeekdayName(date) {
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return weekdays[date.getDay()];
}

// 封装时区转换函数
export function convertToTargetTimeZone(initialTime) {
  const initialTimeZone = "Asia/Shanghai"; // 初始地区
  const curZone = window.localStorage.getItem("timezone");
  const userTimeZone =
    curZone || Intl.DateTimeFormat().resolvedOptions().timeZone; // 目标地区

  const initTime = dayjs.tz(initialTime, initialTimeZone);

  const targetTime = initTime
    .clone()
    .tz(userTimeZone)
    .format("YYYY-MM-DD HH:mm:ss");

  return targetTime;
}

export function getLastTimeStr(time) {
  const targetDate = dayjs(time);
  const transformDate = convertToTargetTimeZone(dayjs());
  const currentDate = dayjs(transformDate);
  const daysDifference = currentDate.diff(targetDate, "day");
  if (daysDifference > 30) {
    return dayjs(new Date(time)).format("YYYY-MM-DD");
  } else {
    return dayjs(time).from(currentDate);
  }
}
