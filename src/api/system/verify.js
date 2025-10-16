import request from "@/utils/request";

// 查询订单核销记录列表
export function listRecord(query) {
  return request({
    url: "/business/verifyRecord/list",
    method: "get",
    params: query,
  });
}

// 查询订单核销记录详细
export function getRecord(recordId) {
  return request({
    url: "/business/verifyRecord/" + recordId,
    method: "get",
  });
}

// 删除订单核销记录
export function delRecord(recordId) {
  return request({
    url: "/business/verifyRecord/" + recordId,
    method: "delete",
  });
}
