<template>
<div class="login-container">
  <div class="login-form-wrap">
    <div class="login-head">
      <div class="logo"></div>
    </div>
   <el-form class="login-form" ref="login-form" :model="user" :rules="formRules">
   <el-form-item prop="mobile">
    <el-input v-model="user.mobile" placeholder="请输入手机号"></el-input>
   </el-form-item>
   <el-form-item prop="code" >
    <el-input v-model="user.code" placeholder="请输入验证码"></el-input>
   </el-form-item>
   <el-form-item prop="agree">
    <el-checkbox v-model="user.agree"  >我已阅读并同意用户协议和隐私条款</el-checkbox>
   </el-form-item>

   <el-form-item>
    <el-button class="login-btn" type="primary" @click="onLogin" :loading="loginLoading">登录</el-button>
  </el-form-item>
  </el-form>
   </div>
</div>
</template>

<script>
// import request from '@/utils/request.js'
import { login } from '@/api/user'
export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '13911111111',
        code: '246810',
        agree: true
      },
      // checked: false,
      loginLoading: false,
      formRules: {
        mobile: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' },
          { pattern: /^1[|3|5|7|8|9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'change' }
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'blur' },
          { pattern: /^\d{6}$/, message: '请输入正确的验证码格式' }
        ],
        agree: [
          {
            validator: (rule, value, callback) => {
              if (value) {
                callback()
              } else {
                callback(new Error('请勾选用户协议'))
              }
            },
            trigger: 'change'
          }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    onLogin () {
      this.$refs['login-form'].validate(
        valid => {
          if (!valid) {
            return
          }
          this.login()
        }
      )
    },
    login () {
      this.loginLoading = true
      // const user = this.user
      // request({
      //   method: 'POST',
      //   url: '/mp/v1_0/authorizations',
      //   data: this.user
      // })
      login(this.user).then(res => {
        // console.log(res)
        this.$message({
          message: '登录成功',
          type: 'success'
        })
        this.loginLoading = false
        // 将接口返回的数据放到本地存储
        window.localStorage.setItem('user', JSON.stringify(res.data.data))
        // this.$router.push('/')写法一
        this.$router.push({
          name: 'home'
        })
      }).catch(err => {
        console.log('登录失败', err)
        this.$message.error('登录失败，手机号验证码错误')
        this.loginLoading = false
      })
    }
  }
}
</script>
<style scoped lang="less">
.login-container{
  position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: url('./login_bg.jpg') no-repeat;
    background-size: cover;
}
.login-form-wrap {

      min-width: 300px;
      padding: 30px 50px 10px;
      background-color: #fff;}
.login-head {
   display: flex;
   justify-content: center;}
.logo {
width: 200px;
height: 57px;
background: url('./logo_index.png') no-repeat;
background-size: contain; }
.login-form {
.login-btn {
width: 100%;
 }}
</style>
