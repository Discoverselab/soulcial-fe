/* eslint-disable indent */
import dayjs from 'dayjs'

/**
 * 格式化年月日
 * @param {*} val
 */
export function formatTimeToDate(val) {
  return formatTime(val, 'YYYY年MM月DD日')
}

/**
 * 格式化时分秒
 * @param {*} val
 */
export function formatTimeToSecond(val) {
  return formatTime(val, 'HH:mm:ss')
}

/**
 * 格式化月日 时分
 * @param {*} val
 */
export function formatTimeTo(val) {
  return formatTime(val, 'MM-DD HH:mm')
}

/**
 * 格式化年月日 时分
 * @param {*} val
 */
export function formatTimeToDateMinuteSecond(val) {
  return formatTime(val, 'YYYY-MM-DD HH:mm:ss')
}

/**
 * 格式化时分
 * @param {*} val
 */
export function formatTimeToMinute(val) {
  return formatTime(val, 'HH:mm')
}

/**
 * 自定义时间转换
 * @param {*} val
 * @param {*} layout
 * @param {*} defaultPlaceHolder
 */
export function formatTime(val, layout, defaultPlaceHolder = '-') {
  if (!val || val === defaultPlaceHolder) {
    return defaultPlaceHolder
  }
  const m = dayjs.unix(Number(val)) // 时间戳为秒
  return m.isValid() ? m.format(layout) : defaultPlaceHolder
}

/**
 * 格式化数组
 * @param {Array} data
 */
export function formatArray(data, defaultPlaceHolder = '-') {
  const result = data
  if (data && data instanceof Array) {
    data.forEach((value, id) => {
      for (const key in value) {
        if (!key || value[key] === '' || typeof value[key] === 'undefined' || value[key] === null) {
          result[id][key] = defaultPlaceHolder
        }
      }
    })
  }
  return result
}

/**
 * 格式化对象
 * @param {Object} data
 */
export function formatObject(data, defaultPlaceHolder = '-') {
  // 格式化对象
  const result = data
  if (data && data.constructor === Object) {
    for (const key in data) {
      if (!key || data[key] === '' || typeof data[key] === 'undefined' || data[key] === null) {
        result[key] = defaultPlaceHolder
      }
    }
  }
  return result
}

/**
 * 格式化值
 * @param {*} val
 * @param {*} defaultPlaceHolder 默认展示
 */
export function formatVal(val, defaultPlaceHolder = '-') {
  if (val === '' || typeof val === 'undefined' || val === null) {
    return defaultPlaceHolder
  }
  return val
}

/**
 * 最多保留两位小数
 * @param {String} val
 */
export function formatNumStrWithMaxTwoDigit(val) {
  let str = val
  const numI = val.indexOf('.')
  if (numI > -1) {
    const tmp = str.substring(numI)
    const tmpLen = tmp.length > 2 ? 2 : tmp.length
    str = str.substring(0, numI + tmpLen + 1)
  }
  return str
}

/**
 * 强制保留两位小数
 * @param {*} val
 */
export function formatNumStrWithFixTwoDigit(val) {
  let str = val
  if (!str) {
    return str
  }
  const numI = val?.indexOf('.')
  if (numI > -1) {
    const tmp = str.substring(numI)
    for (let i = tmp.length; i < 3; i += 1) {
      str += '0'
    }
  } else {
    str += '.00'
  }
  return str
}

/**
 * 格式化金额（千分位）
 * @param {*} val
 * @param {*} defaultPlaceHolder
 */
export function formatAmount(val, defaultPlaceHolder = '-') {
  if (!val || val === defaultPlaceHolder) {
    return defaultPlaceHolder
  }
  const reg = /(\d{1,3})(?=(?:\d{3})+(?!\d))/g
  return val?.replace(reg, '$1,')
}

/**
 * 只允许输入数值且最多输入两位小数
 * @param {*} e
 */
export function formatFixToNum(e) {
  let { value } = e.target
  // 如果输入非数字，则替换为''
  value = value?.replace(/[^\d.]/g, '')
  // 必须保证第一个为数字而不是.
  value = value?.replace(/^\./g, '')
  // 前两位不能是0加数字
  value = value?.replace(/^0\d[0-9]*/g, '')
  // 保证只有出现一个.而没有多个.
  value = value?.replace(/\.{2,}/g, '.')
  // 保证.只出现一次，而不能出现两次以上
  value = value
    ?.replace('.', '$#$')
    .replace(/\./g, '')
    .replace('$#$', '.')
  // 只能输入两位小数
  value = value?.replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
  return value
}

export function formatDateToString(date) {
  let y = date.getFullYear()
  let m = date.getMonth() + 1
  m = m < 10 ? '0' + m : m
  let d = date.getDate()
  d = d < 10 ? '0' + d : d
  return y + '年' + m + '月' + d + '日'
}

export function parserDate(date) {
  let y = date.split('年')[0]
  let m = date.split('年')[1].split('月')[0]
  let d = date
    .split('年')[1]
    .split('月')[1]
    .split('日')[0]
  return Date.parse(new Date(y, m - 1, d))
}

/**
 * 得到某日最后的时间戳（秒）
 * @param {*} t
 * @param {*} defaultPlaceHolder
 */
export function formatTimeToEndDayUnix(t, defaultPlaceHolder = null) {
  if (!t || t === '-') {
    return defaultPlaceHolder
  }
  const time = dayjs(t)
  // eslint-disable-next-line prettier/prettier
  return time.isValid()
    ? dayjs(time)
        // eslint-disable-next-line indent
        .endOf('day')
        .unix()
    : defaultPlaceHolder
}

export function secondsFormat(value) {
  let theTime = parseInt(value) // 需要转换的时间秒
  let theTime1 = 0 // 分
  let theTime2 = 0 // 小时
  let theTime3 = 0 // 天
  if (theTime >= 60) {
    theTime1 = parseInt(theTime / 60)
    theTime = parseInt(theTime % 60)
    if (theTime1 >= 60) {
      theTime2 = parseInt(theTime1 / 60)
      theTime1 = parseInt(theTime1 % 60)
      if (theTime2 >= 24) {
        // 大于24小时
        theTime3 = parseInt(theTime2 / 24)
        theTime2 = parseInt(theTime2 % 24)
      }
    }
  }
  let result = ''
  if (theTime > 0) {
    result = '' + parseInt(theTime) + '秒'
  }
  if (theTime1 > 0) {
    result = '' + parseInt(theTime1) + '分钟' + result
  }
  if (theTime2 > 0) {
    result = '' + parseInt(theTime2) + '小时' + result
  }
  if (theTime3 > 0) {
    result = '' + parseInt(theTime3) + '天' + result
  }
  return result
}
