import pages from './pages.config';
export default defineAppConfig({
  // 路由切换动画
  animation: false,
  pages,
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  }
});
