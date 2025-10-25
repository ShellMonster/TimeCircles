/**
 * 时间轮盘主组件
 * 整合所有子模块：动画循环、时间获取、旋转角度计算、Canvas绘制
 */

import React, { useRef, useEffect, useState } from 'react';
import useAnimation from '../../hooks/useAnimation';
import useTime from '../../hooks/useTime';
import TimeCalculator from '../../utils/TimeCalculator';
import CanvasRenderer from '../../utils/CanvasRenderer';
import './TimeWheel.css';

/**
 * TimeWheel组件
 * 主要职责：
 * 1. 通过useAnimation Hook获取动画帧时间戳
 * 2. 通过useTime Hook获取当前系统时间
 * 3. 计算各层圆圈的旋转角度
 * 4. 对所有圆圈应用快速Snap动画（使用easing缓动）
 * 5. 使用CanvasRenderer绘制时间轮盘
 */

/**
 * easeInOutCubic 立方缓动函数
 * 模拟真实时钟的自然转动：先加速，再减速，平滑而不生硬
 * @param {number} t - 进度（0-1）
 * @returns {number} 缓动后的进度
 */
function easeInOutCubic(t) {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function TimeWheel() {
  // 引用Canvas DOM元素
  const canvasRef = useRef(null);

  // 所有圆圈的动画状态
  const [secondAnimProgress, setSecondAnimProgress] = useState(0); // 秒圈
  const [minuteAnimProgress, setMinuteAnimProgress] = useState(0); // 分圈
  const [hourAnimProgress, setHourAnimProgress] = useState(0); // 时圈
  const [dayAnimProgress, setDayAnimProgress] = useState(0); // 日圈
  const [weekAnimProgress, setWeekAnimProgress] = useState(0); // 星期圈
  const [monthAnimProgress, setMonthAnimProgress] = useState(0); // 月圈

  const lastSecondRef = useRef(null);
  const lastMinuteRef = useRef(null);
  const lastHourRef = useRef(null);
  const lastDayRef = useRef(null);
  const lastWeekRef = useRef(null);
  const lastMonthRef = useRef(null);

  const secondAnimStartTimeRef = useRef(null);
  const minuteAnimStartTimeRef = useRef(null);
  const hourAnimStartTimeRef = useRef(null);
  const dayAnimStartTimeRef = useRef(null);
  const weekAnimStartTimeRef = useRef(null);
  const monthAnimStartTimeRef = useRef(null);

  // 获取动画帧时间戳（每帧更新）
  const animationTime = useAnimation();

  // 获取当前时间（依赖于animationTime，所以每帧更新）
  const currentTime = useTime(animationTime);

  // 计算所有圆圈的动画进度
  useEffect(() => {
    const currentSecond = currentTime.getSeconds();
    const currentMinute = currentTime.getMinutes();
    const currentHour = currentTime.getHours();
    const currentDay = currentTime.getDate();
    const currentMonth = currentTime.getMonth();
    const currentWeek = currentTime.getDay();  // 0=周日, 1=周一, ...6=周六

    // 检测值变化，启动动画
    if (lastSecondRef.current !== currentSecond) {
      lastSecondRef.current = currentSecond;
      secondAnimStartTimeRef.current = animationTime;
      setSecondAnimProgress(0);
    }
    if (lastMinuteRef.current !== currentMinute) {
      lastMinuteRef.current = currentMinute;
      minuteAnimStartTimeRef.current = animationTime;
      setMinuteAnimProgress(0);
    }
    if (lastHourRef.current !== currentHour) {
      lastHourRef.current = currentHour;
      hourAnimStartTimeRef.current = animationTime;
      setHourAnimProgress(0);
    }
    if (lastDayRef.current !== currentDay) {
      lastDayRef.current = currentDay;
      dayAnimStartTimeRef.current = animationTime;
      setDayAnimProgress(0);
    }
    if (lastWeekRef.current !== currentWeek) {
      lastWeekRef.current = currentWeek;
      weekAnimStartTimeRef.current = animationTime;
      setWeekAnimProgress(0);
    }
    if (lastMonthRef.current !== currentMonth) {
      lastMonthRef.current = currentMonth;
      monthAnimStartTimeRef.current = animationTime;
      setMonthAnimProgress(0);
    }

    // 计算各圆圈的动画进度（使用立方缓动，平滑自然的转动感）
    // 动画时间设为200ms，配合easeInOutCubic产生平滑流畅的效果
    const ANIMATION_DURATION = 200;  // 毫秒

    if (secondAnimStartTimeRef.current !== null) {
      const elapsed = animationTime - secondAnimStartTimeRef.current;
      const rawProgress = Math.min(elapsed / ANIMATION_DURATION, 1);
      setSecondAnimProgress(easeInOutCubic(rawProgress));
    }
    if (minuteAnimStartTimeRef.current !== null) {
      const elapsed = animationTime - minuteAnimStartTimeRef.current;
      const rawProgress = Math.min(elapsed / ANIMATION_DURATION, 1);
      setMinuteAnimProgress(easeInOutCubic(rawProgress));
    }
    if (hourAnimStartTimeRef.current !== null) {
      const elapsed = animationTime - hourAnimStartTimeRef.current;
      const rawProgress = Math.min(elapsed / ANIMATION_DURATION, 1);
      setHourAnimProgress(easeInOutCubic(rawProgress));
    }
    if (dayAnimStartTimeRef.current !== null) {
      const elapsed = animationTime - dayAnimStartTimeRef.current;
      const rawProgress = Math.min(elapsed / ANIMATION_DURATION, 1);
      setDayAnimProgress(easeInOutCubic(rawProgress));
    }
    if (weekAnimStartTimeRef.current !== null) {
      const elapsed = animationTime - weekAnimStartTimeRef.current;
      const rawProgress = Math.min(elapsed / ANIMATION_DURATION, 1);
      setWeekAnimProgress(easeInOutCubic(rawProgress));
    }
    if (monthAnimStartTimeRef.current !== null) {
      const elapsed = animationTime - monthAnimStartTimeRef.current;
      const rawProgress = Math.min(elapsed / ANIMATION_DURATION, 1);
      setMonthAnimProgress(easeInOutCubic(rawProgress));
    }
  }, [animationTime, currentTime]);

  // 当时间变化时，重新绘制Canvas
  useEffect(() => {
    // 获取Canvas元素和2D上下文
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // 获取设备像素比，支持高分屏
    const devicePixelRatio = window.devicePixelRatio || 1;

    // 设置Canvas尺寸为窗口大小 × 设备像素比（保证高分屏清晰）
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    // 缩放Canvas绘图上下文，适应高分屏
    ctx.scale(devicePixelRatio, devicePixelRatio);

    // 改进文字渲染质量
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.textRendering = 'optimizeLegibility';

    // 计算各层圆圈的旋转角度
    const rotations = TimeCalculator.calculateRotations(currentTime);

    // 【关键】对所有圆圈应用Tween动画（都有咔一下的感觉）
    const currentSecond = currentTime.getSeconds();
    const currentMinute = currentTime.getMinutes();
    const currentHour = currentTime.getHours();
    const currentDay = currentTime.getDate();
    const currentMonth = currentTime.getMonth();
    const currentWeek = currentTime.getDay();  // 前面已在动画检测useEffect中定义过，这里再次定义以确保一致

    const prevSecond = (currentSecond - 1 + 60) % 60;
    const prevMinute = (currentMinute - 1 + 60) % 60;
    const prevHour = (currentHour - 1 + 24) % 24;
    const prevDay = currentDay === 1 ? 31 : (currentDay - 1); // 简化处理
    const prevMonth = (currentMonth - 1 + 12) % 12;
    const prevWeek = (currentWeek - 1 + 7) % 7;  // 星期也是循环的

    // 辅助函数：计算角度动画
    const calcAngleAnim = (current, prev, count, progress) => {
      const currentAngle = -(current / count) * 360;
      const prevAngle = -(prev / count) * 360;
      let delta = currentAngle - prevAngle;
      if (delta < -180) delta += 360;
      else if (delta > 180) delta -= 360;
      return prevAngle + delta * progress;
    };

    // 应用所有圆圈的动画
    rotations.second = calcAngleAnim(currentSecond, prevSecond, 60, secondAnimProgress);
    rotations.minute = calcAngleAnim(currentMinute, prevMinute, 60, minuteAnimProgress);
    rotations.hour = calcAngleAnim(currentHour, prevHour, 24, hourAnimProgress);
    rotations.day = calcAngleAnim(currentDay - 1, prevDay - 1, 31, dayAnimProgress); // 日期从1-31，转为0-30
    rotations.week = calcAngleAnim(currentWeek, prevWeek, 7, weekAnimProgress);
    rotations.month = calcAngleAnim(currentMonth, prevMonth, 12, monthAnimProgress);

    // 绘制时间轮盘（使用逻辑尺寸，而不是物理尺寸）
    CanvasRenderer.drawTimeWheel(ctx, width, height, rotations, currentTime);
  }, [currentTime, secondAnimProgress, minuteAnimProgress, hourAnimProgress, dayAnimProgress, weekAnimProgress, monthAnimProgress]); // 当时间或动画进度变化时重新绘制

  // 处理窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      // 触发重新绘制（通过依赖项的变化）
      // 这里我们可以手动触发重绘，但由于useAnimation已经在持续更新，
      // Canvas会自动调整大小
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="time-wheel-container">
      <canvas
        ref={canvasRef}
        className="time-wheel-canvas"
        style={{
          display: 'block',
          width: '100vw',
          height: '100vh'
        }}
      />
    </div>
  );
}

export default TimeWheel;
