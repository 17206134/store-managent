<template>
  <div class="app-container">
    <!-- 主内容区 -->
    <div class="main-content" v-show="orderStatus == '0'">
      <van-form @submit="onSubmit" class="form-container">
        <!-- 表单标题区 -->
        <div class="form-header">
          <div class="time-flex">
            <h2 class="time-title">订单剩余时间：</h2>
            <div class="countdown-section">
              <van-count-down :time="remainingSeconds" @finish="timeFinish">
                <template #default="timeData">
                  <div class="countdown-container">
                    <span class="time-box">{{ timeData.hours | addZero }}</span>
                    <span class="time-separator">时</span>
                    <span class="time-box">{{
                      timeData.minutes | addZero
                    }}</span>
                    <span class="time-separator">分</span>
                    <span class="time-box">{{
                      timeData.seconds | addZero
                    }}</span>
                    <span class="time-separator">秒</span>
                  </div>
                </template>
              </van-count-down>
            </div>
          </div>
          <h2 class="form-title">请尽快填写您的信息</h2>
          <p class="form-desc">
            带 <span class="required-mark">*</span> 为必填项
          </p>
        </div>
        <van-field
          v-model="form.customerName"
          name="客户姓名"
          class="info-field"
          placeholder="请输入您的姓名"
        >
          <template #label>
            <span>客户名称</span>
            <span class="required-mark">*</span>
          </template>
        </van-field>
        <van-field
          v-model="form.customerPhone"
          name="客户手机号"
          class="info-field"
          type="number"
          maxLength="11"
          placeholder="请输入您的手机号"
        >
          <template #label>
            <span>客户电话</span>
            <span class="required-mark">*</span>
          </template>
        </van-field>
        <!-- 提交按钮区域 -->
        <div class="submit-container">
          <van-button
            round
            block
            type="info"
            native-type="submit"
            :disabled="!form.customerName || !form.customerPhone"
            class="submit-btn"
          >
            确认并下单
          </van-button>
        </div>
      </van-form>
    </div>
    <div v-show="orderStatus == '2'">
      <div class="expired-content">
        <div class="expired-icon">
          <div class="checkmark-circle">
            <svg class="checkmark" viewBox="0 0 44 44">
              <circle
                class="cross__circle"
                cx="22"
                cy="22"
                r="20"
                fill="none"
              />
              <path
                class="checkmark__check"
                fill="none"
                d="M14 14l16 16M30 14L14 30"
              />
            </svg>
          </div>
        </div>
        <h1 class="expired-title">订单已失效</h1>
        <p class="expired-message">很抱歉，该订单已超过支付时间或已被取消</p>
      </div>
    </div>
  </div>
</template>
<script>
import { checkOrderStatus } from "@/api/system/order";
import { paymentGenerate } from "@/api/system/payment";
import { Dialog } from "vant";
export default {
  name: "PlanCode",
  data() {
    return {
      remainingSeconds: 10000 * 60 * 60 * 1000, // 订单剩余时间
      orderStatus: null, // 订单状态 0=待支付,1=已支付,2=已取消,3=已退款,4=已完成
      orderId: null,
      btnLoading: false, // 防重复点击loading
      form: {
        customerName: "",
        customerPhone: "",
      },
    };
  },
  filters: {
    addZero(val) {
      return String(val).padStart(2, 0);
    },
  },
  created() {
    const { id } = this.$route.params;
    console.log(this.$route.params, "获取的订单号");
    if (id) {
      this.orderId = id;
      checkOrderStatus(id).then((res) => {
        console.log("获取的订单的信息", res);
        const { remainingSeconds, orderStatus } = res.data;
        this.remainingSeconds = (remainingSeconds || 0) * 1000;
        this.orderStatus = orderStatus;
        if (["1", "3", "4"].includes(orderStatus)) {
          const textMap = {
            1: "该订单已支付完成",
            3: "该订单已完成退款",
            4: "该订单已完成",
          };
          Dialog.alert({
            title: "提示",
            message: textMap[orderStatus],
            showConfirmButton: false,
            showCancelButton: false,
          });
        }
      });
    } else {
      this.$modal.msgError("没有查到该订单信息");
    }
  },
  mounted() {
    // 页面加载时添加动画类
    setTimeout(() => {
      document.querySelector(".checkmark-circle").classList.add("animate");
    }, 100);
  },
  methods: {
    onSubmit() {
      if (this.btnLoading) return;
      this.btnLoading = true;
      paymentGenerate({
        ...this.form,
        orderId: this.orderId,
      })
        .then((res) => {
          console.log(res, "生成订单页面");
          if (res.data?.paymentRecord && res.data?.flowCard) {
            const {
              orderId,
              createTime,
              payAmount,
              customerName,
              customerPhone,
            } = res.data.paymentRecord;
            const { cardName } = res.data.flowCard;
            this.$router.replace({
              path: "/orderSuccess",
              query: {
                info: JSON.stringify({
                  orderId,
                  createTime,
                  payAmount,
                  cardName,
                  customerName,
                  customerPhone,
                }),
              },
            });
          }
        })
        .finally(() => {
          this.btnLoading = false;
        });
    },
    timeFinish() {
      console.log("倒计时结束");
      this.orderStatus = "2"; // 倒计时结束，前端设置成已取消订单页面
    },
  },
};
</script>
<style lang="scss" scoped>
// 变量定义
$primary-color: #3b82f6;
$primary-light: #ebf4ff;
$primary-border: #dbeafe;
$text-primary: #1e293b;
$text-secondary: #64748b;
$text-disabled: #94a3b8;
$border-color: #e2e8f0;
$bg-gray: #f8fafc;
$bg-white: #ffffff;
$success-color: #10b981;
$warning-color: #f59e0b;
$danger-color: #ef4444;

// 基础样式
.app-container {
  min-height: 100vh;
  background-color: $bg-gray;
  display: flex;
  flex-direction: column;
}
// 主内容区
.main-content {
  max-width: 600px;
  flex: 1;
  padding: 100px 16px 16px;
}
// 表单容器
.form-container {
  background-color: $bg-white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

// 表单头部
.form-header {
  background-color: $primary-light;
  padding: 16px;
  border-bottom: 1px solid $primary-border;
  .time-flex {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .time-title {
      font-size: 20px;
    }
    .countdown-section {
      text-align: center;

      .countdown-container {
        display: flex;
        align-items: center;
        justify-content: center;

        .time-box {
          display: inline-block;
          width: 32px;
          height: 30px;
          line-height: 30px;
          background-color: #333333;
          color: #ffffff;
          font-size: 18px;
          font-weight: bold;
          border-radius: 6px;
          text-align: center;
          margin: 0 5px;
        }

        .time-separator {
          color: #333333;
          font-size: 16px;
          margin: 0 2px;
        }
      }

      .countdown-tip {
        font-size: 13px;
        color: #666666;
        margin: 0;
      }
    }
  }
  .form-title {
    font-size: 16px;
    color: $text-primary;
    font-weight: 500;
    margin-bottom: 4px;
  }

  .form-desc {
    font-size: 12px;
    color: $text-secondary;
  }
}
.required-mark {
  color: $danger-color;
}
// 提交按钮区域
.submit-container {
  padding: 16px;
  padding-top: 8px;
}

// 混合器
@mixin transition($property: all, $duration: 0.3s, $timing: ease) {
  transition: $property $duration $timing;
}

@mixin shadow($params) {
  box-shadow: $params;
}

// 动画定义
@keyframes stroke {
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes fadeIn {
  100% {
    opacity: 1;
  }
}
.expired-content {
  max-width: 600px;
  min-height: 100vh;
  background-color: $bg-white;
  border-radius: 12px;
  @include shadow(0 5px 20px rgba(0, 0, 0, 0.05));
  padding: 96px 24px 48px;
  text-align: center;
}
// 失效图标样式
.expired-icon {
  margin-bottom: 30px;
}
.checkmark-circle {
  width: 100px;
  height: 100px;
  margin: 0 auto;
  border-radius: 50%;
  position: relative;
  padding: 4px;
  @include transition;

  &.animate {
    border-color: $danger-color;
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
.checkmark__check {
  transform-origin: 50% 50%;
  stroke: $danger-color;
  stroke-width: 2.5;
  stroke-linecap: round;
  opacity: 0;
  animation: fadeIn 0.3s ease-in-out 0.6s forwards;
}
.checkmark__circle {
  stroke-dasharray: 125;
  stroke-dashoffset: 125;
  stroke-width: 2.5;
  stroke: $danger-color;
  fill: none;
  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}
.expired-title {
  font-size: 20px;
  color: $text-primary;
}
.expired-message {
  font-size: 14px;
  color: $text-secondary;
}
</style>
