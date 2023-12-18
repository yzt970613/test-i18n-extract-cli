import { createApp } from 'vue';
import './app.scss';
import { setScrollViewPlusDefaultOptions } from '@ktaro/components';
import { routerInterceptor } from '@ktaro/router-interceptor';
import { sleep } from '@ktaro/shared';

const app = createApp({
  onShow(options) {},
  onLaunch() {
    let loaded = false;
    routerInterceptor.beforeEach(async (to, next) => {
      if (!loaded) {
        await sleep(1500);
        loaded = true;
      }
      next();
    });
  }
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
});

setScrollViewPlusDefaultOptions({
  props: {
    pageSize: 20,
    totop: true
  }
});

export default app;
