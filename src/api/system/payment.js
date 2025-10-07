import request from "@/utils/request";

// 生成支付流水
export function paymentGenerate(data) {
  return request({
    url: "/business/payment/generate",
    method: "post",
    data: data,
  });
}
