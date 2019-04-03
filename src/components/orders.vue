<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <bread sectitle="订单管理" threetitle="订单列表"></bread>
    <!-- 表格 -->
    <el-table :data="orderList" style="width: 100%" border>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="order_number" label="订单编号"></el-table-column>
      <el-table-column prop="order_price" label="订单价格" width="100"></el-table-column>
      <!-- 自定义列模板中可以放任何组件 -->
      <el-table-column label="是否付款" width="100">
        <template slot-scope="scope">
          <el-button v-if="scope.row.order_pay == 0" type="danger" plain size="mini">未付款</el-button>
          <el-button v-else type="success" plain size="mini">已付款</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="is_send" label="是否发货" width="100"></el-table-column>
      <el-table-column prop="create_time" label="下单时间"></el-table-column>
      <!-- 自定义列模板中可以放任何组件 -->
      <el-table-column label="操作" width="100">
        <template>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="editFormVisible = true"
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
    <el-dialog title="收货地址" :visible.sync="editFormVisible">
      <el-form>
        <el-form-item label="省市区">
          <!-- v-distpicker插件省市区三级联动 -->
          <v-distpicker></v-distpicker>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editFormVisible = false">确 定</el-button>
        <el-button @click="editFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 导入省市区联动组件
import VDistpicker from 'v-distpicker'

export default {
  name: 'orders',
  data() {
    return {
      // 总条数
      total: 0,
      // 将接口需要的数据放在一个对象中方便传递
      sendData: {
        pagenum: 1,
        pagesize: 10
      },
      // 订单信息数组
      orderList: [],
      // 是否显示修改对话框
      editFormVisible: false
    };
  },
  // 本地注册组件
  components: {
    VDistpicker
  },
  methods: {
    // 调用接口获取数据
    async getOrders() {
      let res = await this.$axios.get("orders", {
        params: this.sendData
      });
      // 将获得的数据存入data中
      this.total = res.data.data.total;
      this.orderList = res.data.data.goods;
    },
    // 页码改变事件
    currentChange(current) {
      this.sendData.pagenum = current;
      this.getOrders();
    },
    // 每页容量改变
    sizeChange(size) {
      this.sendData.pagesize = size;
      this.getOrders();
    }
  },
  // 页面一加载就调用查询方法通过接口获取数据
  created() {
    this.getOrders();
  }
};
</script>

<style>
</style>
