import request from "@/utils/request";

// 查询支付流水列表
export function listRecord(query) {
  return request({
    url: "/business/payment/list",
    method: "get",
    params: query,
  });
}

// 查询支付流水详细
export function getRecord(recordId) {
  return request({
    url: "/business/payment/" + recordId,
    method: "get",
  });
}

// 删除支付流水
export function delRecord(recordId) {
  return request({
    url: "/business/payment/" + recordId,
    method: "delete",
  });
}
