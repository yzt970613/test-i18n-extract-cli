const MY_ENV = process.env.MY_ENV;
const proxyTarget = {
  // master: {
  //   origin: {
  //     test: 'http://foo.com',
  //     prod: 'http://foo.com'
  //   }
  // },
  // test: {
  //   origin: {
  //     test: 'http://bar.com',
  //     prod: 'http://bar.com'
  //   }
  // }
  master: {
    origin: {
      test: 'http://192.168.1.5:3000',
      prod: 'http://192.168.1.5:3000'
    }
  },
  test: {
    origin: {
      test: 'http://192.168.1.5:4000',
      prod: 'http://192.168.1.5:4000'
    }
  }
};

module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {},
  mini: {},
  h5: {
    devServer: {
      proxy: {
        '/master': {
          target: proxyTarget.master.origin[MY_ENV],
          secure: true,
          changeOrigin: true,
          // 代理的时候路径是有 master 的，因为这样子就可以针对代理，不会代理到其他无用的。但实际请求的接口是不需要 master 的，所以在请求前要把它去掉
          pathRewrite: {
            '^/master': ''
          }
        },
        '/test': {
          target: proxyTarget.test.origin[MY_ENV],
          secure: true,
          changeOrigin: true,
          pathRewrite: {
            '^/test': ''
          }
        }
      }
    }
  }
};
