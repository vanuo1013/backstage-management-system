<template>
  <div class="login">
    <div class="box">
      <h2>用户登录</h2>
      <el-form
        label-position="top"
        label-width="80px"
        :model="loginForm"
        :rules="rules"
        ref="loginForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password"></el-input>
        </el-form-item>
        <el-button class="my-btn" type="primary" @click="submitForm('loginForm')">登录</el-button>
        <el-button class="my-btn" type="success" @click="resetForm('loginForm')">重置</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      loginForm: {
        // 表单数据
        username: "",
        password: ""
      },
      rules: {
        // 表单验证规则
        username: [
          // required: 必填项, message: 提示信息, trigger: 触发方式
          { required: true, message: "用户名不能为空", trigger: "blur" },
          { min: 4, max: 10, message: "长度为4~10个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 6, max: 12, message: "长度为6~12个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
            // 直接提交
        } else {
          // 饿了么ui的弹出框
          this.$message.error("数据格式错误, 请根据提示修改");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang='scss'>
.login {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #324152;
  .box {
    width: 550px;
    height: 420px;
    padding: 35px;
    background-color: #fff;
    border-radius: 10px;
    box-sizing: border-box;
    .my-btn {
      width: 48.95%;
    }
  }
}
</style>
