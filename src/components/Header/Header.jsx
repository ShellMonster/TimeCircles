/**
 * Header 组件
 * 显示项目 logo 和标题
 * 位置：页面顶部左侧，使用 fixed 定位
 */

import React from 'react';
import './Header.css';
import logo from '../../web.png';

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        {/* Logo 图标 */}
        <img src={logo} alt="TimeCircles Logo" className="header-logo" />

        {/* 项目标题 */}
        <span className="header-title">TimeCircles</span>

        {/* 版本信息 */}
        <span className="header-version">v1.0.0</span>
      </div>
    </header>
  );
}

export default Header;
