<template>
  <div class="reports">
    <!-- 面包屑导航 -->
    <bread sectitle="数据统计" threetitle="数据报表"></bread>
    <!-- echarts容器 -->
    <div id="main" style="width: 85vw;height:80vh;"></div>
  </div>
</template>

<script>
// 引入百度的echarts数据可视化插件
import echarts from "echarts";

export default {
  name: "reports",
  data() {
    return {
      // 图表数据
      option: {
        title: {
          text: "用户数据来源"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        legend: {
          data: ["邮件营销", "联盟广告", "视频广告", "直接访问", "搜索引擎"]
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "邮件营销",
            type: "line",
            stack: "总量",
            areaStyle: {},
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: "联盟广告",
            type: "line",
            stack: "总量",
            areaStyle: {},
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: "视频广告",
            type: "line",
            stack: "总量",
            areaStyle: {},
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: "直接访问",
            type: "line",
            stack: "总量",
            areaStyle: { normal: {} },
            data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
            name: "搜索引擎",
            type: "line",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: "top"
              }
            },
            areaStyle: { normal: {} },
            data: [820, 932, 901, 934, 1290, 1330, 1320]
          }
        ]
      }
    };
  },
  // 挂载完成后的生命周期钩子, 这里才能访问到dom元素
  async mounted() {
    // 获取容器元素, 查看官方文档
    var myChart = echarts.init(document.getElementById("main"));
    // 调用接口获取服务器数据
    let res = await this.$axios.get("reports/type/1");
    // 遍历并合并数据
    for (const key in res.data.data) {
      this.option[key] = res.data.data[key];
    }
    // 由于合并后x轴存在空白, 查文档将x轴是否留白属性追加上
    this.option.xAxis[0].boundaryGap = false
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(this.option);
  }
};
</script>

<style>
#main {
  margin-top: 20px;
}
</style>