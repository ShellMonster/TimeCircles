/**
 * 时间获取Hook
 * 获取实时系统时间，并在动画帧更新时同步更新
 */

import { useEffect, useState } from 'react';

/**
 * 用于获取当前系统时间
 * @param {number} animationTime - 来自useAnimation Hook的时间戳（用于驱动更新）
 * @returns {Date} 当前时间的Date对象
 */
export function useTime(animationTime) {
  // 存储当前时间
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // 每当animationTime变化时（每帧），更新currentTime
    // 这样可以确保时间始终和动画循环同步
    setCurrentTime(new Date());
  }, [animationTime]); // 依赖于animationTime，每帧更新

  return currentTime;
}

export default useTime;
