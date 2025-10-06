import request from "@/utils/request";

// 查询流量卡订单列表
export function listOrder(query) {
  return request({
    url: "/business/order/list",
    method: "get",
    params: query,
  });
}

// 查询流量卡订单详细
export function getOrder(orderId) {
  return request({
    url: "/business/order/" + orderId,
    method: "get",
  });
}

// 新增流量卡订单
export function addOrder(data) {
  return request({
    url: "/business/order",
    method: "post",
    data: data,
  });
}

// 修改流量卡订单
export function updateOrder(data) {
  return request({
    url: "/business/order",
    method: "put",
    data: data,
  });
}

// 删除流量卡订单
export function delOrder(orderId) {
  return request({
    url: "/business/order/" + orderId,
    method: "delete",
  });
}

// 创建订单
export function createOrder(data) {
  return request({
    url: "/business/order/create",
    method: "post",
    data: data,
  });
}
