<template>
  <div class="app-container">
    <!-- 主内容区 -->
    <div class="main-content">
      <van-form @submit="onSubmit" class="form-container">
        <!-- 表单标题区 -->
        <div class="form-header">
          <h2 class="form-title">请填写销售信息</h2>
          <p class="form-desc">
            带 <span class="required-mark">*</span> 为必填项
          </p>
        </div>

        <!-- 联盟店选择 -->
        <van-field
          readonly
          clickable
          :value="form.storeName"
          name="选择联盟店"
          placeholder="请选择联盟店"
          @click="showNamePicker = true"
          class="form-field"
        >
          <template #label>
            <span>选择联盟店</span>
            <span class="required-mark">*</span>
          </template>
          <template #right-icon>
            <van-icon name="arrow" />
          </template>
        </van-field>

        <!-- 联盟店选择器弹窗 -->
        <van-popup
          round
          position="bottom"
          :style="{ height: '42%' }"
          v-model="showNamePicker"
          :overlay="true"
          overlay-class="custom-overlay"
        >
          <van-picker
            title="选择联盟店"
            show-toolbar
            :columns="storeColumns"
            value-key="storeName"
            @confirm="onConfirmStore"
            @cancel="showNamePicker = false"
            class="custom-picker"
          />
        </van-popup>

        <!-- 流量卡类型选择（带动画显示） -->
        <transition name="fade">
          <van-field name="radio" v-show="form.storeName" class="form-field">
            <template #label>
              <span>流量卡类型</span>
              <span class="required-mark">*</span>
            </template>
            <template #input>
              <van-radio-group
                @change="changeType"
                v-model="cardType"
                direction="horizontal"
                icon-size="16"
                class="radio-group"
              >
                <van-radio name="0" class="radio-item">门店</van-radio>
                <van-radio name="1" class="radio-item">全部</van-radio>
              </van-radio-group>
            </template>
          </van-field>
        </transition>

        <!-- 流量卡选择（带动画显示） -->
        <transition name="fade">
          <van-field
            v-show="form.storeName"
            readonly
            clickable
            :value="form.cardName"
            name="选择流量卡"
            placeholder="请选择流量卡"
            @click="showCardPicker = true"
            class="form-field"
          >
            <template #label>
              <span>选择流量卡</span>
              <span class="required-mark">*</span>
            </template>
            <template #right-icon>
              <van-icon name="arrow" />
            </template>
          </van-field>
        </transition>

        <!-- 流量卡选择器弹窗 -->
        <van-popup
          round
          position="bottom"
          :style="{ height: '42%' }"
          v-model="showCardPicker"
          :overlay="true"
          overlay-class="custom-overlay"
        >
          <van-picker
            title="选择流量卡"
            show-toolbar
            :columns="cardType === '0' ? storeCardColumns : allCardColumns"
            value-key="cardName"
            @confirm="onConfirmCard"
            @cancel="showCardPicker = false"
            class="custom-picker"
          />
        </van-popup>

        <!-- 联盟店信息区域（带动画显示） -->
        <transition name="slide">
          <div v-show="form.storeName" class="store-info-container">
            <div class="info-title">
              <i class="fa fa-info-circle"></i>
              <span>联盟店信息</span>
            </div>

            <van-field
              readonly
              disabled
              :value="selectStore.bossName"
              name="店主名称"
              label="店主名称"
              class="info-field"
            />
            <van-field
              readonly
              disabled
              :value="selectStore.bossPhone"
              name="店主手机号"
              label="店主手机号"
              class="info-field"
            />
            <van-field
              readonly
              disabled
              :value="selectStore.consultantInfo.consultantName"
              name="归属咨询顾问"
              label="归属咨询顾问"
              class="info-field"
            />
            <van-field
              readonly
              disabled
              :value="selectStore.branchInfo.branchName"
              name="归属分公司"
              label="归属分公司"
              class="info-field"
            />
          </div>
        </transition>

        <!-- 提交按钮区域 -->
        <div class="submit-container">
          <van-button
            round
            block
            type="info"
            native-type="submit"
            :disabled="!form.storeName || !form.cardName"
            class="submit-btn"
            v-hasPermi="['main:plan:submit']"
          >
            提交订单
          </van-button>
        </div>
      </van-form>

      <!-- 帮助提示 -->
      <div class="help-tip">
        <van-icon name="warning" />
        <span>提示：请先选择联盟店，再选择相应的流量卡类型和具体卡种</span>
      </div>
    </div>
    <van-popup
      v-model="showQrCode"
      position="center"
      :closeable="true"
      close-icon-position="top-right"
      class="custom-qr-popup"
    >
      <div class="qr-code">
        <!-- 倒计时区域 -->
        <div class="countdown-section">
          <van-count-down :time="time" @finish="timeFinish">
            <template #default="timeData">
              <div class="countdown-container">
                <span class="time-box">{{ timeData.hours | addZero }}</span>
                <span class="time-separator">时</span>
                <span class="time-box">{{ timeData.minutes | addZero }}</span>
                <span class="time-separator">分</span>
                <span class="time-box">{{ timeData.seconds | addZero }}</span>
                <span class="time-separator">秒</span>
              </div>
            </template>
          </van-count-down>
          <p class="countdown-tip">
            {{ isTimeOut ? "订单超时" : "超时后二维码将失效，请尽快操作" }}
          </p>
        </div>

        <!-- 二维码区域 -->
        <div class="qrcode-container">
          <div
            class="qrcode-wrapper"
            :class="{ 'filter-img': isTimeOut }"
            id="qrcode"
            ref="qrcode"
          ></div>
          <div class="mask" v-if="isTimeOut">该二维码已失效</div>
          <p class="qrcode-tip" v-if="!isTimeOut">请尽快使用微信扫码完成支付</p>
        </div>

        <!-- 链接与复制区域 -->
        <div class="link-section" v-if="!isTimeOut">
          <p class="link-label">支付链接</p>
          <div class="link-container">
            <span class="link-text" :title="linkUrl">{{ linkUrl }}</span>
            <van-button
              class="copy-btn"
              :class="{ 'copy-success': copySuccess }"
              v-clipboard:copy="linkUrl"
              v-clipboard:success="clipboardSuccess"
            >
              {{ copySuccess ? "已复制" : "复制" }}
            </van-button>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import { listStore } from "@/api/system/store";
import { listCard } from "@/api/system/card";
import { createOrder } from "@/api/system/order";
import QRCode from "qrcodejs2";
const ORDER_TIME = 15 * 60 * 60 * 1000; // 默认订单超时时间15分钟
export default {
  name: "Plan",
  data() {
    return {
      btnLoading: false, // 防重复点击loading
      time: 0, // 15分钟订单有效期
      timeout: false, // 订单超时
      linkUrl: "",
      copySuccess: false,
      showQrCode: false, // 二维码弹窗
      showNamePicker: false, // 门店选择picker组件
      showCardPicker: false, // 流量卡选择picker组件
      selectStore: {
        bossName: "",
        bossPhone: "",
        consultantInfo: {},
        branchInfo: {},
      }, // 选中的门店的数据
      selectCard: {}, // 选中的流量卡的数据
      storeColumns: [], // 门店数据
      storeCardColumns: [], // 门店的流量卡
      allCardColumns: [], // 全部的流量卡
      cardType: "0", // 0选择门店流量卡 1不选择门店流量卡
      form: {
        storeName: "",
        storeId: "",
        cardName: null,
        cardId: null,
      },
    };
  },
  filters: {
    addZero(val) {
      return String(val).padStart(2, 0);
    },
  },
  computed: {
    isTimeOut() {
      return this.timeout || this.time === 0;
    },
  },
  created() {
    // 所有的门店
    listStore({ pageNum: 1, pageSize: 999 }).then((res) => {
      this.storeColumns = res.rows || [];
    });
    // 所有的流量卡
    listCard({ pageNum: 1, pageSize: 999 }).then((res) => {
      this.allCardColumns = res.rows || [];
    });
  },
  methods: {
    onSubmit() {
      if (this.btnLoading) return;
      this.btnLoading = true;
      const { cardId, storeId } = this.form;
      if (cardId && storeId) {
        createOrder({
          cardId,
          storeId,
        })
          .then((res) => {
            if (res.data.orderId) {
              this.timeout = false; // 重置订单状态
              this.showQrCode = true;
              console.log(res, "订单号");
              this.time = ORDER_TIME;
              this.linkUrl = `${window.location.origin}/scanCode/${res.data.orderId}`;
              this.getUrlCanvasBase64(this.linkUrl);
            } else {
              this.$modal.msgError("生成订单失败");
              this.timeout = true;
            }
          })
          .catch((err) => {
            console.log(err, "订单错误信息");
            this.timeout = true;
          })
          .finally(() => {
            this.btnLoading = false;
          });
      }
    },
    /** 复制链接成功 */
    clipboardSuccess() {
      this.copySuccess = true;
    },
    timeFinish() {
      console.log("倒计时结束");
      this.timeout = true;
    },
    async getUrlCanvasBase64(url) {
      await this.$nextTick();
      const qrDom = this.$refs.qrcode;
      qrDom.innerHTML = "";
      const qrcode = new QRCode(qrDom, {
        width: 160, // 图像宽度
        height: 160, // 图像高度
        colorDark: "#000000", // 前景色
        colorLight: "#ffffff", // 背景色
        typeNumber: 4,
        correctLevel: QRCode.CorrectLevel.L, // 容错级别
      });
      qrcode.clear();
      qrcode.makeCode(url);
    },
    changeType() {
      this.form.cardName = null;
      this.form.cardId = null;
      this.selectCard = {};
    },
    onConfirmStore(value) {
      if (this.form.storeName !== value.storeName) {
        // 重新选择了门店
        this.form.cardName = null;
        this.form.cardId = null;
        this.selectCard = {};
      }
      this.form.storeName = value.storeName;
      this.form.storeId = value.storeId;
      this.selectStore = value;
      this.showNamePicker = false;
      this.storeCardColumns = value?.flowCardList || [];
    },
    onConfirmCard(value) {
      this.form.cardName = value.cardName;
      this.form.cardId = value.cardId;
      this.selectCard = value;
      this.showCardPicker = false;
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
  padding: 16px;
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

// 表单字段样式
.form-field {
  &::v-deep .van-cell {
    padding: 12px 16px;
    border-bottom: 1px solid $border-color;

    &:last-child {
      border-bottom: none;
    }

    .van-cell__label {
      color: $text-secondary;
      font-size: 14px;
    }

    .van-cell__value {
      color: $text-primary;
      font-size: 14px;
    }

    &:active {
      background-color: $bg-gray;
    }
  }
}

.icon-arrow {
  color: $text-secondary;
  font-size: 16px;
  transition: transform 0.2s ease;

  .form-field:active & {
    transform: scale(0.9);
  }
}

// 单选按钮样式
.radio-group {
  padding-top: 4px;
}

.radio-item {
  margin-right: 24px;

  &::v-deep .van-radio__label {
    padding-left: 6px;
    color: $text-primary;
  }

  &::v-deep .van-radio__icon--checked .van-icon {
    background-color: $primary-color;
    border-color: $primary-color;
  }
}

// 联盟店信息区域
.store-info-container {
  background-color: $bg-gray;
  padding: 16px;
  padding-top: 20px;

  .info-title {
    display: flex;
    align-items: center;
    color: $text-secondary;
    font-size: 13px;
    margin-bottom: 12px;

    i {
      color: $primary-color;
      margin-right: 6px;
      font-size: 14px;
    }
  }
}

// 信息字段样式
.info-field {
  &::v-deep .van-cell {
    padding: 10px 0;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 6px;
    margin-bottom: 8px;
    padding-left: 12px;
    padding-right: 12px;

    &:last-child {
      margin-bottom: 0;
    }

    .van-cell__label {
      color: $text-secondary;
      font-size: 13px;
    }

    .van-cell__value {
      color: $text-primary;
      font-size: 13px;
    }

    &::v-deep .van-cell__value--disabled {
      color: $text-primary;
      opacity: 0.8;
    }
  }
}

// 提交按钮区域
.submit-container {
  padding: 16px;
  padding-top: 8px;
}

.submit-btn {
  height: 44px;
  font-size: 16px;
  font-weight: 500;
  background-color: $primary-color;
  border-color: $primary-color;
  transition: all 0.2s ease;

  &::v-deep .van-button__content {
    padding: 0 16px;
  }

  &:not(:disabled):active {
    transform: scale(0.98);
    background-color: darken($primary-color, 10%);
    border-color: darken($primary-color, 10%);
  }

  &:disabled {
    background-color: #a0cfff;
    border-color: #a0cfff;
    opacity: 0.8;
  }
}

// 帮助提示
.help-tip {
  margin-top: 16px;
  padding: 10px 12px;
  background-color: #ebf8ff;
  border: 1px solid #dbeafe;
  border-radius: 8px;
  font-size: 12px;
  color: #0284c7;
  display: flex;
  align-items: center;

  i {
    margin-right: 6px;
    font-size: 14px;
  }
}
.custom-qr-popup {
  width: 80vw;
  max-width: 400px;
  padding: 0 !important;
  border-radius: 12px !important;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15) !important;

  .qr-code {
    background-color: #ffffff;
    padding: 48px 15px 24px;
    border-radius: 12px;

    .countdown-section {
      margin-bottom: 20px;
      text-align: center;

      .countdown-container {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 8px;

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

    .qrcode-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 25px;
      position: relative;

      .qrcode-wrapper {
        width: 180px;
        height: 180px;
        padding: 10px;
        background-color: #ffffff;
        border: 1px solid #eeeeee;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        margin-bottom: 10px;
      }
      .filter-img {
        filter: blur(10px);
      }
      .mask {
        position: absolute;
        background: rgba($color: #000000, $alpha: 0.6);
        color: #fff;
        font-size: 14px;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 180px;
        height: 180px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .qrcode-tip {
        font-size: 14px;
        color: #666666;
        margin: 0;
      }
    }

    .link-section {
      margin-top: 15px;

      .link-label {
        font-size: 14px;
        color: #666666;
        margin: 0 0 8px 0;
      }

      .link-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: #f7f7f7;
        border-radius: 6px;
        padding: 10px 12px;

        .link-text {
          flex: 1;
          font-size: 13px;
          color: #555555;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-right: 10px;
        }

        .copy-btn {
          min-width: 60px;
          height: 32px;
          line-height: 32px;
          padding: 0 12px;
          font-size: 14px;
          border-radius: 4px;
          background-color: #1677ff;
          border-color: #1677ff;
          color: #fff;
          &.copy-success {
            background-color: #52c41a;
            border-color: #52c41a;
          }
        }
      }
    }
  }
}

::v-deep {
  .van-popup__close-icon {
    top: 12px !important;
    right: 12px !important;
    font-size: 18px !important;
    color: #999999 !important;

    &:hover {
      color: #333333 !important;
    }
  }

  .van-button--primary {
    background-color: #1677ff;
    border-color: #1677ff;
  }
}

// 自定义选择器样式
.custom-picker {
  &::v-deep .van-picker__toolbar {
    height: 44px;
    padding: 0 16px;
    border-bottom: 1px solid $border-color;
  }

  &::v-deep .van-picker__title {
    font-size: 16px;
    color: $text-primary;
    font-weight: 500;
  }

  &::v-deep .van-picker__cancel,
  &::v-deep .van-picker__confirm {
    color: $primary-color;
    font-size: 15px;
  }

  &::v-deep .van-picker__option--selected {
    color: $primary-color;
    font-weight: 500;
  }
}

// 自定义遮罩层
::v-deep .custom-overlay {
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(2px);
}

// 动画效果
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.4s ease-out;
}

.slide-enter,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
