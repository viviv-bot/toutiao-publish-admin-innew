<template>
  <div class="image-container">
    <el-card class="box-card">
      <template v-slot:header>
        <div class="clearfix">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <!-- 面包屑导航 -->
            <el-breadcrumb-item to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>素材管理</el-breadcrumb-item>
            <!-- 面包屑导航结束 -->
          </el-breadcrumb>
        </div>
      </template>
      <div class="action-head">
        <el-radio-group v-model="collect" size="mini" @change="onCollectChange">
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <el-button size="mini" type="success" @click="dialogUploadVisible=true">上传素材</el-button>
      </div>
      <!-- 素材列表 -->
      <el-row :gutter="20">
        <el-col :xs="12" :sm="6" :md="6" :lg="4" v-for="(img,index) in images" :key="index" class="image-item">
          <el-image style="height: 100px" :src="img.url" fit="cover"></el-image>
          <!-- <div
          class="selected"
          v-if="isShowSelected && selected === index"
        ></div> -->
          <div class="image-action">
            <el-button type="warning" :icon="img.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'" circle
              size="small" @click="onCollect(img)" :loading="img.loading"></el-button>
            <el-button size="small" type="danger" icon="el-icon-delete-solid" circle :loading="img.loading"
              @click="onDelete(img)"></el-button>
            <i
            :class="{
              'el-icon-star-on': img.is_collected,
              'el-icon-star-off': !img.is_collected
            }"
            @click="onCollect(img)"
          ></i>
            <!-- <i class="el-icon-delete-solid"></i>
            <el-button size="mini" icon="el-icon-delete-solid" circle></el-button> -->
          </div>
        </el-col>
      </el-row>
      <div v-if="dialogUploadVisible">
        <el-dialog width=30% title="上传素材" :modelValue="dialogUploadVisible" :append-to-body="true"
          @close="dialogUploadVisible=false">
          <el-upload class="upload-demo" drag action="http://api-toutiao-web.itheima.net/mp/v1_0/user/images" multiple
            :headers="uploadHeaders" name="image" :on-success="onUploadSuccess" v-if="dialogUploadVisible">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <template v-slot:tip>
              <div class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </template>
          </el-upload>
        </el-dialog>
      </div>
      <div class="block">
        <el-pagination layout="prev, pager, next" :total="totalCount" :page-size="pageSize"
          @current-change="onCurrentChange" v-model:current-page="page">
        </el-pagination>
      </div>
    </el-card>
  </div>

</template>
<script>
import { getImage, collectImage, deleteImage } from '@/api/image'
export default {
  name: 'ImageIndex',
  created () {
    this.loadImages(1)
  },
  data () {
    const user = JSON.parse(window.localStorage.getItem('user'))
    return {
      radio1: 'false',
      images: [],
      dialogUploadVisible: false,
      uploadHeaders: {
        Authorization: `Bearer ${user.token}`
      },
      totalCount: 0,
      collect: false,
      pageSize: 10,
      page: 1
    }
  },
  methods: {
    loadImages (page) {
      // 防止出现在第二页时点到收藏页，分页的高亮显示还是第二页
      // 重置高亮页码
      this.page = page
      getImage({
        collec: this.collect,
        page,
        per_page: this.pageSize
      }
      ).then(res => {
        const results = res.data.data.results
        this.totalCount = res.data.data.total_count
        // console.log(res)
        results.forEach(img => {
          // img 对象本来没有 loading 数据
          // 我们这里收到的往里面添加该数据是用来控制每个收藏按钮的 loading 状态
          img.loading = false
        })
        this.images = results
      })
    },
    onCollectChange () {
      this.loadImages(1)
    },
    onUploadSuccess () {
      this.dialogUploadVisible = false
      this.loadImages(false)
      this.$message({
        type: 'success',
        message: '上传成功'
      })
    },
    onCurrentChange (page) {
      this.loadImages(page)
    },
    onCollect (img) {
      img.loading = true
      collectImage(img.id, !img.is_collected).then(
        res => {
          img.is_collected = !img.is_collected
          // 关闭loading
          img.loading = false
        }
      )
    },
    onDelete (img) {
      this.loading = true
      deleteImage(img.id).then(res => {
        this.loadImages(this.page)
        this.loading = false
      })
    }
  }
}
</script>
<style scoped lang="less">
  .action-head {
    padding-bottom: 20px;
    display: flex;
    justify-content: space-between;
  }

  .image-item {
    position: relative;
  }

  .image-action {
    font-size: 25px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    color: #fff;
    height: 40px;
    background-color: rgba(204, 204, 204, .5);
    position: absolute;
    bottom: 4px;
    left: 5px;
    right: 5px;
  }

  .selected {
    background: url(./selected.png) no-repeat;
    background-size: cover;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
