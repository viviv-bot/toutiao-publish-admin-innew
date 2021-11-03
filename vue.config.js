// module.exports = {
//   devServer: {
//     proxy: {
//       '/api': {
//         // 需要代理的url
//         target: 'http://api-toutiao-web.itheima.net/',
//         changeOrigin: true,
//         ws: true,
//         pathRewrite: {
//           '^/api': ''
//         }
//       }
//     }
//   }
// }
module.exports = {
  lintOnSave: false
}
