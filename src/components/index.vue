<template>
  <el-container class="index">
    <el-header class="my-header">
      <el-row>
        <el-col :span="2">
          <img src="../assets/logo.png" alt>
        </el-col>
        <el-col :span="20">
          <h2>后台管理系统</h2>
        </el-col>
        <el-col :span="2">
          <el-button plain>退出</el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-container class="my-container">
      <el-aside width="200px" class="my-aside">
          <!-- 写上router才能使用路由功能 -->
        <el-menu router default-active="2" class="el-menu-vertical-demo">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航一</span>
            </template>
            <el-menu-item-group>
                <!-- index定义路由跳转到的页面 -->
              <el-menu-item index="users">
                <i class="el-icon-menu"></i>
                <span>选项1</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="my-main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "index"
};
</script>

<style lang="scss">
.index {
  height: 100%;
  display: flex;
  flex-direction: column;
  .my-header {
    height: 60px;
    background-color: #caf0ff;
    line-height: 60px;
    img {
      height: 60px;
    }
    h2 {
      margin: 0;
      padding: 0;
      text-align: center;
    }
  }
  .my-container {
    flex: 1;
  }
}
</style>
