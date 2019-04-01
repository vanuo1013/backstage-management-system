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
          <el-button plain @click="logout">退出</el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-container class="my-container">
      <el-aside width="200px" class="my-aside">
          <!-- 写上router才能使用路由功能, default-active设置默认打开的列表项 -->
        <el-menu router default-active="users" class="el-menu-vertical-demo">
          <el-submenu :index="String(item.id)" v-for="(item,index) in menuList" :key="index">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item-group>
                <!-- index定义路由跳转到的页面 -->
              <el-menu-item :index="it.path" v-for="(it,index) in item.children" :key="index">
                <i class="el-icon-menu"></i>
                <span>{{it.authName}}</span>
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
  name: "index",
  data() {
    return {
      // 左侧导航列表
      menuList: []
    }
  },
  methods: {
    logout () {
      // 删除本地缓存中的token
      window.sessionStorage.removeItem('token')
      // 用编程式导航跳去登录页
      this.$router.push('/login')
    }
  },
  // 用最早执行的钩子函数执行登录判断
  beforeCreate() {
    if (!(window.sessionStorage.getItem('token'))) {
      this.$message.error('请先登录')
      this.$router.push('/login')
    }
  },
  // 在创建元素的钩子函数中获取导航数据
  async created() {
    let res = await this.$axios.get('menus')
    this.menuList = res.data.data;
  },
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
