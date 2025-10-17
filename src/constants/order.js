/**
 * 订单状态枚举
 */
export const ORDER_STATUS = {
  // 订单状态
  PENDING: "0", // 待支付
  PAID: "1", // 已支付
  CANCELLED: "2", // 已取消
  REFUNDED: "3", // 已退款
  COMPLETED: "4", // 已完成
  ALL: "all", // 全部
};

/**
 * 订单状态文本映射
 */
export const ORDER_STATUS_TEXT = {
  [ORDER_STATUS.PENDING]: "待支付",
  [ORDER_STATUS.PAID]: "已支付",
  [ORDER_STATUS.CANCELLED]: "已取消",
  [ORDER_STATUS.REFUNDED]: "已退款",
  [ORDER_STATUS.COMPLETED]: "已完成",
  [ORDER_STATUS.ALL]: "全部",
};

/**
 * 订单状态标签类型映射
 */
export const ORDER_STATUS_TAG_TYPE = {
  [ORDER_STATUS.PENDING]: "warning", // 待支付 - 橙色
  [ORDER_STATUS.PAID]: "success", // 已支付 - 绿色
  [ORDER_STATUS.CANCELLED]: "info", // 已取消 - 灰色
  [ORDER_STATUS.REFUNDED]: "danger", // 已退款 - 红色
  [ORDER_STATUS.COMPLETED]: "success", // 已完成 - 绿色
};

/**
 * 支付状态枚举
 */
export const PAY_STATUS = {
  UNPAID: "0", // 未支付
  PAID: "1", // 已支付
  FAILED: "2", // 支付失败
};

/**
 * 支付状态文本映射
 */
export const PAY_STATUS_TEXT = {
  [PAY_STATUS.UNPAID]: "未支付",
  [PAY_STATUS.PAID]: "已支付",
  [PAY_STATUS.FAILED]: "支付失败",
};

/**
 * 支付状态标签类型映射
 */
export const PAY_STATUS_TAG_TYPE = {
  [PAY_STATUS.UNPAID]: "warning", // 未支付 - 橙色
  [PAY_STATUS.PAID]: "success", // 已支付 - 绿色
  [PAY_STATUS.FAILED]: "danger", // 支付失败 - 红色
};

/**
 * 核销状态枚举
 */
export const VERIFY_STATUS = {
  UNVERIFIED: "0", // 未核销
  VERIFIED: "1", // 已核销
};

/**
 * 核销状态文本映射
 */
export const VERIFY_STATUS_TEXT = {
  [VERIFY_STATUS.UNVERIFIED]: "未核销",
  [VERIFY_STATUS.VERIFIED]: "已核销",
};

/**
 * 核销状态标签类型映射
 */
export const VERIFY_STATUS_TAG_TYPE = {
  [VERIFY_STATUS.UNVERIFIED]: "warning", // 未核销 - 橙色
  [VERIFY_STATUS.VERIFIED]: "success", // 已核销 - 绿色
};

/**
 * 获取订单状态列表（用于下拉选择）
 */
export function getOrderStatusList() {
  return [
    {
      orderStatus: ORDER_STATUS.ALL,
      orderStatusText: ORDER_STATUS_TEXT[ORDER_STATUS.ALL],
    },
    {
      orderStatus: ORDER_STATUS.PENDING,
      orderStatusText: ORDER_STATUS_TEXT[ORDER_STATUS.PENDING],
    },
    {
      orderStatus: ORDER_STATUS.PAID,
      orderStatusText: ORDER_STATUS_TEXT[ORDER_STATUS.PAID],
    },
    {
      orderStatus: ORDER_STATUS.CANCELLED,
      orderStatusText: ORDER_STATUS_TEXT[ORDER_STATUS.CANCELLED],
    },
    {
      orderStatus: ORDER_STATUS.REFUNDED,
      orderStatusText: ORDER_STATUS_TEXT[ORDER_STATUS.REFUNDED],
    },
    {
      orderStatus: ORDER_STATUS.COMPLETED,
      orderStatusText: ORDER_STATUS_TEXT[ORDER_STATUS.COMPLETED],
    },
  ];
}

/**
 * 获取订单状态文本
 * @param {string} status 订单状态
 * @returns {string} 状态文本
 */
export function getOrderStatusText(status) {
  return ORDER_STATUS_TEXT[status] || "-";
}

/**
 * 获取订单状态标签类型
 * @param {string} status 订单状态
 * @returns {string} 标签类型
 */
export function getOrderStatusTagType(status) {
  return ORDER_STATUS_TAG_TYPE[status] || "info";
}

/**
 * 获取支付状态文本
 * @param {string} status 支付状态
 * @returns {string} 状态文本
 */
export function getPayStatusText(status) {
  return PAY_STATUS_TEXT[status] || "-";
}

/**
 * 获取支付状态标签类型
 * @param {string} status 支付状态
 * @returns {string} 标签类型
 */
export function getPayStatusTagType(status) {
  return PAY_STATUS_TAG_TYPE[status] || "info";
}

/**
 * 获取核销状态文本
 * @param {string} status 核销状态
 * @returns {string} 状态文本
 */
export function getVerifyStatusText(status) {
  return VERIFY_STATUS_TEXT[status] || "-";
}

/**
 * 获取核销状态标签类型
 * @param {string} status 核销状态
 * @returns {string} 标签类型
 */
export function getVerifyStatusTagType(status) {
  return VERIFY_STATUS_TAG_TYPE[status] || "info";
}
