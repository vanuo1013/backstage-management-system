import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

// 导入组件
import login from "./components/login.vue";
import index from "./components/index.vue";
import users from "./components/users.vue";
import roles from "./components/roles.vue";
import rights from "./components/rights.vue";
import goods from "./components/goods.vue";
import params from "./components/params.vue";
import categories from "./components/categories.vue";
import orders from "./components/orders.vue";
import reports from "./components/reports.vue";
import error from "./components/error.vue";

// 规则
let routes = [
  {
    path: "/error",
    component: error
  },
  {
    path: "/login",
    component: login,
    // 路由元信息
    meta: {
      noLogin: true
    }
  },
  {
    path: "/",
    component: index,
    children: [
      // 路由重定向, 嵌套路由中无需写/
      {
        path: "",
        redirect: "users"
      },
      {
        path: "users",
        component: users
      },
      {
        path: "roles",
        component: roles
      },
      {
        path: "rights",
        component: rights
      },
      {
        path: "goods",
        component: goods
      },
      {
        path: "params",
        component: params
      },
      {
        path: "categories",
        component: categories
      },
      {
        path: "orders",
        component: orders
      },
      {
        path: "reports",
        component: reports
      }
    ]
  }
];

// 实例化路由对象
let router = new VueRouter({
  routes
});

// 注册全局前置导航守卫
router.beforeEach((to, from, next) => {
  // 如果to的matched数组没有长度, 则表示没有这个跳转页
  if (to.matched.length === 0) {
    Vue.prototype.$message.error("输入的地址有误");
    next("/error"); // next括号中没有内容为继续向下执行, 有路径字符串则跳转去该页面
  } else {
    // if (to.path == '/login') {
    if (to.meta.noLogin === true) {
      next(); // 如果是去登录页则直接放行
    } else {
      if (window.sessionStorage.getItem("token")) {
        next(); // 如果有token表示已登录则直接放行
      } else {
        Vue.prototype.$message.error("请先登录");
        next("/login"); // 没有登录则弹框并跳去登录页
      }
    }
  }
});

// 导出暴露
export default router;
