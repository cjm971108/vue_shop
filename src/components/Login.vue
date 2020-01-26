<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <el-image :src="require('@/assets/logo.png')"></el-image>
      </div>
      <div class="loginForm">
        <el-form :model="model" :rules="rules" ref="loginFormRef">
          <el-form-item prop="username">
            <el-input
              placeholder="请输入用户名"
              v-model="model.username"
              prefix-icon="iconfont icon-user"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              placeholder="请输入密码"
              v-model="model.password"
              type="password"
              prefix-icon="iconfont icon-3702mima"
            ></el-input>
          </el-form-item>
          <el-form-item class="btns">
            <el-button type="primary" @click="login">登陆</el-button>
            <el-button type="info" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
// shift+Alt+F 自动化格式
export default {
  data() {
    return {
      model: {
        username: 'admin',
        password: 'www.xiaomadagege.cn'
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    async login() {
      // 点击登录的时候先调用validate方法验证表单内容是否有误
      this.$refs.loginFormRef.validate(async valid => {
        // 如果valid参数为true则验证通过
        if (!valid) {
          return
        }
        // 发送请求进行登录
        const { data: res } = await this.$http.post('login', this.model)
        //   console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error('登录失败:' + res.meta.msg) // console.log("登录失败:"+res.meta.msg)
        }

        this.$message.success('登录成功')
        // console.log(res)
        // 保存token
        // console.log(res.data.token)
        window.sessionStorage.setItem('token', res.data.token)
        // 导航至/home
        this.$router.push('/home')
      })
    },
    reset() {
      this.$refs.loginFormRef.resetFields() // 表单自带的重置方法
    }
  }
}
</script>

<style lang='less' scoped>
.login_container {
  background-color: #2b5b6b;
  height: 100%;
  .login_box {
    position: relative;
    height: 300px;
    width: 450px;
    left: 50%;
    top: 50%;
    background-color: #fff;
    transform: translate(-50%, -50%); //实现水平垂直居中
    .avatar_box {
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      padding: 10px;
      box-shadow: 0 0 10px #ddd; // 水平阴影的位置 垂直阴影的位置 模糊距离 颜色
      .el-image {
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .loginForm {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
      .btns {
        float: right;
      }
    }
  }
}
</style>
