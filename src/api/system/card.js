import request from "@/utils/request";

// 查询流量卡主列表
export function listCard(query) {
  return request({
    url: "/business/card/list",
    method: "get",
    params: query,
  });
}

// 查询流量卡主详细
export function getCard(cardId) {
  return request({
    url: "/business/card/" + cardId,
    method: "get",
  });
}

// 新增流量卡主
export function addCard(data) {
  return request({
    url: "/business/card",
    method: "post",
    data: data,
  });
}

// 修改流量卡主
export function updateCard(data) {
  return request({
    url: "/business/card",
    method: "put",
    data: data,
  });
}

// 删除流量卡主
export function delCard(cardId) {
  return request({
    url: "/business/card/" + cardId,
    method: "delete",
  });
}

// 设置流量卡奖励配置
export function setCardRewardConfig(data) {
  return request({
    url: "/business/rewardConfig/setRewardConfig",
    method: "post",
    data: data,
  });
}
