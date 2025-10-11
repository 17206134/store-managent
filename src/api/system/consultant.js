import request from "@/utils/request";

// 查询咨询顾问主数据列表
export function listConsultant(query) {
  return request({
    url: "/business/consultant/list",
    method: "get",
    params: query,
  });
}

// 查询咨询顾问主数据详细
export function getConsultant(consultantId) {
  return request({
    url: "/business/consultant/" + consultantId,
    method: "get",
  });
}

// 新增咨询顾问主数据
export function addConsultant(data) {
  return request({
    url: "/business/consultant",
    method: "post",
    data: data,
  });
}

// 修改咨询顾问主数据
export function updateConsultant(data) {
  return request({
    url: "/business/consultant",
    method: "put",
    data: data,
  });
}

// 删除咨询顾问主数据
export function delConsultant(consultantId) {
  return request({
    url: "/business/consultant/" + consultantId,
    method: "delete",
  });
}
