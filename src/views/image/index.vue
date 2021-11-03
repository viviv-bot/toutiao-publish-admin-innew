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
      <!-- 图片列表 -->
      <image-list />
      <!-- /图片列表 -->
    </el-card>
  </div>
</template>

<script>
import ImageList from './components/image-list'

export default {
  name: 'ImageIndex',
  components: {
    ImageList
  },
  props: {},
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {}
}
</script>

<style scoped lang="less"></style>
