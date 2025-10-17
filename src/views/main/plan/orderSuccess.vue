<template>
  <!-- 主内容区 -->
  <div class="success-card">
    <div class="success-icon">
      <div class="checkmark-circle">
        <svg class="checkmark" viewBox="0 0 52 52">
          <circle
            class="checkmark__circle"
            cx="26"
            cy="26"
            r="25"
            fill="none"
          />
          <path
            class="checkmark__check"
            fill="none"
            d="M14.1 27.2l7.1 7.2 16.7-16.8"
          />
        </svg>
      </div>
    </div>

    <h1 class="success-title">支付成功！</h1>
    <!-- 订单信息卡片 -->
    <div class="order-details-card">
      <h2 class="details-title">订单信息</h2>
      <div class="info-row">
        <div class="info-label">订单编号：</div>
        <div class="info-value">{{ orderInfo.orderId || "-" }}</div>
      </div>
      <div class="info-row">
        <div class="info-label">商品名称：</div>
        <div class="info-value" v-if="orderInfo.flowCard">
          {{ orderInfo.flowCard.cardName || "-" }}
        </div>
      </div>
      <div class="info-row">
        <div class="info-label">支付时间：</div>
        <div class="info-value">{{ orderInfo.payTime || "-" }}</div>
      </div>
      <div class="info-row">
        <div class="info-label">支付金额：</div>
        <div class="info-value">¥{{ orderInfo.orderAmount }}</div>
      </div>

      <div class="info-row">
        <div class="info-label">客户姓名：</div>
        <div class="info-value">{{ orderInfo.customerName || "-" }}</div>
      </div>

      <div class="info-row">
        <div class="info-label">客户手机号：</div>
        <div class="info-value">{{ orderInfo.customerPhone || "-" }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getOrder } from "@/api/system/order";
export default {
  name: "VirtualProductPaymentSuccess",
  data() {
    return {
      // 虚拟商品订单信息
      orderInfo: {},
      orderId: null,
    };
  },
  methods: {},
  created() {
    this.orderId = this.$route.params.orderId;
    console.log(this.orderId, "鞋带过来的信息");
    if (this.orderId) {
      this.getOrderInfo();
    }
  },
  methods: {
    getOrderInfo() {
      getOrder(this.orderId)
        .then((response) => {
          this.orderInfo = response.data || {};
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
          this.$modal.msgError("获取订单详情失败");
          this.goBack();
        });
    },
  },
  mounted() {
    // 页面加载时添加动画类
    setTimeout(() => {
      document.querySelector(".checkmark-circle").classList.add("animate");
    }, 100);
  },
};
</script>

<style lang="scss" scoped>
// 变量定义
$primary-color: #7e57c2;
$primary-light: #f8f5ff;
$primary-dark: #6a45b2;
$text-color: #333;
$text-secondary: #666;
$text-tertiary: #999;
$border-color: #eee;
$bg-light: #f5f7fa;
$bg-white: #fff;
$bg-gray: #f8fafc;
$success-color: #4cd964;

// 混合器
@mixin transition($property: all, $duration: 0.3s, $timing: ease) {
  transition: $property $duration $timing;
}

@mixin shadow($params) {
  box-shadow: $params;
}

.success-card {
  max-width: 600px;
  min-height: 100vh;
  background-color: $bg-white;
  border-radius: 12px;
  @include shadow(0 5px 20px rgba(0, 0, 0, 0.05));
  padding: 96px 24px 48px;
  text-align: center;
}

// 成功图标样式
.success-icon {
  margin-bottom: 30px;
}

.checkmark-circle {
  width: 100px;
  height: 100px;
  margin: 0 auto;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
  @include transition;

  &.animate {
    border-color: $success-color;

    .checkmark {
      transform: scale(1);
    }
  }
}

.checkmark {
  width: 100px;
  height: 100px;
  transform: scale(0);
  @include transition(transform 0.3s ease-in-out);
}

.checkmark__circle {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 2;
  stroke: $success-color;
  fill: none;
  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.checkmark__check {
  transform-origin: 50% 50%;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  stroke: $success-color;
  stroke-width: 2;
  animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.6s forwards;
}

@keyframes stroke {
  100% {
    stroke-dashoffset: 0;
  }
}

.success-title {
  font-size: 24px;
  color: $text-color;
  margin-bottom: 24px;
  font-weight: 600;
}
// 订单信息卡片
.order-details-card {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  text-align: left;
  border: 1px solid $border-color;

  .details-title {
    font-size: 24px;
    margin: 10px 0 25px;
    color: $text-color;
    font-weight: 600;
    padding-bottom: 15px;
    border-bottom: 1px solid $border-color;
  }

  .info-row {
    display: flex;
    margin-bottom: 18px;
    align-items: center;

    .info-label {
      min-width: 100px;
      text-align: right;
      color: $text-secondary;
      font-size: 16px;
      line-height: 21px;
    }

    .info-value {
      flex: 1;
      color: $text-color;
      line-height: 21px;
      font-size: 14px;
      word-break: break-all;
    }
  }
}
</style>
