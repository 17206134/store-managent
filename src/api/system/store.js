import request from "@/utils/request";

// 查询联盟店主列表
export function listStore(query) {
  return request({
    url: "/business/store/list",
    method: "get",
    params: query,
  });
}

// 查询联盟店主详细
export function getStore(storeId) {
  return request({
    url: "/business/store/" + storeId,
    method: "get",
  });
}

// 新增联盟店主
export function addStore(data) {
  return request({
    url: "/business/store",
    method: "post",
    data: data,
  });
}

// 修改联盟店主
export function updateStore(data) {
  return request({
    url: "/business/store",
    method: "put",
    data: data,
  });
}

// 删除联盟店主
export function delStore(storeId) {
  return request({
    url: "/business/store/" + storeId,
    method: "delete",
  });
}

// 批量更新绑定流量卡
export function updateCard(data) {
  return request({
    url: "/business/storeCard/sync",
    method: "post",
    data: data,
  });
}

// 查询流量卡列表及绑定状态
export function cardListWithBindStatusList(storeId) {
  return request({
    url: "/business/storeCard/cardListWithBindStatus/" + storeId,
    method: "get",
  });
}
