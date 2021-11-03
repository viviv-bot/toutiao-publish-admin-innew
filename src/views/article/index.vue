<template>
    <div class="article-container">
        <el-card class="filter-card">
            <template v-slot:header>
                <div class="clearfix">
                    <el-breadcrumb separator-class="el-icon-arrow-right">
                        <!-- 面包屑导航 -->
                        <el-breadcrumb-item to="{ path: '/' }">首页</el-breadcrumb-item>
                        <el-breadcrumb-item>内容管理</el-breadcrumb-item>
                        <!-- 面包屑导航结束 -->
                    </el-breadcrumb>
                </div>
            </template>
            <el-form ref="form" :model="form" label-width="50px" size="mini">
                <el-form-item label="状态">
                    <el-radio-group v-model="status">
                        <!-- radio默认吧label作为文本和选中的值，因此要把radio的文本和value分开 -->
                        <!-- label="null"前面要加冒号才能成为Null，不然就会成为字符串 -->
                        <el-radio :label="null">全部</el-radio>
                        <el-radio :label="0">草稿</el-radio>
                        <el-radio :label="1">审核</el-radio>
                        <el-radio :abel="2">审核通过</el-radio>
                        <el-radio :label="3">审核失败</el-radio>
                        <el-radio :label="4">已删除</el-radio>
                    </el-radio-group>
                    <!-- //数据筛选菜单 -->
                </el-form-item>
                <el-form-item label="频道">
                    <el-select v-model="channelId" placeholder="请选择频道">
                        <!-- 要注意这里的value要加冒号，因为不加冒号的话就成为字符串，格式不匹配 -->
                        <el-option label="全部" :value="null"></el-option>
                        <el-option :label="channel.name" :value="channel.id" v-for="(channel, index) in channels"
                            :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="日期">
                    <el-date-picker v-model="rangeDate" type="datetimerange" start-placeholder="开始日期"
                        end-placeholder="结束日期" :default-time="['12:00:00']" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button
                    type="primary"
                    @click="loadArticles(1)"
                    :disabled="loading"
                    >查询</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <el-card class="box-card">
            <template v-slot:header>
                <div class="clearfix">
                    根据筛选条件共查询到 {{ totalCount }}条结果：
                </div>
            </template>
            <el-table :data="articles" stripe style="width: 100%" class="list-table" size="mini" v-loading="loading">
                <el-table-column prop="date" label="封面">
                    <template v-slot="scope">
                        <el-image style="width: 50px; height: 50px" :src="scope.row.cover.images[0]" fit="cover" lazy>
                            <!-- <template v-slot="placeholder">
                                <div class="image-slot">
                                加载中<span class="dot">...</span>
                                </div>
                            </template> -->
                        </el-image>
                        <!-- <img v-if="scope.row.cover.images[0]" class="article-cover" :src="scope.row.cover.images[0]"
                            alt="">
                        <img v-else class="article-cover" src="./nopic.gif" alt=""> -->
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="标题">
                </el-table-column>
                <el-table-column prop="status" label="状态">
                    <template v-slot="scope">
                        <el-tag :type="articleStatus[scope.row.status].type">{{articleStatus[scope.row.status].text}}
                        </el-tag>
                        <!-- <el-tag v-else-if="scope.row.status===1">待审核</el-tag>
                    <el-tag v-else-if="scope.row.status===2" type="success">审核通过</el-tag>
                    <el-tag v-else-if="scope.row.status===3" type="danger">审核失败</el-tag>
                    <el-tag v-else-if="scope.row.status===4" type="info">已删除</el-tag> -->
                    </template>
                </el-table-column>
                <el-table-column prop="pubdate" label="发布时间">
                </el-table-column>
                <!-- 路由跳转，点击编辑后跳转到文章发布页面 -->
                <el-table-column label="操作">
                    <template v-slot="scope">
                        <el-button
                        size="mini"
                        circle
                        icon="el-icon-edit"
                        type="primary"
                       @click="$router.push('/publish?id=' + scope.row.id.toString())"></el-button>
                        <el-button
                        size="mini"
                        type="danger"
                        circle
                        icon="el-icon-delete"
                        @click="onDeleteArticle(scope.row.id)">
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 总数据条数totalCount是为了计算分页总页码数 -->
            <el-pagination
            layout="prev, pager, next"
            background
            :total="totalCount"
            @current-change="onCurrentChange"
            :page-size="pageSize"
            :disabled="loading"
            v-model:current-page="page"
            >
            <!-- 原up写法 :current-page.sync="page" -->
            </el-pagination>
        </el-card>
    </div>
</template>
<script>
import { getArticles, getArticlesChannels, deleteArticle } from '@/api/article'
export default {
  name: 'ArticleIndex',
  data () {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      articles: [],
      articleStatus: [
        { status: 0, text: '草稿', type: 'info' }, // 0
        { status: 1, text: '待审核', type: '' }, // 1
        { status: 2, text: '审核通过', type: 'success' }, // 2
        { status: 3, text: '审核失败', type: 'warning' }, // 3
        { status: 4, text: '已删除', type: 'danger' } // 4
      ],
      totalCount: 0, // 总数据条数
      pageSize: 10,
      status: null,
      channels: [],
      channelId: null,
      rangeDate: null,
      loading: true,
      page: 1
    }
  },
  created () {
    this.loadChannels()
    this.loadArticles(1)
  },
  methods: {
    loadArticles (page = 1) {
      this.loading = true
      getArticles({
        page,
        per_page: this.pageSize,
        // astatus不能为null,因为axios不会发送数据为Null undefined之类的数据
        status: this.status,
        channel_id: this.channelId,
        begin_pubdate: this.rangeDate ? this.rangeDate[0] : null,
        end_pubdate: this.rangeDate ? this.rangeDate[1] : null
      }).then(res => {
        //   解构赋值 total_count是原始的返回的数据名称
        const { results, total_count: totalCount } = res.data.data
        this.articles = results
        this.totalCount = totalCount
        // 关闭加载中loading
        this.loading = false
      })
    },
    onSubmit () {
      console.log('submit!')
    },
    onCurrentChange (page) {
      this.loadArticles(page)
    },
    loadChannels () {
      getArticlesChannels().then(res => {
        this.channels = res.data.data.channels
        // console.log(res)
      })
    },
    onDeleteArticle (articleId) {
      // 流程：找到数据接口，封装请求方法，删除请求调用，处理相应结果
      this.$confirm('确认删除吗?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 将JSONbig返回的BigNumber通过toString转换成对象
        deleteArticle(articleId.toString()).then(res => {
          // 删除成功，更新当前页的文章数据列表
          this.loadArticles(this.page)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>
<style scoped lang="less">
    .filter-card {
        margin-block: 30px;
    }

    .list-table {
        margin-bottom: 20px;
    }

    .article-cover {
        width: 60px;
        background-size: cover;
    }
</style>
