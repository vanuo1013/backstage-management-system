<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <bread sectitle="权限管理" threetitle="角色列表"></bread>
    <!--输入框 -->
    <el-row>
      <el-col :span="12">
        <!-- 点击事件中控制弹出框的显示 -->
        <el-button plain @click="addFormVisible = true">添加角色</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="userList" style="width: 100%" border>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="角色名称"></el-table-column>
      <el-table-column prop="email" label="角色描述"></el-table-column>
      <!-- 自定义列模板中可以放任何组件 -->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- 通过scope.$index 获取索引 scope.row获取这一行的数据 -->
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="handleEdit(scope.$index, scope.row)"
            plain
          ></el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="delOne(scope.row)"
            plain
          ></el-button>
          <el-button
            type="warning"
            size="mini"
            icon="el-icon-check"
            @click="showRole(scope.row)"
            plain
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增用户弹出框 -->
    <el-dialog title="添加用户" :visible.sync="addFormVisible">
      <el-form :model="addForm" :rules="addRules" ref="addForm">
        <!-- prop: 必填项   rules: 验证规则 -->
        <el-form-item label="账号" label-width="100px" prop="username">
          <el-input v-model="addForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="100px" prop="password">
          <el-input v-model="addForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="addForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-input v-model="addForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAdd('addForm')">确 定</el-button>
        <el-button @click="addFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
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
    <!-- 角色设置弹出框 -->
    <el-dialog title="用户角色" :visible.sync="roleFormVisible">
      <el-form :model="editForm">
        <el-form-item label="当前用户" label-width="100px">{{editUser.username}}</el-form-item>
        <el-form-item label="请选择角色" label-width="100px">
          <!-- 这里的双向数据绑定设置role_name使其默认被选中 -->
          <el-select v-model="editUser.role_name" placeholder="请选择角色">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitRole('editForm')">确 定</el-button>
        <el-button @click="roleFormVisible = false">取 消</el-button>
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
      // 是否显示新增用户对话框
      addFormVisible: false,
      // 新增用户表单用对象存起来方便请求的时候发送
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      // 是否显示修改对话框
      editFormVisible: false,
      // 修改用户表单对象
      editForm: {
        username: "",
        email: "",
        mobile: ""
      },
      // 是否显示角色对话框
      roleFormVisible: false,
      // 用对象将当前编辑的用户信息存起来
      editUser: {},
      // 用户角色列表
      roleList: [],
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
    // 开关状态改变
    stateChange(row) {
      // 这行的开关状态改变即调用接口修改数据, 查看接口文档
      this.$axios.put(`users/${row.id}/state/${row.mg_state}`);
    },
    // 提交新增用户
    submitAdd(addForm) {
      // 饿了么ui的表单验证提交方法, 用async修正回调函数内的异步操作
      this.$refs[addForm].validate(async valid => {
        if (valid) {
          //
          let res = await this.$axios.post("users", this.addForm);
          // 如果返回的状态码为新增成功, 则重新获取用户列表
          if (res.data.meta.status === 201) {
            this.search();
          }
          // 提交成功后关闭弹窗
          this.addFormVisible = false;
        } else {
          this.$message.error("请正确输入数据");
          return false;
        }
      });
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
    // 删除用户功能
    delOne(row) {
      // 饿了么ui提示框
      this.$confirm("确认删除该用户?", "提示", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // 发请求调用接口的删除方法, 根据状态码判断成功则重新获取数据
          let res = await this.$axios.delete(`users/${row.id}`);
          if (res.data.meta.status === 200) {
            this.search();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    // 点击角色设置按钮
    async showRole(row) {
      // 显示角色弹出框
      this.roleFormVisible = true;
      // 将当前用户信息存入data的字段中
      this.editUser = row;
      // 调用接口获取所有角色列表
      let res = await this.$axios.get('roles')
      this.roleList = res.data.data;
    },
    // 分配角色信息
    async submitRole () {
      // 调用接口根据用户id分配用户角色
      let res = await this.$axios.put(`users/${this.editUser.id}/role`,{
        rid: this.editUser.role_name
      })
      if (res.data.meta.status === 200) {
        this.search();
      }
      // 修改成功后关闭弹出框
      this.roleFormVisible = false;
    },
    // 页码改变事件
    currentChange (current) {
      this.sendData.pagenum = current
      this.search()
    },
    // 每页容量改变
    sizeChange (size) {
      this.sendData.pagesize = size
      this.search()
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
