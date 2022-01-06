<template>
  <el-row class="home" :getter="20">
    <!-- 左侧 -->
    <el-col :span="8" style="margin-top: 20px" v-loading="loading">
      <el-card shadow="hover">
        <div class="user">
          <img :src="avatar" />
          <div class="userinfo">
            <p class="name">{{ username }}</p>
            <span class="access" v-for="(item ,index) in roleNames">{{ item }}
                <span v-if="index != roleNames.length-1">、</span>
                </span>
          </div>
        </div>
        <div class="login-info">
          <p>
            上次登录时间：<span>{{ lastLogin }}</span>
          </p>
          <p>
            上次登录地点：<span>{{ city }}</span>
          </p>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      avatar: "",
      username: "",
      roleNames: [],
      lastLogin: "",
      city: "",
      tableData: [],
      tableLabel: {
        name: "课程",
        totalBuy: "今日购买",
        monthBuy: "本月购买",
        totalBuy: "总购买",
      },
      countData: [
        {
          name: "今日支付订单1",
          value: 1234,
          icon: "success",
          color: "#2ec7c9",
        },
        {
          name: "今日收藏订单2",
          value: 120,
          icon: "star-on",
          color: "#ffb980",
        },
        {
          name: "今日未支付订单1",
          value: 1234,
          icon: "s-goods",
          color: "#5ab1ef",
        },
        {
          name: "今日支付订单2",
          value: 120,
          icon: "success",
          color: "#2ec7c9",
        },
        {
          name: "今日收藏订单1",
          value: 1234,
          icon: "star-on",
          color: "#ffb980",
        },
        {
          name: "今日未支付订单2",
          value: 1234,
          icon: "s-goods",
          color: "#5ab1ef",
        },
      ],
      echartsData: {
        order: {
          legend: {
            textStyle: {
              color: "#333",
            },
          },
          grid: {
            left: "20%",
          },
          tooltip: {
            trigger: "axis",
          },
          xAxis: {
            type: "category",
            data: [],
            axisLine: {
              LineStyle: {
                color: "#17b3a3",
              },
            },
            axisLable: {
              interval: 0,
              color: "#333",
            },
          },
          yAxis: [
            {
              type: "value",
              axisLine: {
                LineStyle: {
                  color: "#17b3a3",
                },
              },
            },
          ],
          color: [
            "#2ec7c9",
            "#b6a2de",
            "#5ab1ef",
            "#fffb980",
            "#d87a80",
            "#8d98b3",
          ],
          series: [],
        },
        user: {
          //图例文字颜色
          legend: {
            textStyle: {
              color: "#333",
            },
          },
          grid: {
            left: "20%",
          },
          tooltip: {
            trigger: "axis",
          },
          xAxis: {
            type: "category", //类目轴
            data: [],
            axisLine: {
              LineStyle: {
                color: "#17b3a3",
              },
            },
            axisLable: {
              interval: 0,
              color: "#333",
            },
          },
          yAxis: [
            {
              type: "value",
              axisLine: {
                LineStyle: {
                  color: "#17b3a3",
                },
              },
            },
          ],
          color: ["#2ec7c9", "#b6a2de"],
          series: [],
        },
        video: {
          tooltip: {
            trigger: "item",
          },
          color: [
            "#0f78f4",
            "#dd536b",
            "#9462e5",
            "#a6a6a6",
            "#e1bb22",
            "#39c362",
            "#3ed1cf",
          ],
          series: [],
        },
      },
    };
  },

  methods: {
    getUserIndex() {
      var userId = localStorage.getItem("userId");
      this.$axios.get("/sys/user/user-index/" + userId).then((res) => {
        this.roleNames = res.data.data.roleNames;
        this.username = res.data.data.username;
        this.lastLogin = res.data.data.lastLogin;
        this.city = res.data.data.city;
        this.avatar = res.data.data.avatar;
        this.loading = false;
      });
    },
  },

  mounted() {
    this.getUserIndex();
  },
};
</script>
<style lang="scss">
@import "../assets/scss/home.scss";
</style>