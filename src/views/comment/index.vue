<template>
  <div class="image-container">
    <el-card class="box-card">
      <template v-slot:header>
        <div class="clearfix">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <!-- 面包屑导航 -->
            <el-breadcrumb-item to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>评论管理</el-breadcrumb-item>
            <!-- 面包屑导航结束 -->
          </el-breadcrumb>
        </div>
      </template>
      <el-table
        class="table-list"
        :data="articles"
        style="width: 100%"
        stripe>
      <el-table-column
        prop="title"
        label="标题"
       >
      </el-table-column>
      <el-table-column
        prop="total_comment_count"
        label="总评论数"
        >
      </el-table-column>
      <el-table-column
        prop="fans_comment_count"
        label="粉丝评论数">
      </el-table-column>
       <el-table-column
        prop="address"
        label="评论状态">
        <template v-slot="scope">
         {{ scope.row.comment_status ? '正常' : '关闭' }}
        </template>
      </el-table-column>
       <el-table-column
        prop="address"
        label="操作">
         <template v-slot="scope">
            <el-switch
              v-model="scope.row.comment_status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :disabled="scope.row.statusDisabled"
              @change="onStatusChange(scope.row)"
            >
            </el-switch>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      v-model:current-page="page"
      :page-sizes="[10, 20, 50, 100]"
      v-model:page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount"
      background>
    </el-pagination>
    </el-card>
  </div>
</template>
<script>
// import { updateCommentStatus } from '@/api/article.js'
import {
  getArticles, updateCommentStatus
} from '@/api/article'

export default {
  name: 'CommentIndex',
  data () {
    return {
      articles: [], // 文章列表
      totalCount: 0, // 总数据大小
      pageSize: 10,
      page: 1 // 当前激活的页码
    }
  },
  created () {
    this.loadArticles()
  },
  methods: {
    handleSizeChange () {
      this.loadArticles(1)
    },
    handleCurrentChange (page) {
      // 页码改变，加载指定页码数据
      this.loadArticles(page)
    },
    loadArticles (page = 1) {
      // 让激活的页码和当前请求数据的页码保持一致
      this.page = page
      getArticles({
        response_type: 'commment',
        page,
        per_page: this.pageSize
      }).then(res => {
        const { results } = res.data.data
        results.forEach(article => {
          article.statusDisabled = false
        })
        this.articles = results
        this.totalCount = res.data.data.total_count
      })
    },
    onStatusChange (article) {
      article.statusDisabled = true
      updateCommentStatus(article.id.toString(), article.comment_status).then(res => {
        article.statusDisabled = false
        this.$message({
          type: 'success',
          message: article.comment_status ? '开启文章评论状态' : '关闭文章评论状态'
        })
      })
    }
  }
}
</script>
<style scoped lang="less">
.table-list{
    margin-bottom: 30px;
}
</style>
