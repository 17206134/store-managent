<template>
  <div class="app-container">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="8" animated />
    </div>

    <!-- 支付流水详情内容 -->
    <div v-else class="pay-detail-content">
      <!-- 页面头部操作栏 -->
      <div class="page-header">
        <el-button
          type="text"
          icon="el-icon-arrow-left"
          @click="goBack"
          class="back-btn"
        >
          返回列表
        </el-button>
      </div>

      <!-- 支付流水基本信息 -->
      <el-card class="detail-card" shadow="never">
        <div slot="header" class="card-header">
          <i class="el-icon-document"></i>
          <span>支付流水基本信息</span>
        </div>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="info-item">
              <label>流水ID：</label>
              <span>{{ recordDetail.recordId || "-" }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="info-item">
              <label>流水号：</label>
              <span class="record-no-text">{{
                recordDetail.recordNo || "-"
              }}</span>
              <el-button
                v-if="recordDetail.recordNo"
                type="text"
                size="mini"
                icon="el-icon-document-copy"
                v-clipboard:copy="recordDetail.recordNo"
                v-clipboard:success="clipboardSuccess"
                class="copy-btn"
              >
                复制
              </el-button>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="info-item">
              <label>支付金额：</label>
              <span class="amount-text"
                >¥{{ recordDetail.payAmount || "0.00" }}</span
              >
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="info-item">
              <label>支付状态：</label>
              <el-tag :type="getPayStatusType(recordDetail.payStatus)">
                {{ recordDetail.payStatusText || "-" }}
              </el-tag>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="info-item">
              <label>支付方式：</label>
              <span>{{ recordDetail.payTypeText || "-" }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="info-item">
              <label>支付时间：</label>
              <span>{{ recordDetail.payTime || "-" }}</span>
            </div>
          </el-col>
        </el-row>
      </el-card>

      <!-- 订单信息 -->
      <el-card class="detail-card" shadow="never">
        <div slot="header" class="card-header">
          <i class="el-icon-s-order"></i>
          <span>关联订单信息</span>
        </div>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="info-item">
              <label>订单ID：</label>
              <span>{{ recordDetail.orderId || "-" }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="info-item">
              <label>订单号：</label>
              <span class="order-no-text">{{
                recordDetail.orderNo || "-"
              }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="info-item">
              <label>订单金额：</label>
              <span class="amount-text"
                >¥{{ recordDetail.orderAmount || "0.00" }}</span
              >
            </div>
          </el-col>
        </el-row>
      </el-card>

      <!-- 客户信息 -->
      <el-card class="detail-card" shadow="never">
        <div slot="header" class="card-header">
          <i class="el-icon-user"></i>
          <span>客户信息</span>
        </div>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="info-item">
              <label>客户姓名：</label>
              <span>{{ recordDetail.customerName || "-" }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="info-item">
              <label>客户手机号：</label>
              <span>{{ recordDetail.customerPhone || "-" }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="info-item">
              <label>客户ID：</label>
              <span>{{ recordDetail.customerId || "-" }}</span>
            </div>
          </el-col>
        </el-row>
      </el-card>

      <!-- 支付平台信息 -->
      <el-card class="detail-card" shadow="never">
        <div slot="header" class="card-header">
          <i class="el-icon-money"></i>
          <span>支付平台信息</span>
        </div>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="info-item">
              <label>微信支付订单号：</label>
              <span class="long-text">{{ recordDetail.wxOrderNo || "-" }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="info-item">
              <label>微信支付交易流水号：</label>
              <span class="long-text">{{
                recordDetail.wxTransactionId || "-"
              }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="info-item">
              <label>支付宝订单号：</label>
              <span class="long-text">{{
                recordDetail.alipayOrderNo || "-"
              }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="info-item">
              <label>支付宝交易流水号：</label>
              <span class="long-text">{{
                recordDetail.alipayTransactionId || "-"
              }}</span>
            </div>
          </el-col>
        </el-row>
      </el-card>

      <!-- 回调信息 -->
      <el-card class="detail-card" shadow="never">
        <div slot="header" class="card-header">
          <i class="el-icon-refresh"></i>
          <span>回调信息</span>
        </div>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="info-item">
              <label>回调状态：</label>
              <el-tag
                :type="getCallbackStatusType(recordDetail.callbackStatus)"
              >
                {{ recordDetail.callbackStatusText || "-" }}
              </el-tag>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="info-item">
              <label>回调时间：</label>
              <span>{{ recordDetail.callbackTime || "-" }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="info-item">
              <label>回调次数：</label>
              <span>{{ recordDetail.callbackCount || "0" }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row v-if="recordDetail.callbackData">
          <el-col :span="24">
            <div class="info-item">
              <label>回调数据：</label>
              <div class="callback-data-container">
                <pre class="callback-data-text">{{
                  recordDetail.callbackData
                }}</pre>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-card>

      <!-- 其他信息 -->
      <el-card class="detail-card" shadow="never">
        <div slot="header" class="card-header">
          <i class="el-icon-info"></i>
          <span>其他信息</span>
        </div>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="info-item">
              <label>创建时间：</label>
              <span>{{ recordDetail.createTime || "-" }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="info-item">
              <label>更新时间：</label>
              <span>{{ recordDetail.updateTime || "-" }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="info-item">
              <label>备注：</label>
              <span>{{ recordDetail.remark || "-" }}</span>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getRecord } from "@/api/system/record";

export default {
  name: "PayDetail",
  data() {
    return {
      loading: true,
      recordDetail: {},
      recordId: null,
    };
  },
  created() {
    this.recordId = this.$route.params.recordNo;
    if (this.recordId) {
      this.getRecordDetail();
    } else {
      this.$modal.msgError("支付流水ID不能为空");
      this.goBack();
    }
  },
  methods: {
    /** 获取支付流水详情 */
    getRecordDetail() {
      this.loading = true;
      getRecord(this.recordId)
        .then((response) => {
          this.recordDetail = response.data || {};
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
          this.$modal.msgError("获取支付流水详情失败");
          this.goBack();
        });
    },

    /** 返回上一页 */
    goBack() {
      this.$router.go(-1);
    },

    /** 复制成功回调 */
    clipboardSuccess() {
      this.$message.success("流水号已复制到剪贴板");
    },

    /** 获取支付状态标签类型 */
    getPayStatusType(status) {
      const statusMap = {
        0: "warning", // 未支付
        1: "success", // 已支付
        2: "danger", // 支付失败
        3: "info", // 已退款
      };
      return statusMap[status] || "info";
    },

    /** 获取回调状态标签类型 */
    getCallbackStatusType(status) {
      const statusMap = {
        0: "warning", // 未回调
        1: "success", // 回调成功
        2: "danger", // 回调失败
      };
      return statusMap[status] || "info";
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  min-height: calc(100vh - 84px);
  background-color: #f5f5f5;
  padding: 0;
}

// 加载状态
.loading-container {
  padding: 24px;
  margin: 0 auto;
}

// 支付流水详情内容
.pay-detail-content {
  padding: 24px;
  margin: 0 auto;
}

// 页面头部操作栏
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  border-bottom: 1px solid #e8e8e8;

  .back-btn {
    color: #409eff;
    font-size: 16px;
    padding: 8px 12px;

    &:hover {
      color: #66b1ff;
      background-color: #ecf5ff;
    }

    i {
      margin-right: 4px;
    }
  }
}

// 详情卡片
.detail-card {
  margin-bottom: 20px;
  border-radius: 8px;
  border: 1px solid #e8e8e8;

  .card-header {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 600;
    color: #333;

    i {
      margin-right: 8px;
      color: #409eff;
      font-size: 18px;
    }
  }
}

// 信息项
.info-item {
  margin-bottom: 16px;

  label {
    display: inline-block;
    width: 160px;
    color: #666;
    font-weight: 500;
    margin-right: 8px;
    text-align: right;
  }

  span {
    color: #333;
    font-size: 14px;
  }

  .record-no-text {
    font-family: "Courier New", monospace;
    font-weight: 600;
    color: #409eff;
    margin-right: 8px;
  }

  .order-no-text {
    font-family: "Courier New", monospace;
    font-weight: 600;
    color: #67c23a;
  }

  .copy-btn {
    color: #409eff;
    font-size: 12px;
    padding: 2px 6px;

    &:hover {
      color: #66b1ff;
      background-color: #ecf5ff;
    }
  }

  .amount-text {
    font-size: 16px;
    font-weight: 600;
    color: #f56c6c;
  }

  .long-text {
    word-break: break-all;
    font-family: "Courier New", monospace;
    font-size: 12px;
  }
}

// 回调数据容器
.callback-data-container {
  margin-top: 8px;
  max-width: 100%;
  overflow-x: auto;

  .callback-data-text {
    background-color: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 4px;
    padding: 12px;
    font-family: "Courier New", monospace;
    font-size: 12px;
    line-height: 1.4;
    color: #495057;
    white-space: pre-wrap;
    word-break: break-all;
    max-height: 200px;
    overflow-y: auto;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .pay-detail-content {
    padding: 16px;
  }

  .info-item {
    label {
      width: 100px;
      font-size: 13px;
    }
  }
}
</style>
