/**
 * 动画循环Hook
 * 管理requestAnimationFrame动画循环的生命周期
 */

import { useEffect, useRef, useState } from 'react';

/**
 * 用于管理动画循环
 * 每帧（60fps）触发一次更新
 * @returns {number} 当前时间戳（用于驱动动画）
 */
export function useAnimation() {
  // 存储当前的动画时间戳
  const [animationTime, setAnimationTime] = useState(0);

  // 存储requestAnimationFrame的ID，用于清理
  const animationIdRef = useRef(null);

  useEffect(() => {
    /**
     * 动画帧回调函数
     * 每帧调用一次，更新时间戳来驱动组件重新渲染
     */
    const animate = () => {
      // 更新时间戳，触发组件重新渲染
      setAnimationTime(Date.now());

      // 继续下一帧的动画循环
      animationIdRef.current = requestAnimationFrame(animate);
    };

    // 启动动画循环
    animationIdRef.current = requestAnimationFrame(animate);

    // 清理函数：卸载时停止动画循环
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []); // 仅在组件挂载时运行一次

  return animationTime;
}

export default useAnimation;
