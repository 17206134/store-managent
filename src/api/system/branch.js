import request from "@/utils/request";

// 查询分公司主数据列表
export function listBranch(query) {
  return request({
    url: "/business/branch/list",
    method: "get",
    params: query,
  });
}

// 查询分公司主数据详细
export function getBranch(branchId) {
  return request({
    url: "/business/branch/" + branchId,
    method: "get",
  });
}

// 新增分公司主数据
export function addBranch(data) {
  return request({
    url: "/business/branch",
    method: "post",
    data: data,
  });
}

// 修改分公司主数据
export function updateBranch(data) {
  return request({
    url: "/business/branch",
    method: "put",
    data: data,
  });
}

// 删除分公司主数据
export function delBranch(branchId) {
  return request({
    url: "/business/branch/" + branchId,
    method: "delete",
  });
}
