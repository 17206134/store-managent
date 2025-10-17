<template>
  <div class="app-container">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="8" animated />
    </div>

    <!-- 订单详情内容 -->
    <div v-else class="order-detail-content">
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
        <el-button
          v-if="
            orderDetail.orderStatus === ORDER_STATUS.PAID &&
            orderDetail.verifyStatus !== VERIFY_STATUS.VERIFIED
          "
          plain
          type="warning"
          size="mini"
          icon="el-icon-circle-check"
          @click="handleVerify"
          v-hasPermi="['operations:order:verify']"
          class="verify-btn"
        >
          核销订单
        </el-button>
      </div>
      <!-- 订单基本信息 -->
      <el-card class="detail-card" shadow="never">
        <div slot="header" class="card-header">
          <i class="el-icon-document"></i>
          <span>订单基本信息</span>
        </div>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="info-item">
              <label>订单ID：</label>
              <span>{{ orderDetail.orderId || "-" }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="info-item">
              <label>订单号：</label>
              <span class="order-no-text">{{
                orderDetail.orderNo || "-"
              }}</span>
              <el-button
                v-if="orderDetail.orderNo"
                type="text"
                size="mini"
                icon="el-icon-document-copy"
                v-clipboard:copy="orderDetail.orderNo"
                v-clipboard:success="clipboardSuccess"
                class="copy-btn"
              >
                复制
              </el-button>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="info-item">
              <label>订单金额：</label>
              <span class="amount-text"
                >¥{{ orderDetail.orderAmount || "0.00" }}</span
              >
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="info-item">
              <label>订单状态：</label>
              <el-tag :type="getOrderStatusType(orderDetail.orderStatus)">
                {{ orderDetail.orderStatusText || "-" }}
              </el-tag>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="info-item">
              <label>支付状态：</label>
              <el-tag :type="getPayStatusType(orderDetail.payStatus)">
                {{ orderDetail.payStatusText || "-" }}
              </el-tag>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="info-item">
              <label>核销状态：</label>
              <el-tag :type="getVerifyStatusType(orderDetail.verifyStatus)">
                {{ orderDetail.verifyStatusText || "-" }}
              </el-tag>
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
              <span>{{ orderDetail.customerName || "-" }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="info-item">
              <label>客户手机号：</label>
              <span>{{ orderDetail.customerPhone || "-" }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="info-item">
              <label>支付方式：</label>
              <span>{{ orderDetail.payTypeText || "-" }}</span>
            </div>
          </el-col>
        </el-row>
      </el-card>

      <!-- 支付信息 -->
      <el-card class="detail-card" shadow="never">
        <div slot="header" class="card-header">
          <i class="el-icon-money"></i>
          <span>支付信息</span>
        </div>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="info-item">
              <label>微信支付订单号：</label>
              <span class="long-text">{{ orderDetail.wxOrderNo || "-" }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="info-item">
              <label>微信支付交易流水号：</label>
              <span class="long-text">{{
                orderDetail.wxTransactionId || "-"
              }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="info-item">
              <label>支付时间：</label>
              <span>{{ orderDetail.payTime || "-" }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="info-item">
              <label>订单过期时间：</label>
              <span>{{ orderDetail.expireTime || "-" }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row v-if="orderDetail.qrCodeUrl">
          <el-col :span="24">
            <div class="info-item">
              <label>支付二维码：</label>
              <div class="qr-code-container">
                <img
                  :src="orderDetail.qrCodeUrl"
                  alt="支付二维码"
                  class="qr-code-image"
                />
              </div>
            </div>
          </el-col>
        </el-row>
      </el-card>

      <!-- 核销信息 -->
      <el-card class="detail-card" shadow="never">
        <div slot="header" class="card-header">
          <i class="el-icon-circle-check"></i>
          <span>核销信息</span>
        </div>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="info-item">
              <label>核销时间：</label>
              <span>{{ orderDetail.verifyTime || "-" }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="info-item">
              <label>核销人：</label>
              <span>{{ orderDetail.verifyBy || "-" }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="info-item">
              <label>创建时间：</label>
              <span>{{ orderDetail.createTime || "-" }}</span>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getOrder, batchVerify } from "@/api/system/order";
import {
  ORDER_STATUS,
  PAY_STATUS,
  VERIFY_STATUS,
  getOrderStatusTagType,
  getPayStatusTagType,
  getVerifyStatusTagType,
} from "@/constants/order";

export default {
  name: "OrderDetail",
  data() {
    return {
      ORDER_STATUS: ORDER_STATUS,
      VERIFY_STATUS: VERIFY_STATUS,
      PAY_STATUS: PAY_STATUS,
      loading: true,
      orderDetail: {},
      orderId: null,
    };
  },
  created() {
    this.orderId = this.$route.params.orderId;
    if (this.orderId) {
      this.getOrderDetail();
    } else {
      this.$modal.msgError("订单ID不能为空");
      this.goBack();
    }
  },
  methods: {
    /** 获取订单详情 */
    getOrderDetail() {
      this.loading = true;
      getOrder(this.orderId)
        .then((response) => {
          this.orderDetail = response.data || {};
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
          this.$modal.msgError("获取订单详情失败");
          this.goBack();
        });
    },

    /** 返回上一页 */
    goBack() {
      this.$router.go(-1);
    },

    /** 复制成功回调 */
    clipboardSuccess() {
      this.$message.success("订单号已复制到剪贴板");
    },

    /** 核销订单 */
    handleVerify() {
      this.$modal
        .confirm("是否确认核销此订单？")
        .then(() => {
          batchVerify([this.orderId]).then(() => {
            this.$modal.msgSuccess("核销成功");
            this.getOrderDetail(); // 刷新详情
          });
        })
        .catch(() => {});
    },

    /** 获取订单状态标签类型 */
    getOrderStatusType(status) {
      return getOrderStatusTagType(status);
    },

    /** 获取支付状态标签类型 */
    getPayStatusType(status) {
      return getPayStatusTagType(status);
    },

    /** 获取核销状态标签类型 */
    getVerifyStatusType(status) {
      return getVerifyStatusTagType(status);
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

// 订单详情内容
.order-detail-content {
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

  .verify-btn {
    color: #67c23a;
    font-size: 14px;
    padding: 8px 12px;

    &:hover {
      color: #85ce61;
      background-color: #f0f9ff;
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

  .order-no-text {
    font-family: "Courier New", monospace;
    font-weight: 600;
    color: #409eff;
    margin-right: 8px;
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

// 二维码容器
.qr-code-container {
  margin-top: 8px;

  .qr-code-image {
    max-width: 200px;
    max-height: 200px;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .order-detail-content {
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
