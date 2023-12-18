// 1. 资源的静态路径
// 2. 路由base路径

// ⚠️ 注意不要有后面的斜杠

// @ts-ignore
const base = {
  // 开发
  development: '/',
  // 测试
  production_test: '/foo',
  // 正式
  production_prod: '/bar'
};
module.exports = base;
