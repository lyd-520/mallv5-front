
require('events').EventEmitter.defaultMaxListeners = 20; // 将MaxListeners的限制数增加到20
module.exports = {
    // publicPath: process.env.NODE_ENV ==="development"? "mallv5-front" : "/",
    outputDir: 'dist',
    assetsDir: 'static',
  devServer:{
    host:'0.0.0.0',
    port:8080,
    proxy:{
      '/home/*':{
        target:'http://127.0.0.1:8887',
        changeOrigin:true,
      },
        '/baiduMapApi/*':{
            target:'https://api.map.baidu.com',
            secure:false,
            changeOrigin:true,
            pathRewrite:{
                '/baiduMapApi':''
            }
        },
        '/pms/*':{
            target:'http://127.0.0.1:8880',
            changeOrigin:true,
        }
        ,
        '/cart/*':{
            target:' http://127.0.0.1:8880',
            changeOrigin:true,
        },
        '/skCart/*':{
            target:' http://127.0.0.1:8880',
            changeOrigin:true,
        },
        '/sso/*':{
            target:'http://127.0.0.1:8880',
            changeOrigin:true,
        }
        ,
        '/member/*':{
            target:'http://mallv5.v2.idcfengye.com',
            changeOrigin:true,
        } ,
        '^/order/qrcodeImg':{
            target:'http://127.0.0.1:8844',
            changeOrigin:true,
        },
        '/order/*':{
            target:'http://127.0.0.1:8880',
            changeOrigin:true,
        },
        '/skOrder/*':{
            target:' http://127.0.0.1:8880',
            changeOrigin:true,
        },
        '/static/qrcode/*':{
          target:'http://127.0.0.1:8844',
          changeOrigin:true,
        },
        '/es/*':{
            target:'http://127.0.0.1:8054',
            changeOrigin:true,
            pathRewrite:{
              '/es':''
            }
        }
    }
  },
  // publicPath:'/app',
  // outputDir:'dist',
  // indexPath:'index2.html',
  // lintOnSave:false,
  productionSourceMap:true,
  chainWebpack:(config)=>{
    config.plugins.delete('prefetch');
  }
}