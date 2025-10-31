/**
 * Footer 组件
 * 显示版权信息和项目链接
 * 位置：页面底部，使用 fixed 定位
 */

import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-copyright">
        <span>© 2025 TimeCircles</span>
        <span className="separator">•</span>
        <span>Made with ❤️ using React + Canvas</span>
      </div>

      <div className="footer-links">
        <a href="https://github.com/ShellMonster/TimeCircles" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <span className="separator">•</span>
        <a href="https://time.geekaso.com" target="_blank" rel="noopener noreferrer">
          Live Demo
        </a>
      </div>
    </footer>
  );
}

export default Footer;
