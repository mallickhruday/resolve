const devConfig = {
  target: 'local',
  port: 3000,
  polyfills: ['@babel/polyfill'],
  mode: 'development',
  redux: {
    enhancers: ['client/enhancers/redux-devtools.js']
  },
  readModelAdapters: [
    // {
    //   name: 'default',
    //   module: 'resolve-readmodel-mysql',
    //   options: {
    //     database: 'HN',
    //     user: 'root',
    //     password: 'root',
    //     host: '127.0.0.1',
    //     port: 3306
    //   }
    // }
    {
      name: 'default',
      module: 'resolve-readmodel-memory',
      options: {}
    }
    // {
    //   name: 'default',
    //   module: 'resolve-readmodel-mongo',
    //   options: {
    //     url: 'mongodb://127.0.0.1:27017/HN'
    //   }
    // }
  ],
  jwtCookie: {
    name: 'jwt',
    maxAge: 31536000000
  }
}

export default devConfig
