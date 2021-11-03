<template>
    <el-container class="layout-container">
        <!-- 父组件中侧边栏的宽度要设置成auto才能进行折叠 -->
        <el-aside class="aside" width="auto">
            <!-- 绑定的传给子组件aside.的属性isCollapse要用段横线的格式 -->
            <app-aside class="aside-menu" :is-collapse="isCollapse"></app-aside>
        </el-aside>
        <el-container>
            <el-header class="header">
                <div>
                    <i :class="{
                        'el-icon-s-unfold':isCollapse,
                        'el-icon-s-fold':!isCollapse
                    }" @click="isCollapse=!isCollapse"></i>
                    <span>富贵食饭公司</span>
                </div>
                <el-dropdown>
                    <div class="avator-wrap">
                        <!-- <img class="avator" src="./component/touxiang.jpeg" alt="" /> -->
                        <img class="avator" :src="user.photo" alt="" />
                        <span>{{user.name}}</span>
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </div>
                    <!-- <span class="el-dropdown-link">
    下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
  </span> -->
                    <template v-slot:dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item>设置</el-dropdown-item>
                            <!-- 组件是默认不处理原生事件的，除非内部做了处理 -->
                            <el-dropdown-item v-on:click="onLogout">退出</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </el-header>

            <el-main class="main">
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
import AppAside from '@/views/layout/component/aside.vue'
import { getUserProfile } from '@/api/user'
import globalBus from '@/utils/global-bus'

export default {
  name: 'LayoutIndex',
  components: {
    AppAside
  },
  data () {
    return {
      user: {},
      isCollapse: false
      // 侧边菜单栏的展开状态
    }
  },
  created () {
    this.loadUserProfile()
    globalBus.on('update-user', (data) => {
      // this.user = data // 注意：不要这么做，对象之间赋值的是引用，引用类型之间会导致相互影响的问题
      this.user.name = data.name
      this.user.photo = data.photo
    })
  },
  mounted(){

  },
  methods: {
    loadUserProfile () {
      getUserProfile().then((res) => {
        this.user = res.data.data
      })
    },
    onLogout () {
      this.$confirm('确认退出吗?', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        window.localStorage.removeItem('user')
        this.$router.push('/login')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
    .layout-container {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
    }

    .aside {
        // width: 200px;
        background-color: #d3dce6;

        .aside-menu {
            height: 100%;
        }
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #ccc;
        /* // background-color: #b3c0d1; */
    }

    .avator-wrap {
        display: flex;
        align-items: center;

        .avator {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 10px;
        }
    }

    .main {
        background-color: #e9eef3;
    }
</style>
