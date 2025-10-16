/** 数字转中文层级 */
export const numberToChineseLevel = (level) => {
  if (level === null || level === undefined || level === "") {
    return "";
  }

  const num = parseInt(level);
  if (isNaN(num) || num < 0) {
    return level;
  }

  // 层级值+1（0对应一级，1对应二级，以此类推）
  const displayLevel = num + 1;

  // 中文数字映射
  const chineseNumbers = [
    "零",
    "一",
    "二",
    "三",
    "四",
    "五",
    "六",
    "七",
    "八",
    "九",
  ];
  const units = ["", "十", "百", "千"];

  if (displayLevel === 0) {
    return "零级";
  }

  let result = "";
  let numStr = displayLevel.toString();
  let len = numStr.length;

  // 处理个位数
  if (len === 1) {
    return chineseNumbers[displayLevel] + "级";
  }

  // 处理十位数及以上
  for (let i = 0; i < len; i++) {
    let digit = parseInt(numStr[i]);
    let pos = len - i - 1; // 位置（个位、十位、百位等）

    if (digit !== 0) {
      // 特殊处理：十位为1时，不显示"一"
      if (pos === 1 && digit === 1 && len === 2) {
        result += "十";
      } else {
        result += chineseNumbers[digit] + units[pos];
      }
    } else {
      // 处理零的情况
      if (result && !result.endsWith("零")) {
        result += "零";
      }
    }
  }

  // 清理末尾的零
  result = result.replace(/零+$/, "");

  return result + "级";
};
