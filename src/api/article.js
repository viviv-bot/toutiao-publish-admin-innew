import request from '@/utils/request'
export const getArticles = params => {
  return request({
    // method请求方法：GET-一般用于查询；POST一般用于添加；PUT一般用于修改 完整替换；
    // DELETE-一般用于删除操作；PATCH-一般用于局部修改
    method: 'GET',
    url: '/mp/v1_0/articles',
    // Body请求体参数用 data设置，Query查询参数用params设置，Headers请求头参数用 headers设置 路径参数
    // 如果有Query参数，axios会在内部把增对象转为key=value&key=value 的数据格式，然后以 ? 分割
    headers: {
      // 数据名：值 这里的content-type要用引号，因为中间有横线
      // 'conten-type': json
    },
    params: params
  })
}
export const getArticlesChannels = () => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/channels'
  })
}
export const deleteArticle = articleId => {
  return request({
    method: 'DELETE',
    url: `/mp/v1_0/articles/${articleId}`
    // 路径参数需要url中传递。凡是看见接口文件中有冒号，则需要传递路径
    // 原来接口文档给的url是/mp/v1_0/articles/:target
  })
}
// ES6中的参数默认值只能设置为第二个参数（最后一个），因为函数调用时，如果只传一个参数，那么默认给第一个
export const addArticle = (data, draft = false) => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/articles',
    params: {
      draft
    },
    data
  })
}
// 编辑文章
export const updateArticle = (articleId, data, draft = false) => {
  return request({
    method: 'PUT',
    url: `/mp/v1_0/articles/${articleId}`,
    params: {
      draft
    },
    data
  })
}
// 获取指定文章
export const getArticle = articleId => {
  return request({
    method: 'GET',
    url: `/mp/v1_0/articles/${articleId}`
  })
}
/**
 * 获取文章评论
 */
// export const getComments = (type, source) => {
//   return request({
//     method: 'GET',
//     url: '/mp/v1_0/comments/status',
//     params: {
//       type,
//       source
//     }
//   })
// }
/**
 * 修改文章评论状态
 */
// 函数中参数变量名要驼峰命名法
export const updateCommentStatus = (articleId, allowComment) => {
  return request({
    method: 'PUT',
    url: '/mp/v1_0/comments/status',
    params: {
      // 对象的属性名article_id不受代码规范限制，要和接口文档一致，不能修改
      article_id: articleId
    },
    data: {
      allow_comment: allowComment
    }
  })
}
