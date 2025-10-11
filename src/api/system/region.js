import request from "@/utils/request";

// 查询大区主数据列表
export function listRegion(query) {
  return request({
    url: "/business/region/list",
    method: "get",
    params: query,
  });
}

// 查询大区主数据详细
export function getRegion(regionId) {
  return request({
    url: "/business/region/" + regionId,
    method: "get",
  });
}

// 新增大区主数据
export function addRegion(data) {
  return request({
    url: "/business/region",
    method: "post",
    data: data,
  });
}

// 修改大区主数据
export function updateRegion(data) {
  return request({
    url: "/business/region",
    method: "put",
    data: data,
  });
}

// 删除大区主数据
export function delRegion(regionId) {
  return request({
    url: "/business/region/" + regionId,
    method: "delete",
  });
}
