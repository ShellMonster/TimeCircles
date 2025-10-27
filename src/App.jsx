/**
 * 应用主入口组件
 */

import React from 'react';
import TimeWheel from './components/TimeWheel/TimeWheel';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import './App.css';

/**
 * App组件
 * 主要职责：
 * 1. 渲染 TimeWheel 主要组件（时间轮盘）
 * 2. 渲染 Header 组件（顶部 logo 和标题）
 * 3. 渲染 Footer 组件（底部版权和链接）
 */
function App() {
  return (
    <div className="app-container">
      {/* 时间轮盘主组件 */}
      <TimeWheel />

      {/* 页面装饰元素 */}
      <Header />
      <Footer />
    </div>
  );
}

export default App;
