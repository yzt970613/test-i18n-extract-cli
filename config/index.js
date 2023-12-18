import Components from 'unplugin-vue-components/webpack';
import NutUIResolver from '@nutui/nutui-taro/dist/resolver';
import KtaroComponenetsResolver from '@ktaro/components-resolver';
import RouterInterceptorPlugin from '@ktaro/router-interceptor/plugin';
import { UnifiedWebpackPluginV5 } from 'weapp-tailwindcss/webpack';
import path from 'path';
import base from '../src/base.config';
import pages from '../src/pages.config';

const webpackConfigShared = chain => {
  const exclude = [path.resolve(__dirname, '../src/pages/login/index.vue')];
  chain.merge({
    module: {
      rule: {
        routerInterceptorLoader: {
          test: /\.vue$/,
          include: [/src[\\/]pages[\\/].+[\\/]index\.vue$/],
          exclude,
          use: [
            {
              loader: '@ktaro/router-interceptor/loader'
            }
          ]
        }
      }
    }
  });
  chain
    .plugin('router-interceptor-plugin')
    .use(RouterInterceptorPlugin, [{ exclude }]);

  chain.plugin('unplugin-vue-components').use(
    Components({
      resolvers: [NutUIResolver({ taro: true }), KtaroComponenetsResolver()],
      exclude: [/[\\/]\.git[\\/]/, /[\\/]\.nuxt[\\/]/]
    })
  );

  // https://taro-docs.jd.com/docs/envs#%E8%A7%A3%E6%9E%90-node_modules-%E5%86%85%E7%9A%84%E5%A4%9A%E7%AB%AF%E6%96%87%E4%BB%B6
  chain.resolve.plugin('MultiPlatformPlugin').tap(args => {
    args[2]['include'] = ['@ktaro/components', '@ktaro\\components'];
    return args;
  });
};

// 批量处理自定义路由
// 为了 h5 路由整洁，默认去掉头部的 /pages 和 末尾的 /index
// 注意：页面内部的跳转依然保持不变，如 Taro.navigateTo({ url: '/pages/foo/index' });
const customRoutes = {};
const customRoutesHelper = () => {
  let path = '';
  for (const item of pages) {
    path = item.replace('pages/', '');
    path = path.replace('/index', '');
    customRoutes[`/${item}`] = `/${path}`;
  }
};
customRoutesHelper();

const PUBLICPATH_PROD = base.production_prod;
const PUBLICPATH_TEST = base.production_test;
const PUBLICPATH_DEV = base.development;

const MY_ENV = process.env.MY_ENV;
// build环境
const IS_PROD = process.env.NODE_ENV === 'production';
// build且test环境
const IS_PROD_TEST = IS_PROD && MY_ENV === 'test';
// build且prod环境
const IS_PROD_PROD = IS_PROD && MY_ENV === 'prod';

const publicPath = IS_PROD_TEST
  ? PUBLICPATH_TEST
  : IS_PROD_PROD
  ? PUBLICPATH_PROD
  : PUBLICPATH_DEV;

const config = {
  projectName: 'taro-vue3-nutui-template',
  date: '2023-7-3',
  designWidth(input) {
    if (input?.file?.replace(/\\+/g, '/').indexOf('@nutui') > -1) {
      return 375;
    }
    return 750;
  },
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
    375: 2 / 1
  },
  sourceRoot: 'src',
  // outputRoot: 'dist',
  outputRoot: `dist/${process.env.TARO_ENV}`,
  plugins: ['@tarojs/plugin-html', '@tarojs/plugin-http'],
  defineConstants: {},
  copy: {
    patterns: [
      {
        from: 'public/',
        to: `dist/${process.env.TARO_ENV}/`
      }
    ],
    options: {}
  },
  framework: 'vue3',
  compiler: {
    type: 'webpack5',
    prebundle: { enable: false }
  },
  cache: {
    enable: false // Webpack 持久化缓存配置，建议开启。默认配置请参考：https://docs.taro.zone/docs/config-detail#cache
  },
  sass: {
    data: `@import "@nutui/nutui-taro/dist/styles/variables-jdt.scss";\n@import "@ktaro/themes/dist/standard/variables-ktaro.scss";`
  },
  env: {
    MY_ENV: JSON.stringify(process.env.MY_ENV),
    BASE_URL: JSON.stringify(publicPath === '/' ? '' : publicPath)
  },
  alias: {
    '@': path.resolve(__dirname, '../src')
  },
  mini: {
    webpackChain(chain) {
      webpackConfigShared(chain);

      chain.merge({
        plugin: {
          install: {
            plugin: UnifiedWebpackPluginV5,
            args: [
              {
                appType: 'taro'
              }
            ]
          }
        }
      });
    },
    postcss: {
      pxtransform: {
        enable: true,
        config: {
          // selectorBlackList: ['nut-']
          onePxTransform: false
        }
      },
      url: {
        enable: true,
        config: {
          limit: 1024 // 设定转换尺寸上限
        }
      },
      cssModules: {
        enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  },
  h5: {
    webpackChain(chain) {
      webpackConfigShared(chain);
    },
    publicPath,
    staticDirectory: 'static',
    esnextModules: [
      'nutui-taro',
      'icons-vue-taro',
      '@ktaro/components',
      '@ktaro\\components'
    ],
    postcss: {
      pxtransform: {
        enable: true,
        config: {
          onePxTransform: false,
          targetUnit: 'vw',
          unitPrecision: 3
        }
      },
      autoprefixer: {
        enable: true,
        config: {}
      },
      cssModules: {
        enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    },
    router: {
      basename: publicPath === '/' ? '' : publicPath,
      mode: 'browser',
      customRoutes
    }
  }
};

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'));
  }
  return merge({}, config, require('./prod'));
};
