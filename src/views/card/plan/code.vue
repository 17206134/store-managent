<template>
  <div class="app-container">
    <!-- 主内容区 -->
    <div class="main-content">
      <van-form @submit="onSubmit" class="form-container">
        <!-- 表单标题区 -->
        <div class="form-header">
          <h2 class="form-title">请填写您的信息</h2>
          <p class="form-desc">
            带 <span class="required-mark">*</span> 为必填项
          </p>
        </div>
        <van-field
          :value="form.customerName"
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
          :value="form.customerName"
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
  </div>
</template>
<script>
export default {
  name: "PlanCode",
  data() {
    return {
      btnLoading: false, // 防重复点击loading
      form: {
        customerName: "",
        customerPhone: "",
      },
    };
  },
  methods: {
    onSubmit() {},
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
</style>
