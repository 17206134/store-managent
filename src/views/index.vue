<template>
  <div class="app-container dashboard">
    <!-- 页面标题 -->
    <div class="dashboard-header">
      <h1 class="dashboard-title">柏悦售卡系统数据看板</h1>
      <p class="dashboard-subtitle">实时监控门店运营数据，助力业务决策</p>
    </div>

    <!-- 关键指标卡片 -->
    <el-row :gutter="20" class="metrics-row">
      <el-col :xs="24" :sm="12" :md="6" :lg="6">
        <div class="metric-card">
          <div class="metric-icon">
            <i class="el-icon-s-shop"></i>
          </div>
          <div class="metric-content">
            <div class="metric-value">{{ dashboardData.totalStores }}</div>
            <div class="metric-label">门店总数</div>
            <div class="metric-trend positive">
              <i class="el-icon-top"></i>
              <span>+12.5%</span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6" :lg="6">
        <div class="metric-card">
          <div class="metric-icon">
            <i class="el-icon-s-order"></i>
          </div>
          <div class="metric-content">
            <div class="metric-value">{{ dashboardData.todayOrders }}</div>
            <div class="metric-label">今日订单</div>
            <div class="metric-trend positive">
              <i class="el-icon-top"></i>
              <span>+8.3%</span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6" :lg="6">
        <div class="metric-card">
          <div class="metric-icon">
            <i class="el-icon-coin"></i>
          </div>
          <div class="metric-content">
            <div class="metric-value">{{ dashboardData.todayRevenue }}</div>
            <div class="metric-label">今日营收</div>
            <div class="metric-trend positive">
              <i class="el-icon-top"></i>
              <span>+15.2%</span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6" :lg="6">
        <div class="metric-card">
          <div class="metric-icon">
            <i class="el-icon-user"></i>
          </div>
          <div class="metric-content">
            <div class="metric-value">
              {{ dashboardData.activeConsultants }}
            </div>
            <div class="metric-label">活跃顾问</div>
            <div class="metric-trend negative">
              <i class="el-icon-bottom"></i>
              <span>-2.1%</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="charts-row">
      <!-- 销售趋势图 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <el-card class="chart-card">
          <div slot="header" class="card-header">
            <span class="card-title">
              <i class="el-icon-s-data"></i>
              销售趋势
            </span>
            <el-radio-group
              v-model="salesTimeRange"
              size="mini"
              @change="updateSalesChart"
            >
              <el-radio-button label="7d">7天</el-radio-button>
              <el-radio-button label="30d">30天</el-radio-button>
              <el-radio-button label="90d">90天</el-radio-button>
            </el-radio-group>
          </div>
          <div ref="salesChart" class="chart-container"></div>
        </el-card>
      </el-col>

      <!-- 门店分布图 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <el-card class="chart-card">
          <div slot="header" class="card-header">
            <span class="card-title">
              <i class="el-icon-location"></i>
              门店分布
            </span>
          </div>
          <div ref="storeChart" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 数据表格区域 -->
    <el-row :gutter="20" class="tables-row">
      <!-- 热门流量卡 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <el-card class="table-card">
          <div slot="header" class="card-header">
            <span class="card-title">
              <i class="el-icon-s-goods"></i>
              热门流量卡
            </span>
            <el-button type="text" size="mini" @click="refreshHotCards">
              <i class="el-icon-refresh"></i>
              刷新
            </el-button>
          </div>
          <el-table :data="hotCards" stripe>
            <el-table-column prop="cardName" label="卡种名称" min-width="120">
              <template slot-scope="scope">
                <el-tag
                  size="mini"
                  :type="getCardTypeColor(scope.row.cardType)"
                >
                  {{ scope.row.cardName }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="salesCount"
              label="销量"
              width="80"
              align="center"
            >
              <template slot-scope="scope">
                <span class="sales-count">{{ scope.row.salesCount }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="revenue"
              label="营收"
              width="100"
              align="center"
            >
              <template slot-scope="scope">
                <span class="revenue">¥{{ scope.row.revenue }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="growth"
              label="增长率"
              width="80"
              align="center"
            >
              <template slot-scope="scope">
                <span
                  :class="
                    scope.row.growth >= 0
                      ? 'growth-positive'
                      : 'growth-negative'
                  "
                >
                  {{ scope.row.growth >= 0 ? "+" : "" }}{{ scope.row.growth }}%
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <!-- 门店排行榜 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <el-card class="table-card">
          <div slot="header" class="card-header">
            <span class="card-title">
              <i class="el-icon-trophy"></i>
              门店排行榜
            </span>
            <el-button type="text" size="mini" @click="refreshStoreRanking">
              <i class="el-icon-refresh"></i>
              刷新
            </el-button>
          </div>
          <el-table :data="storeRanking" stripe>
            <el-table-column prop="rank" label="排名" width="60" align="center">
              <template slot-scope="scope">
                <span :class="getRankClass(scope.row.rank)">{{
                  scope.row.rank
                }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="storeName" label="门店名称" min-width="120">
              <template slot-scope="scope">
                <div class="store-info">
                  <div class="store-name">{{ scope.row.storeName }}</div>
                  <div class="store-location">{{ scope.row.location }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="orders"
              label="订单数"
              width="80"
              align="center"
            >
              <template slot-scope="scope">
                <span class="order-count">{{ scope.row.orders }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="revenue"
              label="营收"
              width="100"
              align="center"
            >
              <template slot-scope="scope">
                <span class="revenue">¥{{ scope.row.revenue }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- 实时数据区域 -->
    <el-row :gutter="20" class="realtime-row">
      <!-- 实时订单 -->
      <el-col :xs="24" :sm="24" :md="8" :lg="8">
        <el-card class="realtime-card">
          <div slot="header" class="card-header">
            <span class="card-title">
              <i class="el-icon-s-order"></i>
              实时订单
            </span>
            <el-tag
              :type="realtimeData.isOnline ? 'success' : 'danger'"
              size="mini"
            >
              {{ realtimeData.isOnline ? "在线" : "离线" }}
            </el-tag>
          </div>
          <div class="realtime-content">
            <div class="realtime-item">
              <span class="realtime-label">待处理订单</span>
              <span class="realtime-value pending">{{
                realtimeData.pendingOrders
              }}</span>
            </div>
            <div class="realtime-item">
              <span class="realtime-label">处理中订单</span>
              <span class="realtime-value processing">{{
                realtimeData.processingOrders
              }}</span>
            </div>
            <div class="realtime-item">
              <span class="realtime-label">已完成订单</span>
              <span class="realtime-value completed">{{
                realtimeData.completedOrders
              }}</span>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 咨询顾问状态 -->
      <el-col :xs="24" :sm="24" :md="8" :lg="8">
        <el-card class="realtime-card">
          <div slot="header" class="card-header">
            <span class="card-title">
              <i class="el-icon-user"></i>
              咨询顾问状态
            </span>
          </div>
          <div class="consultant-status">
            <div class="status-item">
              <div class="status-dot online"></div>
              <span class="status-label">在线</span>
              <span class="status-count">{{ consultantStatus.online }}</span>
            </div>
            <div class="status-item">
              <div class="status-dot busy"></div>
              <span class="status-label">忙碌</span>
              <span class="status-count">{{ consultantStatus.busy }}</span>
            </div>
            <div class="status-item">
              <div class="status-dot offline"></div>
              <span class="status-label">离线</span>
              <span class="status-count">{{ consultantStatus.offline }}</span>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 系统状态 -->
      <el-col :xs="24" :sm="24" :md="8" :lg="8">
        <el-card class="realtime-card">
          <div slot="header" class="card-header">
            <span class="card-title">
              <i class="el-icon-monitor"></i>
              系统状态
            </span>
          </div>
          <div class="system-status">
            <div class="status-item">
              <span class="status-label">CPU使用率</span>
              <el-progress
                :percentage="systemStatus.cpu"
                :color="getProgressColor(systemStatus.cpu)"
              ></el-progress>
            </div>
            <div class="status-item">
              <span class="status-label">内存使用率</span>
              <el-progress
                :percentage="systemStatus.memory"
                :color="getProgressColor(systemStatus.memory)"
              ></el-progress>
            </div>
            <div class="status-item">
              <span class="status-label">磁盘使用率</span>
              <el-progress
                :percentage="systemStatus.disk"
                :color="getProgressColor(systemStatus.disk)"
              ></el-progress>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "Index",
  data() {
    return {
      // 销售趋势时间范围
      salesTimeRange: "7d",

      // 看板数据
      dashboardData: {
        totalStores: 156,
        todayOrders: 1247,
        todayRevenue: "89.6万",
        activeConsultants: 23,
      },

      // 热门流量卡数据
      hotCards: [
        {
          cardName: "5G无限流量卡",
          cardType: "premium",
          salesCount: 456,
          revenue: "45600",
          growth: 12.5,
        },
        {
          cardName: "4G月租卡",
          cardType: "standard",
          salesCount: 389,
          revenue: "23340",
          growth: 8.3,
        },
        {
          cardName: "校园专享卡",
          cardType: "student",
          salesCount: 234,
          revenue: "14040",
          growth: -2.1,
        },
        {
          cardName: "企业定制卡",
          cardType: "enterprise",
          salesCount: 156,
          revenue: "31200",
          growth: 15.2,
        },
        {
          cardName: "家庭共享卡",
          cardType: "family",
          salesCount: 123,
          revenue: "18450",
          growth: 6.8,
        },
      ],

      // 门店排行榜数据
      storeRanking: [
        {
          rank: 1,
          storeName: "北京朝阳店",
          location: "北京市朝阳区",
          orders: 89,
          revenue: "15600",
        },
        {
          rank: 2,
          storeName: "上海浦东店",
          location: "上海市浦东新区",
          orders: 76,
          revenue: "13200",
        },
        {
          rank: 3,
          storeName: "广州天河店",
          location: "广州市天河区",
          orders: 68,
          revenue: "11800",
        },
        {
          rank: 4,
          storeName: "深圳南山店",
          location: "深圳市南山区",
          orders: 62,
          revenue: "10800",
        },
        {
          rank: 5,
          storeName: "杭州西湖店",
          location: "杭州市西湖区",
          orders: 58,
          revenue: "9800",
        },
      ],

      // 实时数据
      realtimeData: {
        isOnline: true,
        pendingOrders: 23,
        processingOrders: 45,
        completedOrders: 1179,
      },

      // 咨询顾问状态
      consultantStatus: {
        online: 15,
        busy: 6,
        offline: 2,
      },

      // 系统状态
      systemStatus: {
        cpu: 45,
        memory: 68,
        disk: 32,
      },
    };
  },

  mounted() {
    this.initCharts();
    this.startRealTimeUpdate();
  },

  beforeDestroy() {
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
    }
  },

  methods: {
    // 初始化图表
    initCharts() {
      this.initSalesChart();
      this.initStoreChart();
    },

    // 初始化销售趋势图
    initSalesChart() {
      const chart = echarts.init(this.$refs.salesChart);
      const option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
        },
        legend: {
          data: ["订单数量", "营收金额"],
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        },
        yAxis: [
          {
            type: "value",
            name: "订单数量",
            position: "left",
          },
          {
            type: "value",
            name: "营收(万元)",
            position: "right",
          },
        ],
        series: [
          {
            name: "订单数量",
            type: "line",
            data: [120, 132, 101, 134, 90, 230, 210],
            smooth: true,
            itemStyle: {
              color: "#409EFF",
            },
          },
          {
            name: "营收金额",
            type: "bar",
            yAxisIndex: 1,
            data: [2.0, 2.2, 1.8, 2.4, 1.6, 3.2, 2.8],
            itemStyle: {
              color: "#67C23A",
            },
          },
        ],
      };
      chart.setOption(option);

      // 响应式调整
      window.addEventListener("resize", () => {
        chart.resize();
      });
    },

    // 初始化门店分布图
    initStoreChart() {
      const chart = echarts.init(this.$refs.storeChart);
      const option = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: "门店分布",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "18",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              { value: 45, name: "华北地区" },
              { value: 38, name: "华东地区" },
              { value: 28, name: "华南地区" },
              { value: 25, name: "西南地区" },
              { value: 20, name: "其他地区" },
            ],
          },
        ],
      };
      chart.setOption(option);

      // 响应式调整
      window.addEventListener("resize", () => {
        chart.resize();
      });
    },

    // 更新销售趋势图
    updateSalesChart() {
      // 这里可以根据选择的时间范围更新图表数据
      console.log("更新销售趋势图:", this.salesTimeRange);
    },

    // 获取卡片类型颜色
    getCardTypeColor(type) {
      const colorMap = {
        premium: "danger",
        standard: "primary",
        student: "success",
        enterprise: "warning",
        family: "info",
      };
      return colorMap[type] || "primary";
    },

    // 获取排名样式
    getRankClass(rank) {
      if (rank <= 3) {
        return `rank-top-${rank}`;
      }
      return "rank-normal";
    },

    // 获取进度条颜色
    getProgressColor(percentage) {
      if (percentage < 50) return "#67C23A";
      if (percentage < 80) return "#E6A23C";
      return "#F56C6C";
    },

    // 刷新热门流量卡数据
    refreshHotCards() {
      this.$message.success("数据已刷新");
      // 这里可以调用API刷新数据
    },

    // 刷新门店排行榜数据
    refreshStoreRanking() {
      this.$message.success("数据已刷新");
      // 这里可以调用API刷新数据
    },

    // 开始实时数据更新
    startRealTimeUpdate() {
      this.updateTimer = setInterval(() => {
        // 模拟实时数据更新
        this.realtimeData.pendingOrders = Math.floor(Math.random() * 30) + 15;
        this.realtimeData.processingOrders =
          Math.floor(Math.random() * 20) + 40;
        this.systemStatus.cpu = Math.floor(Math.random() * 30) + 30;
        this.systemStatus.memory = Math.floor(Math.random() * 20) + 60;
        this.systemStatus.disk = Math.floor(Math.random() * 15) + 25;
      }, 5000);
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 84px);
}

// 页面标题
.dashboard-header {
  margin-bottom: 24px;
  text-align: center;

  .dashboard-title {
    font-size: 28px;
    font-weight: 600;
    color: #303133;
    margin: 0 0 8px 0;
  }

  .dashboard-subtitle {
    font-size: 14px;
    color: #909399;
    margin: 0;
  }
}

// 指标卡片
.metrics-row {
  margin-bottom: 24px;
}

.metric-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 24px;
  color: white;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }

  &:nth-child(2) {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  }

  &:nth-child(3) {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  }

  &:nth-child(4) {
    background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  }

  .metric-icon {
    font-size: 32px;
    margin-right: 16px;
    opacity: 0.9;
  }

  .metric-content {
    flex: 1;

    .metric-value {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 4px;
    }

    .metric-label {
      font-size: 14px;
      opacity: 0.9;
      margin-bottom: 8px;
    }

    .metric-trend {
      font-size: 12px;
      display: flex;
      align-items: center;

      &.positive {
        color: #67c23a;
      }

      &.negative {
        color: #f56c6c;
      }

      i {
        margin-right: 4px;
      }
    }
  }
}

// 图表区域
.charts-row {
  margin-bottom: 24px;
}

.chart-card {
  height: 400px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .card-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
      display: flex;
      align-items: center;

      i {
        margin-right: 8px;
        color: #409eff;
      }
    }
  }

  .chart-container {
    height: 320px;
    width: 100%;
  }
}

// 表格区域
.tables-row {
  margin-bottom: 24px;
}

.table-card {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .card-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
      display: flex;
      align-items: center;

      i {
        margin-right: 8px;
        color: #409eff;
      }
    }
  }
}

// 表格样式
.sales-count {
  font-weight: 600;
  color: #409eff;
}

.revenue {
  font-weight: 600;
  color: #67c23a;
}

.growth-positive {
  color: #67c23a;
  font-weight: 600;
}

.growth-negative {
  color: #f56c6c;
  font-weight: 600;
}

.store-info {
  .store-name {
    font-weight: 600;
    color: #303133;
  }

  .store-location {
    font-size: 12px;
    color: #909399;
  }
}

.order-count {
  font-weight: 600;
  color: #e6a23c;
}

// 排名样式
.rank-top-1 {
  color: #ffd700;
  font-weight: 700;
  font-size: 16px;
}

.rank-top-2 {
  color: #c0c0c0;
  font-weight: 700;
  font-size: 16px;
}

.rank-top-3 {
  color: #cd7f32;
  font-weight: 700;
  font-size: 16px;
}

.rank-normal {
  font-weight: 600;
  color: #606266;
}

// 实时数据区域
.realtime-row {
  margin-bottom: 24px;
}

.realtime-card {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .card-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
      display: flex;
      align-items: center;

      i {
        margin-right: 8px;
        color: #409eff;
      }
    }
  }
}

.realtime-content {
  .realtime-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #ebeef5;

    &:last-child {
      border-bottom: none;
    }

    .realtime-label {
      font-size: 14px;
      color: #606266;
    }

    .realtime-value {
      font-size: 18px;
      font-weight: 700;

      &.pending {
        color: #e6a23c;
      }

      &.processing {
        color: #409eff;
      }

      &.completed {
        color: #67c23a;
      }
    }
  }
}

.consultant-status {
  .status-item {
    display: flex;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #ebeef5;

    &:last-child {
      border-bottom: none;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-right: 12px;

      &.online {
        background-color: #67c23a;
      }

      &.busy {
        background-color: #e6a23c;
      }

      &.offline {
        background-color: #909399;
      }
    }

    .status-label {
      flex: 1;
      font-size: 14px;
      color: #606266;
    }

    .status-count {
      font-size: 16px;
      font-weight: 700;
      color: #303133;
    }
  }
}

.system-status {
  .status-item {
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }

    .status-label {
      display: block;
      font-size: 14px;
      color: #606266;
      margin-bottom: 8px;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .dashboard {
    padding: 12px;
  }

  .dashboard-header {
    .dashboard-title {
      font-size: 24px;
    }
  }

  .metric-card {
    padding: 16px;
    margin-bottom: 16px;

    .metric-icon {
      font-size: 24px;
      margin-right: 12px;
    }

    .metric-content {
      .metric-value {
        font-size: 24px;
      }
    }
  }

  .chart-card {
    height: 300px;
    margin-bottom: 16px;

    .chart-container {
      height: 220px;
    }
  }

  .table-card {
    margin-bottom: 16px;
  }

  .realtime-card {
    margin-bottom: 16px;
  }
}
</style>
