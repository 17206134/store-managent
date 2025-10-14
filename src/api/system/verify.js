import request from "@/utils/request";

// 查询订单核销记录列表
export function listRecord(query) {
  return request({
    url: "/business/record/list",
    method: "get",
    params: query,
  });
}

// 查询订单核销记录详细
export function getRecord(recordId) {
  return request({
    url: "/business/record/" + recordId,
    method: "get",
  });
}

// 新增订单核销记录
export function addRecord(data) {
  return request({
    url: "/business/record",
    method: "post",
    data: data,
  });
}

// 修改订单核销记录
export function updateRecord(data) {
  return request({
    url: "/business/record",
    method: "put",
    data: data,
  });
}

// 删除订单核销记录
export function delRecord(recordId) {
  return request({
    url: "/business/record/" + recordId,
    method: "delete",
  });
}
