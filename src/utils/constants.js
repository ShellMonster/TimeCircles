/**
 * 时间轮盘的常量配置文件
 * 定义了所有圆圈的半径、数据个数、文字样式等
 */

// 各层圆圈的半径（从中心向外递增）
// 自适应半径计算：根据刻度数量和层级动态调整
// 公式：radius = 60 + (count / 60) * 120 + layerIndex * 70
// 这样刻度少的圆更小（月12个），刻度多的圆更大（分60个）
export const RADII = {
  month: 60,       // 月圈半径
  day: 130,        // 日圈半径
  week: 190,       // 星期圈半径（日期和小时之间）
  hour: 250,       // 小时圈半径
  minute: 320,     // 分钟圈半径
  second: 400      // 秒圈半径
};

// 各层的数据个数和中文显示
export const COUNTS = {
  month: 12,       // 1-12月
  day: 31,         // 1-31日（需根据实际月份调整）
  week: 7,         // 0-6星期（周日-周六）
  hour: 24,        // 0-23时
  minute: 60,      // 0-59分
  second: 60       // 0-59秒
};

// 月份中文名称
export const MONTH_NAMES = [
  '一月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '十一月', '十二月'
];

// 星期中文名称
export const WEEK_NAMES = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

// 时间圈的顺序和显示参数
export const LAYERS = [
  { key: 'month', radius: RADII.month, count: COUNTS.month, format: formatMonth },
  { key: 'day', radius: RADII.day, count: COUNTS.day, format: formatDay },
  { key: 'week', radius: RADII.week, count: COUNTS.week, format: formatWeek },
  { key: 'hour', radius: RADII.hour, count: COUNTS.hour, format: formatHour },
  { key: 'minute', radius: RADII.minute, count: COUNTS.minute, format: formatMinute },
  { key: 'second', radius: RADII.second, count: COUNTS.second, format: formatSecond }
];

// 文字样式配置
export const TEXT_CONFIG = {
  fontSize: 16,                   // 文字大小
  fontFamily: '"Helvetica Neue", "Arial", sans-serif',  // 清晰的现代无衬线字体
  fontWeight: '400',              // 正常粗细
  fillColor: '#ffffff',           // 普通文字颜色（白色）
  // 高亮文字配置 - 采用青蓝色科技感（降低亮度）
  highlightColor: '#00a8d8',      // 高亮文字颜色（柔和青蓝色）
  highlightColorGlow: '#006699',  // 高亮发光颜色（深青蓝色）
  shadowBlur: 20                  // 发光模糊度
};

// 参考线配置
export const REFERENCE_LINE_CONFIG = {
  color: '#00ff00',
  width: 2,
  length: 400  // 参考线长度（从中心向右）
};

// 中心点配置
export const CENTER_CONFIG = {
  radius: 8,
  color: '#00ff00'
};

// Canvas背景色
export const BACKGROUND_COLOR = '#000000';

/**
 * 格式化月份
 * @param {number} month - 月份索引（0-11）
 * @returns {string}
 */
function formatMonth(month) {
  return MONTH_NAMES[month];
}

/**
 * 格式化日期
 * @param {number} day - 日期（1-31）
 * @returns {string}
 */
function formatDay(day) {
  const chineseNumbers = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十',
    '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
    '二十一', '二十二', '二十三', '二十四', '二十五', '二十六', '二十七', '二十八', '二十九', '三十', '三十一'];
  return chineseNumbers[day] + '日';
}

/**
 * 格式化星期
 * @param {number} week - 星期（0-6，周日-周六）
 * @returns {string}
 */
function formatWeek(week) {
  return WEEK_NAMES[week];
}

/**
 * 格式化小时
 * @param {number} hour - 小时（0-23）
 * @returns {string}
 */
function formatHour(hour) {
  const chineseNumbers = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十',
    '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
    '二十一', '二十二', '二十三'];
  return chineseNumbers[hour] + '点';
}

/**
 * 格式化分钟（全中文显示）
 * @param {number} minute - 分钟（0-59）
 * @returns {string}
 */
function formatMinute(minute) {
  const chineseNumbers = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十',
    '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
    '二十一', '二十二', '二十三', '二十四', '二十五', '二十六', '二十七', '二十八', '二十九', '三十',
    '三十一', '三十二', '三十三', '三十四', '三十五', '三十六', '三十七', '三十八', '三十九', '四十',
    '四十一', '四十二', '四十三', '四十四', '四十五', '四十六', '四十七', '四十八', '四十九', '五十',
    '五十一', '五十二', '五十三', '五十四', '五十五', '五十六', '五十七', '五十八', '五十九'];
  return chineseNumbers[minute] + '分';
}

/**
 * 格式化秒数（全中文显示）
 * @param {number} second - 秒数（0-59）
 * @returns {string}
 */
function formatSecond(second) {
  const chineseNumbers = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十',
    '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
    '二十一', '二十二', '二十三', '二十四', '二十五', '二十六', '二十七', '二十八', '二十九', '三十',
    '三十一', '三十二', '三十三', '三十四', '三十五', '三十六', '三十七', '三十八', '三十九', '四十',
    '四十一', '四十二', '四十三', '四十四', '四十五', '四十六', '四十七', '四十八', '四十九', '五十',
    '五十一', '五十二', '五十三', '五十四', '五十五', '五十六', '五十七', '五十八', '五十九'];
  return chineseNumbers[second] + '秒';
}

// 导出所有常量
export default {
  RADII,
  COUNTS,
  LAYERS,
  TEXT_CONFIG,
  REFERENCE_LINE_CONFIG,
  CENTER_CONFIG,
  BACKGROUND_COLOR
};
