/**
 * 时间计算工具类
 * 根据当前时间计算每一层圆圈的旋转角度
 */

import { COUNTS } from './constants.js';

class TimeCalculator {
  /**
   * 计算各圈的旋转角度
   * 使得当前时间对齐到参考线（中心向右，0°方向）
   * @param {Date} date - 当前时间对象
   * @returns {Object} 包含每一层的旋转角度
   */
  static calculateRotations(date) {
    // 获取时间信息
    const month = date.getMonth();              // 0-11
    const day = date.getDate();                 // 1-31
    const week = date.getDay();                 // 0-6（周日-周六）
    const hour = date.getHours();               // 0-23
    const minute = date.getMinutes();           // 0-59
    const second = date.getSeconds();           // 0-59
    const millisecond = date.getMilliseconds(); // 毫秒

    // 计算每一层需要旋转的角度（逆时针，所以为负值）
    // 旋转角度 = -(当前索引 / 总个数) × 360°

    return {
      // 月圈：根据月份（0-11）计算旋转角度
      month: -(month / COUNTS.month) * 360,

      // 日圈：根据日期（1-31）计算旋转角度，需要减1转换为0-30
      day: -((day - 1) / COUNTS.day) * 360,

      // 星期圈：根据星期（0-6）计算旋转角度
      week: -(week / COUNTS.week) * 360,

      // 小时圈：根据小时（0-23）计算旋转角度
      hour: -(hour / COUNTS.hour) * 360,

      // 分钟圈：根据分钟（0-59）计算旋转角度
      minute: -(minute / COUNTS.minute) * 360,

      // 秒圈：根据秒数（0-59）计算旋转角度
      // 基于整秒，每秒转一次（具体动画过程由TimeWheel的Tween动画处理）
      second: -(second / COUNTS.second) * 360
    };
  }

  /**
   * 将角度转换为弧度
   * @param {number} degrees - 角度
   * @returns {number} 弧度
   */
  static degreesToRadians(degrees) {
    return (degrees * Math.PI) / 180;
  }

  /**
   * 将弧度转换为角度
   * @param {number} radians - 弧度
   * @returns {number} 角度
   */
  static radiansToDegrees(radians) {
    return (radians * 180) / Math.PI;
  }

  /**
   * 正规化角度到 0-360 范围
   * @param {number} angle - 角度（可以是任意值）
   * @returns {number} 0-360 范围内的角度
   */
  static normalizeAngle(angle) {
    let normalized = angle % 360;
    if (normalized < 0) {
      normalized += 360;
    }
    return normalized;
  }

  /**
   * 检查一个角度是否在参考线位置（0°附近）
   * @param {number} angle - 角度（度数）
   * @param {number} tolerance - 容差范围（默认5度）
   * @returns {boolean}
   */
  static isOnReferenceLine(angle, tolerance = 5) {
    const normalized = this.normalizeAngle(angle);
    return normalized < tolerance || normalized > (360 - tolerance);
  }

  /**
   * 根据当前时间和旋转角度，计算文字应该显示在参考线上方、中间还是下方
   * @param {number} itemIndex - 项目索引（0, 1, 2, ...）
   * @param {number} totalCount - 总项目数
   * @param {number} rotation - 旋转角度
   * @returns {string} 'above'（上方）、'center'（中间）或 'below'（下方）
   */
  static getPositionRelativeToReferenceLine(itemIndex, totalCount, rotation) {
    // 计算该项目的角度
    const itemAngle = (itemIndex / totalCount) * 360;

    // 考虑旋转后的实际角度
    const actualAngle = this.normalizeAngle(itemAngle + rotation);

    // 参考线在0°位置
    // 上方：180-360° 区间（实际上是顶部附近）
    // 中间：±5° 范围
    // 下方：0-180° 区间（实际上是底部附近）

    if (actualAngle > 180) {
      return 'above';
    } else if (actualAngle < 180) {
      return 'below';
    } else {
      return 'center';
    }
  }
}

export default TimeCalculator;
