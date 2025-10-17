<template>
  <div class="app-container">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="8" animated />
    </div>

    <!-- 编辑内容 -->
    <div v-else class="card-edit-content">
      <!-- 页面头部操作栏 -->
      <div class="page-header">
        <el-button
          type="text"
          icon="el-icon-arrow-left"
          @click="goBack"
          class="back-btn"
        >
          返回列表
        </el-button>
      </div>

      <!-- 编辑表单 -->
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="120px"
        class="card-form"
      >
        <!-- 基础信息分区 -->
        <el-card class="detail-card" shadow="never">
          <div slot="header" class="card-header">
            <i class="el-icon-document"></i>
            <span>基础信息</span>
          </div>
          <div class="section-content">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="流量卡编码" prop="cardCode">
                  <el-input
                    v-model="form.cardCode"
                    placeholder="请输入流量卡编码"
                    clearable
                    :disabled="isInputDisabled"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="流量卡名称" prop="cardName">
                  <el-input
                    v-model="form.cardName"
                    placeholder="请输入流量卡名称"
                    clearable
                    :disabled="isInputDisabled"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="流量卡单价" prop="cardPrice">
                  <el-input
                    v-model="form.cardPrice"
                    placeholder="请输入流量卡单价"
                    type="number"
                    min="0"
                    clearable
                    :disabled="isInputDisabled"
                  >
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="备注" prop="remark">
                  <el-input
                    v-model="form.remark"
                    placeholder="请输入备注信息"
                    clearable
                    :disabled="isInputDisabled"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-card>

        <!-- 奖励配置分区 -->
        <el-card class="detail-card" shadow="never">
          <div slot="header" class="card-header">
            <i class="el-icon-present"></i>
            <span>奖励配置</span>
          </div>
          <div class="section-content">
            <!-- 奖励配置表格 -->
            <div class="reward-config-section">
              <el-tabs v-model="activeTab" class="reward-tabs">
                <!-- 门店奖励配置 -->
                <el-tab-pane label="门店奖励" name="store">
                  <!-- 门店搜索区域 -->
                  <div class="search-toolbar">
                    <el-input
                      v-model="storeSearchKeyword"
                      placeholder="请输入门店名称进行搜索"
                      size="mini"
                      clearable
                      class="search-input"
                      :disabled="isSearchDisabled"
                    >
                      <i
                        slot="prefix"
                        class="el-input__icon el-icon-search"
                      ></i>
                    </el-input>
                  </div>

                  <div class="table-toolbar" v-if="showBatchOperations">
                    <el-button
                      @click="handleSelectAllStores"
                      :disabled="!filteredStoreTableData.length"
                      size="mini"
                      >全选</el-button
                    >
                    <el-button
                      @click="handleClearStoreSelection"
                      :disabled="!selectedStores.length"
                      size="mini"
                      >清空</el-button
                    >
                    <el-button
                      type="primary"
                      @click="handleBatchSetStoreReward"
                      :disabled="!selectedStores.length"
                      size="mini"
                      icon="el-icon-edit"
                      >批量设置</el-button
                    >
                  </div>
                  <el-table
                    ref="storeTable"
                    :data="filteredStoreTableData"
                    @selection-change="handleStoreSelectionChange"
                    size="mini"
                    class="reward-table"
                    row-key="storeId"
                    :reserve-selection="true"
                    max-height="400"
                  >
                    <el-table-column type="selection" width="55" align="left" />
                    <el-table-column
                      label="门店ID"
                      prop="storeId"
                      align="left"
                    />
                    <el-table-column
                      label="门店名称"
                      prop="storeName"
                      align="left"
                    />
                    <el-table-column label="奖励模式" align="left">
                      <template slot-scope="scope">
                        <el-select
                          v-model="scope.row.rewardMode"
                          size="mini"
                          @change="handleStoreRewardModeChange(scope.row)"
                          :disabled="isInputDisabled"
                        >
                          <el-option label="固定金额" value="AMOUNT" />
                          <el-option label="比例" value="RATE" />
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column label="*奖励值" align="left">
                      <template slot-scope="scope">
                        <el-input
                          v-model="scope.row.rewardValue"
                          :placeholder="
                            scope.row.rewardMode === 'AMOUNT'
                              ? '金额'
                              : '比例(%)'
                          "
                          size="mini"
                          type="number"
                          min="0"
                          :max="
                            scope.row.rewardMode === 'RATE' ? 100 : undefined
                          "
                          @blur="
                            validateRewardValue(
                              scope.row.rewardValue,
                              scope.row.rewardMode
                            )
                          "
                          :disabled="isInputDisabled"
                        >
                          <template slot="append">
                            <span v-if="scope.row.rewardMode === 'AMOUNT'"
                              >元</span
                            >
                            <span v-else-if="scope.row.rewardMode === 'RATE'"
                              >%</span
                            >
                          </template>
                        </el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="奖励备注" align="left">
                      <template slot-scope="scope">
                        <el-input
                          v-model="scope.row.rewardRemark"
                          placeholder="备注"
                          size="mini"
                          :disabled="isInputDisabled"
                        />
                      </template>
                    </el-table-column>
                  </el-table>
                </el-tab-pane>

                <!-- 卖卡人奖励配置 -->
                <el-tab-pane label="卖卡人奖励" name="seller">
                  <!-- 卖卡人搜索区域 -->
                  <div class="search-toolbar">
                    <el-input
                      v-model="sellerSearchKeyword"
                      placeholder="请输入卖卡人名称进行搜索"
                      size="mini"
                      clearable
                      class="search-input"
                      :disabled="isSearchDisabled"
                    >
                      <i
                        slot="prefix"
                        class="el-input__icon el-icon-search"
                      ></i>
                    </el-input>
                  </div>
                  <div class="table-toolbar" v-if="showBatchOperations">
                    <el-button
                      @click="handleSelectAllSellers"
                      :disabled="!filteredSellerTableData.length"
                      size="mini"
                      >全选</el-button
                    >
                    <el-button
                      @click="handleClearSellerSelection"
                      :disabled="!selectedSellers.length"
                      size="mini"
                      >清空</el-button
                    >
                    <el-button
                      type="primary"
                      @click="handleBatchSetSellerReward"
                      :disabled="!selectedSellers.length"
                      size="mini"
                      icon="el-icon-edit"
                      >批量设置</el-button
                    >
                  </div>
                  <el-table
                    ref="sellerTable"
                    :data="filteredSellerTableData"
                    @selection-change="handleSellerSelectionChange"
                    size="mini"
                    class="reward-table"
                    row-key="sellerId"
                    max-height="400"
                    :tree-props="{
                      children: 'children',
                      hasChildren: 'hasChildren',
                    }"
                  >
                    <el-table-column type="selection" width="55" align="left" />
                    <el-table-column
                      label="卖卡人编码"
                      prop="sellerCode"
                      align="left"
                    />
                    <el-table-column
                      label="卖卡人名称"
                      prop="sellerName"
                      align="left"
                    />
                    <el-table-column
                      label="卖卡人层级"
                      align="center"
                      prop="sellerLevel"
                    >
                      <template slot-scope="scope">
                        {{ numberToChineseLevel(scope.row.sellerLevel) }}
                      </template>
                    </el-table-column>
                    <el-table-column label="奖励模式" align="left">
                      <template slot-scope="scope">
                        <el-select
                          v-model="scope.row.rewardMode"
                          size="mini"
                          @change="handleSellerRewardModeChange(scope.row)"
                          :disabled="isInputDisabled"
                        >
                          <el-option label="固定金额" value="AMOUNT" />
                          <el-option label="比例" value="RATE" />
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column label="*奖励值" align="left">
                      <template slot-scope="scope">
                        <el-input
                          v-model="scope.row.rewardValue"
                          :placeholder="
                            scope.row.rewardMode === 'AMOUNT'
                              ? '金额'
                              : '比例(%)'
                          "
                          size="mini"
                          type="number"
                          min="0"
                          :max="
                            scope.row.rewardMode === 'RATE' ? 100 : undefined
                          "
                          @blur="
                            validateRewardValue(
                              scope.row.rewardValue,
                              scope.row.rewardMode
                            )
                          "
                          :disabled="isInputDisabled"
                        >
                          <template slot="append">
                            <span v-if="scope.row.rewardMode === 'AMOUNT'"
                              >元</span
                            >
                            <span v-else-if="scope.row.rewardMode === 'RATE'"
                              >%</span
                            >
                          </template>
                        </el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="奖励备注" align="left">
                      <template slot-scope="scope">
                        <el-input
                          v-model="scope.row.rewardRemark"
                          placeholder="备注"
                          size="mini"
                          :disabled="isInputDisabled"
                        />
                      </template>
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </el-card>
      </el-form>
    </div>

    <!-- 批量设置奖励弹窗 -->
    <el-dialog
      title="批量设置奖励"
      :visible.sync="batchRewardDialogVisible"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="batchRewardForm"
        :model="batchRewardForm"
        :rules="batchRewardRules"
        label-width="100px"
      >
        <el-form-item label="奖励模式" prop="rewardMode">
          <el-select
            v-model="batchRewardForm.rewardMode"
            placeholder="请选择奖励模式"
            style="width: 100%"
            :disabled="isInputDisabled"
          >
            <el-option label="固定金额" value="AMOUNT" />
            <el-option label="比例" value="RATE" />
          </el-select>
        </el-form-item>
        <el-form-item label="奖励值" prop="rewardValue">
          <el-input
            v-model="batchRewardForm.rewardValue"
            :placeholder="
              '请输入' +
              (batchRewardForm.rewardMode === 'AMOUNT' ? '金额' : '比例(%)')
            "
            type="number"
            min="0"
            :disabled="isInputDisabled"
          >
            <template slot="append">
              <span v-if="batchRewardForm.rewardMode === 'AMOUNT'">元</span>
              <span v-else-if="batchRewardForm.rewardMode === 'RATE'">%</span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="奖励备注" prop="rewardRemark">
          <el-input
            v-model="batchRewardForm.rewardRemark"
            placeholder="请输入奖励备注（可选）"
            type="textarea"
            :rows="3"
            :disabled="isInputDisabled"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="batchRewardDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmBatchReward">确定</el-button>
      </div>
    </el-dialog>

    <!-- 底部操作按钮 - 详情页隐藏 -->
    <div v-if="!isDetail" class="bottom-actions">
      <el-button @click="resetForm" class="reset-btn">重置</el-button>
      <el-button
        type="primary"
        @click="submitForm"
        :loading="submitLoading"
        class="submit-btn"
      >
        {{ isEdit ? "保存修改" : "保存新增" }}
      </el-button>
    </div>
  </div>
</template>

<script>
import {
  getCard,
  addCard,
  updateCard,
  setCardRewardConfig,
} from "@/api/system/card";
import { listStore } from "@/api/system/store";
import { getSellerTree } from "@/api/system/seller";
import { numberToChineseLevel } from "@/utils/num";
export default {
  name: "CardEdit",
  data() {
    return {
      numberToChineseLevel: numberToChineseLevel,
      loading: true,
      submitLoading: false,
      cardId: null,
      isEdit: false,
      isDetail: false, // 是否为详情模式
      form: {
        cardCode: "",
        cardName: "",
        cardPrice: "",
        remark: "",
      },
      rules: {
        cardCode: [
          { required: true, message: "流量卡编码不能为空", trigger: "blur" },
        ],
        cardName: [
          { required: true, message: "流量卡名称不能为空", trigger: "blur" },
        ],
        cardPrice: [
          { required: true, message: "流量卡单价不能为空", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              const numValue = parseFloat(value);
              if (isNaN(numValue) || numValue < 0) {
                callback(new Error("流量卡单价不能小于0"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
      },
      rewardConfigList: [], // 奖励配置列表，用于回显数据
      rewardType: "STORE", // 奖励类型：STORE-门店，SELLER-卖卡人
      activeTab: "store", // 当前激活的标签页
      storeTableData: [], // 门店表格数据
      sellerTableData: [], // 卖卡人表格数据
      selectedStores: [], // 选中的门店
      selectedSellers: [], // 选中的卖卡人
      storeSearchKeyword: "", // 门店搜索关键词
      sellerSearchKeyword: "", // 卖卡人搜索关键词
      // 批量设置相关
      batchRewardDialogVisible: false, // 批量设置弹窗显示状态
      batchRewardForm: {
        rewardMode: "AMOUNT", // 奖励模式
        rewardValue: "", // 奖励值
        rewardRemark: "", // 奖励备注
      },
      batchRewardRules: {
        rewardMode: [
          { required: true, message: "请选择奖励模式", trigger: "change" },
        ],
        rewardValue: [
          { required: true, message: "请输入奖励值", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              const numValue = parseFloat(value);
              if (isNaN(numValue) || numValue < 0) {
                callback(new Error("奖励值不能小于0"));
              } else if (
                this.batchRewardForm.rewardMode === "RATE" &&
                numValue > 100
              ) {
                callback(new Error("比例不能大于100"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
      },
      currentBatchType: "", // 当前批量设置类型：store 或 seller
    };
  },
  created() {
    this.cardId = this.$route.params.cardId;
    // 通过路径判断页面模式
    const currentPath = this.$route.path;
    this.isEdit = currentPath.includes("/card-edit/index/");
    this.isDetail = currentPath.includes("/card-edit/view/");

    if (this.isEdit || this.isDetail) {
      this.getCardDetail();
    } else {
      this.loading = false;
      this.loadAllData();
    }
  },
  computed: {
    // 是否禁用输入框（详情模式时禁用）
    isInputDisabled() {
      return this.isDetail;
    },
    // 是否禁用搜索框（详情模式下搜索框保持可用）
    isSearchDisabled() {
      return false; // 搜索框始终可用
    },
    // 是否显示批量操作按钮（详情模式下隐藏）
    showBatchOperations() {
      return !this.isDetail;
    },
    // 页面标题
    pageTitle() {
      if (this.isDetail) {
        return "流量卡详情";
      } else if (this.isEdit) {
        return "编辑流量卡";
      } else {
        return "新增流量卡";
      }
    },
    // 过滤后的门店数据
    filteredStoreTableData() {
      if (!this.storeSearchKeyword.trim()) {
        return this.storeTableData;
      }
      return this.storeTableData.filter(
        (store) =>
          store.storeName &&
          store.storeName
            .toLowerCase()
            .includes(this.storeSearchKeyword.toLowerCase())
      );
    },
    // 过滤后的卖卡人数据
    filteredSellerTableData() {
      if (!this.sellerSearchKeyword.trim()) {
        return this.sellerTableData;
      }
      return this.filterSellerTree(
        this.sellerTableData,
        this.sellerSearchKeyword.toLowerCase()
      );
    },
  },
  methods: {
    /** 校验奖励值 */
    validateRewardValue(value, rewardMode) {
      if (rewardMode === "RATE") {
        const numValue = parseFloat(value);
        if (isNaN(numValue) || numValue < 0 || numValue > 100) {
          this.$message.error("比例必须在0-100之间");
          return false;
        }
      }
      return true;
    },

    /** 递归过滤卖卡人树形数据 */
    filterSellerTree(nodes, keyword) {
      if (!nodes || !Array.isArray(nodes)) {
        return [];
      }

      return nodes.reduce((filtered, node) => {
        // 检查当前节点是否匹配
        const nodeMatches =
          node.sellerName && node.sellerName.toLowerCase().includes(keyword);

        // 递归过滤子节点
        const filteredChildren = node.children
          ? this.filterSellerTree(node.children, keyword)
          : [];

        // 如果当前节点匹配或有匹配的子节点，则包含此节点
        if (nodeMatches || filteredChildren.length > 0) {
          filtered.push({
            ...node,
            children: filteredChildren,
          });
        }

        return filtered;
      }, []);
    },

    /** 获取流量卡详情 */
    getCardDetail() {
      this.loading = true;
      getCard(this.cardId)
        .then((response) => {
          this.form = response.data || {};
          // 保存奖励配置列表，用于后续回显
          this.rewardConfigList = response.data.rewardConfigList || [];
          this.loading = false;
          // 加载所有数据
          this.loadAllData();
        })
        .catch(() => {
          this.loading = false;
          this.$modal.msgError("获取流量卡详情失败");
          this.goBack();
        });
    },

    /** 加载所有数据 */
    loadAllData() {
      this.loadStoreTableData();
      this.loadSellerTableData();
    },

    /** 加载门店表格数据 */
    loadStoreTableData() {
      const params = { pageNum: 1, pageSize: 1000 };
      listStore(params).then((response) => {
        // 为每行数据添加奖励配置字段
        this.storeTableData = (response.rows || []).map((item) => {
          // 从rewardConfigList中查找对应的门店奖励配置
          const rewardConfig = this.rewardConfigList.find(
            (config) =>
              config.targetId === item.storeId && config.rewardType === "STORE"
          );

          return {
            ...item,
            rewardMode: rewardConfig ? rewardConfig.rewardMode : "AMOUNT", // 默认固定金额
            rewardValue: rewardConfig
              ? rewardConfig.rewardMode === "RATE"
                ? rewardConfig.rewardRate
                : rewardConfig.rewardAmount
              : "",
            rewardRemark: rewardConfig ? rewardConfig.remark : "",
          };
        });
      });
    },

    /** 加载卖卡人表格数据 */
    loadSellerTableData() {
      getSellerTree().then((response) => {
        // 递归为每行数据添加奖励配置字段
        const addRewardFields = (items) => {
          return items.map((item) => {
            // 从rewardConfigList中查找对应的卖卡人奖励配置
            const rewardConfig = this.rewardConfigList.find(
              (config) =>
                config.targetId === item.sellerId &&
                config.rewardType === "SALESMAN"
            );

            return {
              ...item,
              rewardMode: rewardConfig ? rewardConfig.rewardMode : "AMOUNT", // 默认固定金额
              rewardValue: rewardConfig
                ? rewardConfig.rewardMode === "RATE"
                  ? rewardConfig.rewardRate
                  : rewardConfig.rewardAmount
                : "",
              rewardRemark: rewardConfig ? rewardConfig.remark : "",
              children: item.children
                ? addRewardFields(item.children)
                : undefined,
            };
          });
        };
        this.sellerTableData = addRewardFields(response.data || []);
      });
    },

    /** 返回上一页 */
    goBack() {
      this.$router.go(-1);
    },

    /** 重置表单 */
    resetForm() {
      this.$refs.form.resetFields();
      this.rewardType = "STORE";
      this.activeTab = "store";
      this.selectedStores = [];
      this.selectedSellers = [];
      this.loadAllData();
    },

    /** 提交表单 */
    submitForm() {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          // 校验奖励配置
          if (!this.validateRewardConfig()) {
            return;
          }

          this.submitLoading = true;
          try {
            let cardId;
            let msg = "";
            if (this.isEdit) {
              // 修改商品
              const response = await updateCard(this.form);
              cardId = this.form.cardId;
              msg = "修改成功";
            } else {
              // 新增商品
              const response = await addCard(this.form);
              cardId = response.data.cardId || response.data.id; // 根据实际返回的字段调整
              msg = "新增成功";
            }
            // 设置奖励配置
            await this.setRewardConfig(cardId);
            this.$modal.msgSuccess(msg);
            this.goBack();
          } catch (error) {
            console.error("保存失败:", error);
            this.$modal.msgError("保存失败");
          } finally {
            this.submitLoading = false;
          }
        }
      });
    },

    /** 校验奖励配置 */
    validateRewardConfig() {
      // 校验门店奖励配置 - 检查所有门店
      const invalidStores = this.storeTableData.filter((store) => {
        return !store.rewardValue || !store.rewardValue.toString().trim();
      });

      if (invalidStores.length > 0) {
        this.$modal.msgError(`请为所有门店填写奖励值`);
        return false;
      }

      // 校验卖卡人奖励配置 - 检查所有卖卡人
      const invalidSellers = this.sellerTableData.filter((seller) => {
        return !seller.rewardValue || !seller.rewardValue.toString().trim();
      });

      if (invalidSellers.length > 0) {
        this.$modal.msgError(`请为所有卖卡人填写奖励值`);
        return false;
      }
      return true;
    },

    /** 设置奖励配置 */
    async setRewardConfig(cardId) {
      let storeRewards = [];
      let sellerRewards = [];
      try {
        // 设置门店奖励配置
        storeRewards = this.storeTableData.map((store) => ({
          targetId: store.storeId,
          rewardType: "STORE",
          rewardMode: store.rewardMode,
          rewardRate: store.rewardMode === "RATE" ? store.rewardValue : "",
          rewardAmount: store.rewardMode === "AMOUNT" ? store.rewardValue : "",
          remark: store.rewardRemark || "",
        }));
        // 设置卖卡人奖励配置
        sellerRewards = this.sellerTableData.map((seller) => ({
          targetId: seller.sellerId,
          rewardType: "SALESMAN",
          rewardMode: seller.rewardMode,
          rewardRate: seller.rewardMode === "RATE" ? seller.rewardValue : "",
          rewardAmount:
            seller.rewardMode === "AMOUNT" ? seller.rewardValue : "",
          remark: seller.rewardRemark || "",
        }));

        // 这里需要调用设置卖卡人奖励的API
        console.log("设置卖卡人奖励配置:", storeRewards, sellerRewards);
        await setCardRewardConfig({
          cardId: cardId,
          rewardConfigs: [...storeRewards, ...sellerRewards],
        });
      } catch (error) {
        console.error("设置奖励配置失败:", error);
        throw error;
      }
    },

    /** 处理奖励类型变化 */
    handleRewardTypeChange(tab) {
      this.rewardType = tab.name;
      this.activeTab = tab.name === "STORE" ? "store" : "seller";
      this.clearAllSelections();
    },

    /** 门店表格选择变化处理 */
    handleStoreSelectionChange(selection) {
      this.selectedStores = selection;
    },

    /** 卖卡人表格选择变化处理 */
    handleSellerSelectionChange(selection) {
      this.selectedSellers = selection;
    },

    /** 全选门店 */
    handleSelectAllStores() {
      if (this.$refs.storeTable && this.filteredStoreTableData.length > 0) {
        this.$refs.storeTable.toggleAllSelection();
      }
    },

    /** 清空门店选择 */
    handleClearStoreSelection() {
      if (this.$refs.storeTable) {
        this.$refs.storeTable.clearSelection();
      }
      this.selectedStores = [];
    },

    /** 全选卖卡人 */
    handleSelectAllSellers() {
      if (this.$refs.sellerTable && this.filteredSellerTableData.length > 0) {
        // 对于树形表格，需要递归选择所有节点
        this.selectAllSellerNodes(this.filteredSellerTableData);
      }
    },

    /** 清空卖卡人选择 */
    handleClearSellerSelection() {
      if (this.$refs.sellerTable) {
        this.$refs.sellerTable.clearSelection();
      }
      this.selectedSellers = [];
    },

    /** 递归选择所有卖卡人节点 */
    selectAllSellerNodes(nodes) {
      nodes.forEach((node) => {
        this.$refs.sellerTable.toggleRowSelection(node, true);
        if (node.children && node.children.length > 0) {
          this.selectAllSellerNodes(node.children);
        }
      });
    },

    /** 处理门店奖励模式变化 */
    handleStoreRewardModeChange(row) {
      // 清空奖励值，让用户重新输入
      row.rewardValue = "";
    },

    /** 处理卖卡人奖励模式变化 */
    handleSellerRewardModeChange(row) {
      // 清空奖励值，让用户重新输入
      row.rewardValue = "";
    },

    /** 清空所有选择 */
    clearAllSelections() {
      this.handleClearStoreSelection();
      this.handleClearSellerSelection();
    },

    /** 批量设置门店奖励 */
    handleBatchSetStoreReward() {
      if (this.selectedStores.length === 0) {
        this.$modal.msgWarning("请先选择要设置的门店");
        return;
      }
      this.currentBatchType = "store";
      this.resetBatchRewardForm();
      this.batchRewardDialogVisible = true;
    },

    /** 批量设置卖卡人奖励 */
    handleBatchSetSellerReward() {
      if (this.selectedSellers.length === 0) {
        this.$modal.msgWarning("请先选择要设置的卖卡人");
        return;
      }
      this.currentBatchType = "seller";
      this.resetBatchRewardForm();
      this.batchRewardDialogVisible = true;
    },

    /** 重置批量设置表单 */
    resetBatchRewardForm() {
      this.batchRewardForm = {
        rewardMode: "AMOUNT",
        rewardValue: "",
        rewardRemark: "",
      };
      if (this.$refs.batchRewardForm) {
        this.$refs.batchRewardForm.clearValidate();
      }
    },

    /** 确认批量设置 */
    confirmBatchReward() {
      this.$refs.batchRewardForm.validate((valid) => {
        if (valid) {
          if (this.currentBatchType === "store") {
            this.applyBatchStoreReward();
          } else if (this.currentBatchType === "seller") {
            this.applyBatchSellerReward();
          }
          this.batchRewardDialogVisible = false;
          this.$modal.msgSuccess("批量设置成功");
        }
      });
    },

    /** 应用批量门店奖励设置 */
    applyBatchStoreReward() {
      this.selectedStores.forEach((store) => {
        // 更新表格数据中的奖励配置
        const storeIndex = this.storeTableData.findIndex(
          (item) => item.storeId === store.storeId
        );
        if (storeIndex !== -1) {
          this.storeTableData[storeIndex].rewardMode =
            this.batchRewardForm.rewardMode;
          this.storeTableData[storeIndex].rewardValue =
            this.batchRewardForm.rewardValue;
          this.storeTableData[storeIndex].rewardRemark =
            this.batchRewardForm.rewardRemark;
        }
      });
    },

    /** 应用批量卖卡人奖励设置 */
    applyBatchSellerReward() {
      this.selectedSellers.forEach((seller) => {
        // 更新表格数据中的奖励配置
        const updateSellerReward = (nodes) => {
          nodes.forEach((node) => {
            if (node.sellerId === seller.sellerId) {
              node.rewardMode = this.batchRewardForm.rewardMode;
              node.rewardValue = this.batchRewardForm.rewardValue;
              node.rewardRemark = this.batchRewardForm.rewardRemark;
            }
            if (node.children && node.children.length > 0) {
              updateSellerReward(node.children);
            }
          });
        };
        updateSellerReward(this.sellerTableData);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  min-height: calc(100vh - 84px);
  background-color: #f5f5f5;
  padding: 0;
}

// 加载状态
.loading-container {
  padding: 24px;
  margin: 0 auto;
}

// 编辑内容
.card-edit-content {
  padding: 24px;
  margin: 0 auto;
  padding-bottom: 80px; /* 为底部固定按钮留出空间 */
}

// 页面头部操作栏
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  border-bottom: 1px solid #e8e8e8;

  .back-btn {
    color: #409eff;
    font-size: 16px;
    padding: 8px 12px;

    &:hover {
      color: #66b1ff;
      background-color: #ecf5ff;
    }

    i {
      margin-right: 4px;
    }
  }

  .header-actions {
    display: flex;
    gap: 12px;

    .reset-btn {
      color: #606266;
      border-color: #dcdfe6;

      &:hover {
        color: #409eff;
        border-color: #c6e2ff;
        background-color: #ecf5ff;
      }
    }

    .submit-btn {
      background-color: #409eff;
      border-color: #409eff;

      &:hover {
        background-color: #66b1ff;
        border-color: #66b1ff;
      }
    }
  }
}

// 底部操作按钮样式
.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-top: 1px solid #e4e7ed;
  padding: 16px 24px;
  display: flex;
  justify-content: center;
  gap: 12px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  align-items: center;

  .reset-btn {
    color: #606266;
    border-color: #dcdfe6;

    &:hover {
      color: #409eff;
      border-color: #c6e2ff;
      background-color: #ecf5ff;
    }
  }

  .submit-btn {
    background-color: #409eff;
    border-color: #409eff;

    &:hover {
      background-color: #66b1ff;
      border-color: #66b1ff;
    }
  }
}

// 详情卡片
.detail-card {
  margin-bottom: 20px;
  border-radius: 8px;
  border: 1px solid #e8e8e8;

  .card-header {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 600;
    color: #333;

    i {
      margin-right: 8px;
      color: #409eff;
      font-size: 18px;
    }
  }
}

// 表单内容
.card-form {
  .section-content {
    padding: 0 20px 20px;
  }
}

// 奖励配置区域
.reward-config-section {
  .reward-tabs {
    .el-tabs__header {
      margin-bottom: 16px;
    }

    .el-tabs__content {
      padding: 0;
    }
  }

  .search-toolbar {
    margin-bottom: 12px;

    .search-input {
      width: 300px;

      .el-input__inner {
        border-radius: 4px;
        border: 1px solid #dcdfe6;

        &:focus {
          border-color: #409eff;
        }
      }
    }
  }

  .table-toolbar {
    margin-bottom: 12px;
    display: flex;
    gap: 8px;
  }

  .reward-table {
    .el-table__header {
      background-color: #fafafa;
    }

    .el-table__row {
      &:hover {
        background-color: #f5f7fa;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .card-edit-content {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;

    .header-actions {
      width: 100%;
      justify-content: flex-end;
    }
  }

  .section-content {
    padding: 0 16px 16px !important;
  }
}

/* 奖励类型Tab样式 */
.reward-type-tabs {
  width: 100%;
}

.reward-type-tabs .el-tabs__header {
  margin-bottom: 0;
}

.reward-type-tabs .el-tabs__nav-wrap {
  background: #f5f7fa;
  border-radius: 4px;
  padding: 4px;
}

.reward-type-tabs .el-tabs__item {
  font-size: 14px;
  font-weight: 500;
  padding: 0 20px;
  height: 36px;
  line-height: 36px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.reward-type-tabs .el-tabs__item.is-active {
  background: #409eff;
  color: #fff;
  font-weight: 600;
}

.reward-type-tabs .el-tabs__item:hover {
  color: #409eff;
}

.reward-type-tabs .el-tabs__item.is-active:hover {
  color: #fff;
}

.reward-type-tabs .el-tabs__active-bar {
  display: none;
}

.reward-type-tabs .el-tabs__content {
  display: none;
}
</style>
