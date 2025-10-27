/**
 * Canvas绘制工具类
 * 负责所有的Canvas绘制操作，包括圆圈、文字、高亮等
 *
 * 核心设计：轮盘上的文字会随着轮盘转动而旋转
 * 当文字转到参考线（水平）位置时，该文字代表当前时间值
 */

import { RADII, COUNTS, LAYERS, TEXT_CONFIG, REFERENCE_LINE_CONFIG, CENTER_CONFIG, BACKGROUND_COLOR, getScaledConfig } from './constants.js';
import TimeCalculator from './TimeCalculator.js';

class CanvasRenderer {
  // 参考线角度（0 = 右侧水平）
  static REFERENCE_ANGLE = 0;

  // 角度容差（用于判断是否在参考线上）
  // 值越小，高亮越精确。3° 约等于一个时间单位的范围
  static HIGHLIGHT_TOLERANCE = 3;

  /**
   * 主绘制函数 - 绘制完整的时间轮盘
   * @param {CanvasRenderingContext2D} ctx - Canvas 2D 上下文
   * @param {number} width - Canvas 宽度
   * @param {number} height - Canvas 高度
   * @param {Object} rotations - 各层的旋转角度
   * @param {Date} currentTime - 当前时间
   * @param {number} scale - 缩放因子（用于响应式适配）
   */
  static drawTimeWheel(ctx, width, height, rotations, currentTime, scale = 1) {
    // 根据缩放因子获取缩放后的配置
    const config = getScaledConfig(scale);

    const centerX = width / 2;
    const centerY = height / 2;

    // 清空画布
    this.clearCanvas(ctx, width, height);

    // 绘制所有圆圈层（从外到内，保证顺序）
    config.LAYERS.forEach(layer => {
      this.drawLayer(ctx, centerX, centerY, layer, rotations[layer.key], config);
    });

    // 参考横线和中心点已移除（2025-10-24）
    // 高亮效果已通过轮廓光实现，无需可视化的参考线
  }

  /**
   * 清空Canvas画布
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} width
   * @param {number} height
   */
  static clearCanvas(ctx, width, height) {
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, width, height);
  }

  /**
   * 绘制一层圆圈及其文字
   *
   * 核心逻辑：
   * 1. 计算文字在圆周上的角度（基于索引）
   * 2. 加上轮盘旋转角度，得到最终角度
   * 3. 根据最终角度计算屏幕坐标
   * 4. 文字会沿着这个角度旋转显示（像转动的轮盘）
   * 5. 当文字角度接近0°（参考线）时，高亮显示
   *
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} centerX - 中心X坐标
   * @param {number} centerY - 中心Y坐标
   * @param {Object} layer - 圆圈配置（已缩放）
   * @param {number} rotation - 该层的旋转角度（度数）
   * @param {Object} config - 缩放后的完整配置（包含TEXT_CONFIG等）
   */
  static drawLayer(ctx, centerX, centerY, layer, rotation, config) {
    // 将旋转角度转为弧度
    const rotationRad = TimeCalculator.degreesToRadians(rotation);

    // 绘制该层的所有文字
    for (let i = 0; i < layer.count; i++) {
      // 计算该项目基础角度（0-360°均匀分布）
      const baseAngle = (i / layer.count) * 360;
      const baseAngleRad = TimeCalculator.degreesToRadians(baseAngle);

      // 计算旋转后的最终角度（轮盘转动后文字的实际角度）
      const finalAngleRad = baseAngleRad + rotationRad;

      // 计算文字在屏幕上的位置坐标
      const x = centerX + layer.radius * Math.cos(finalAngleRad);
      const y = centerY + layer.radius * Math.sin(finalAngleRad);

      // 获取文字内容
      const text = layer.format(i);

      // 【关键】判断是否在参考线上（用于高亮）
      // 参考线在0°（右侧水平），当文字角度接近0°时高亮
      const normalizedAngle = TimeCalculator.normalizeAngle(
        TimeCalculator.radiansToDegrees(finalAngleRad)
      );
      const isOnReferenceLine =
        normalizedAngle < this.HIGHLIGHT_TOLERANCE ||
        normalizedAngle > (360 - this.HIGHLIGHT_TOLERANCE);

      // 绘制文字（传递最终角度，使文字随轮盘转动）
      this.drawText(ctx, text, x, y, finalAngleRad, isOnReferenceLine, config.TEXT_CONFIG);
    }
  }

  /**
   * 绘制文字
   *
   * 关键特性：
   * - 文字会根据 angleRad 旋转显示
   * - 当角度为0（参考线）时，文字显示为水平
   * - 当角度不为0时，文字倾斜显示（模拟真实转动）
   * - 高亮时显示青蓝色发光效果
   *
   * @param {CanvasRenderingContext2D} ctx
   * @param {string} text - 要绘制的文字
   * @param {number} x - X坐标
   * @param {number} y - Y坐标
   * @param {number} angleRad - 文字的旋转角度（弧度）
   * @param {boolean} isHighlighted - 是否在参考线上（高亮）
   * @param {Object} textConfig - 文字样式配置（已缩放）
   */
  static drawText(ctx, text, x, y, angleRad, isHighlighted, textConfig) {
    // 保存Canvas状态，便于恢复
    ctx.save();

    // 移动坐标原点到文字位置
    ctx.translate(x, y);

    // 【关键】根据最终角度旋转文字
    // 这样文字会随着轮盘转动而旋转显示
    // 当angleRad=0时，文字水平显示
    ctx.rotate(angleRad);

    // 设置文字样式（包括字体加粗）
    ctx.font = `${textConfig.fontWeight} ${textConfig.fontSize}px ${textConfig.fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (isHighlighted) {
      // 高亮状态：青蓝色圆形背光，白色文字

      // 【第一层】最外层大背光（模拟圆形光源）
      ctx.shadowColor = textConfig.highlightColorGlow;
      ctx.shadowBlur = 35 * (textConfig.fontSize / 16);  // 根据字体大小比例调整
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = textConfig.highlightColor;
      ctx.fillText(text, 0, 0);

      // 【第二层】中层背光
      ctx.shadowColor = textConfig.highlightColor;
      ctx.shadowBlur = 25 * (textConfig.fontSize / 16);
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = textConfig.highlightColor;
      ctx.fillText(text, 0, 0);

      // 【第三层】轮廓描边（青蓝色背景）
      ctx.shadowBlur = 0;
      ctx.lineWidth = 3 * (textConfig.fontSize / 16);
      ctx.strokeStyle = textConfig.highlightColor;
      ctx.globalAlpha = 1;
      ctx.strokeText(text, 0, 0);

      // 【第四层】清晰的核心（白色文字）
      ctx.shadowBlur = 12 * (textConfig.fontSize / 16);
      ctx.shadowColor = textConfig.highlightColor;
      ctx.fillStyle = textConfig.fillColor;  // 白色文字
      ctx.globalAlpha = 1;
      ctx.fillText(text, 0, 0);
    } else {
      // 普通状态：白色（清晰显示）
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.lineWidth = 0;
      ctx.fillStyle = textConfig.fillColor;
      ctx.globalAlpha = 1;
      ctx.fillText(text, 0, 0);
    }

    // 恢复Canvas状态并清除shadow
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  /**
   * 绘制参考线和中心点
   *
   * 参考线：
   * - 从中心向右的绿色横线
   * - 文字转到这条线上时会水平显示
   * - 在这个位置的文字代表当前时间值
   *
   * 中心点：
   * - 参考线的起点
   * - 所有同心圆的中心
   *
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} centerX - 中心X坐标
   * @param {number} centerY - 中心Y坐标
   */
  static drawReferenceLines(ctx, centerX, centerY) {
    // 设置参考线样式
    ctx.strokeStyle = REFERENCE_LINE_CONFIG.color;
    ctx.lineWidth = REFERENCE_LINE_CONFIG.width;

    // 绘制从中心向右的参考横线
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + REFERENCE_LINE_CONFIG.length, centerY);
    ctx.stroke();

    // 绘制从中心向左的参考横线（对称美观）
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX - 50, centerY);
    ctx.stroke();

    // 绘制中心点
    ctx.fillStyle = CENTER_CONFIG.color;
    ctx.beginPath();
    ctx.arc(centerX, centerY, CENTER_CONFIG.radius, 0, 2 * Math.PI);
    ctx.fill();
  }

  /**
   * 绘制中心点（保留以维持兼容性）
   * @deprecated 现已集成到 drawReferenceLines 中
   */
  static drawCenterDot(ctx, centerX, centerY) {
    // 此方法已合并到 drawReferenceLines，保留此处以防兼容性需求
  }

}

export default CanvasRenderer;
