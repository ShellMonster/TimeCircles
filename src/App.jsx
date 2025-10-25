/**
 * 应用主入口组件
 */

import React from 'react';
import TimeWheel from './components/TimeWheel/TimeWheel';

/**
 * App组件
 * 主要职责：渲染TimeWheel组件
 */
function App() {
  return (
    <div style={{ margin: 0, padding: 0, width: '100%', height: '100%' }}>
      <TimeWheel />
    </div>
  );
}

export default App;
