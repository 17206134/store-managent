import request from "@/utils/request";

// 查询卖卡人主数据列表
export function listSeller(query) {
  return request({
    url: "/business/seller/list",
    method: "get",
    params: query,
  });
}

// 查询卖卡人主数据详细
export function getSeller(sellerId) {
  return request({
    url: "/business/seller/" + sellerId,
    method: "get",
  });
}

// 新增卖卡人主数据
export function addSeller(data) {
  return request({
    url: "/business/seller",
    method: "post",
    data: data,
  });
}

// 修改卖卡人主数据
export function updateSeller(data) {
  return request({
    url: "/business/seller",
    method: "put",
    data: data,
  });
}

// 删除卖卡人主数据
export function delSeller(sellerId) {
  return request({
    url: "/business/seller/" + sellerId,
    method: "delete",
  });
}

// 获取卖卡人树形数据
export function getSellerTree(query) {
  return request({
    url: "/business/seller/tree",
    method: "get",
    params: query,
  });
}

// 获取顶级卖卡人数据
export function getTopSeller() {
  return request({
    url: "/business/seller/topLevel",
    method: "get",
  });
}
