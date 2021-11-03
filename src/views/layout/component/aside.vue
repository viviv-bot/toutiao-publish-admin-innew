<template>
    <el-menu class="aside-menu el-menu-vertical-demo" :default-active="$route.path"
    background-color="#002033" text-color="#fff"
        active-text-color="#ffd04b" router :collapse="isCollapse">
        <div class="menu-logo"></div>
        <el-menu-item index="/">
            <i class="el-icon-s-home iconfont"></i>
            <template v-slot:title><span>首页</span></template>
        </el-menu-item>
        <el-menu-item index="/article">
            <i class="el-icon-document iconfont"></i>
            <template v-slot:title><span>内容管理</span></template>
        </el-menu-item>
        <el-menu-item index="/image">
            <i class="el-icon-picture-outline iconfont"></i>
            <template v-slot:title><span>素材管理</span></template>
        </el-menu-item>
        <el-menu-item index="/publish">
            <i class="el-icon-s-promotion iconfont"></i>
            <template v-slot:title><span>发布文章</span></template>
        </el-menu-item>
        <el-menu-item index="/comment">
            <i class="el-icon-s-comment iconfont"></i>
            <template v-slot:title><span>评论管理</span></template>
        </el-menu-item>
        <el-menu-item index="/fans">
            <i class="el-icon-s-custom iconfont"></i>
            <template v-slot:title><span>粉丝管理</span></template>
        </el-menu-item>
        <el-menu-item index="/settings">
            <i class="el-icon-setting iconfont"></i>
            <template v-slot:title><span>个人设置</span></template>
        </el-menu-item>
    </el-menu>
</template>
<script>
export default {
  name: 'AppAside',
  methods: {

  },
  props: ['is-collapse'],
  data () {
    return {
    //   isCollapse: false
    }
  }
}
</script>
<style scoped lang="less">
    /* // .menu-logo{
//     width: 100%;
//     height: 60px;
//     background: url('./index.png');
// } */
.menu-logo {
        width: 100%;
        height: 53px;
        margin-left: 12px;
        background: url('./toutiao2.png') no-repeat;
    }
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.nav-menu {
  .iconfont {
    margin-right: 10px;
    padding-left: 5px;
  }
}
</style>
