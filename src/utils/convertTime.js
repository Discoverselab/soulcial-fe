import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
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
        m: "a minute",
        mm: "%d minutes",
        h: "an hour",
        hh: "%d hours",
        d: "a day",
        dd: "%d days",
        M: "a month",
        MM: "%d months",
        y: "a year",
        yy: "%d years",
    },
});

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
    const currentDate = dayjs(transformDate)
    const daysDifference = currentDate.diff(targetDate, "day");
    if (daysDifference > 30) {
        return dayjs(new Date(time)).format("YYYY-MM-DD");
    } else {
        return dayjs(time).from(currentDate);
    }
}
