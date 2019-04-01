<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <bread sectitle="订单管理" threetitle="订单列表"></bread>
    <!-- 表格 -->
    <el-table :data="userList" style="width: 100%" border>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="订单编号"></el-table-column>
      <el-table-column prop="mobile" label="订单价格" width="100"></el-table-column>
      <!-- 自定义列模板中可以放任何组件 -->
      <el-table-column label="是否付款" width="100">
        <template >
          <el-button type="danger" plain size="mini">未付款</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="mobile" label="是否发货" width="100"></el-table-column>
      <el-table-column prop="mobile" label="下单时间"></el-table-column>
      <!-- 自定义列模板中可以放任何组件 -->
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <!-- 通过scope.$index 获取索引 scope.row获取这一行的数据 -->
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="handleEdit(scope.$index, scope.row)"
            plain
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      :page-sizes="[10, 20, 30, 40]"
      :page-size="sendData.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @current-change="currentChange"
      @size-change="sizeChange"
    ></el-pagination>
    <!-- 编辑弹出框 -->
    <el-dialog title="编辑用户" :visible.sync="editFormVisible">
      <el-form :model="editForm" :rules="addRules" ref="editForm">
        <el-form-item label="账号" label-width="100px" prop="username">
          <!-- disabled: 禁用, 账号不许修改 -->
          <el-input v-model="editForm.username" disabled autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="editForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-input v-model="editForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitEdit('editForm')">确 定</el-button>
        <el-button @click="editFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 总条数
      total: 0,
      // 将接口需要的数据放在一个对象中方便传递
      sendData: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      // 用户信息数组
      userList: [],
      // 是否显示修改对话框
      editFormVisible: false,
      // 修改用户表单对象
      editForm: {
        username: "",
        email: "",
        mobile: ""
      },
      // 表单验证规则
      addRules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 6, max: 16, message: "密码长度6-16之间", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    // 调用接口获取数据
    async search() {
      let res = await this.$axios.get("users", {
        // 将token通过请求头发给后台验证, 字段查看接口文档 (已通过拦截器统一设置)
        // headers: {
        //   Authorization: window.sessionStorage.getItem("token")
        // },
        params: this.sendData
      });
      // 将获得的数据存入data中
      this.total = res.data.data.total;
      this.userList = res.data.data.users;
    },
    // 点击编辑按钮
    async handleEdit(index, row) {
      // 发请求根据id查询用户信息存入data的字段中
      let res = await this.$axios.get(`users/${row.id}`);
      this.editForm = res.data.data;
      // 根据状态码判断获取成功则显示弹出框
      if (res.data.meta.status === 200) {
        this.editFormVisible = true;
      }
    },
    // 提交保存编辑
    async submitEdit() {
      // 修改的字段可以为空, 不用表单验证, 直接发请求即可
      let res = await this.$axios.put(`users/${this.editForm.id}`, {
        email: this.editForm.email,
        mobile: this.editForm.mobile
      });
      // 根据状态码判断获取成功则显示弹出框
      if (res.data.meta.status === 200) {
        this.search();
      }
      // 修改成功后关闭弹出框
      this.editFormVisible = false;
    },
    // 页码改变事件
    currentChange(current) {
      this.sendData.pagenum = current;
      this.search();
    },
    // 每页容量改变
    sizeChange(size) {
      this.sendData.pagesize = size;
      this.search();
    }
  },
  // 页面一加载就调用查询方法通过接口获取数据
  created() {
    this.search();
  }
};
</script>

<style>
</style>
