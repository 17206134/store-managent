<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="120px"
    >
      <el-form-item label="门店名称" prop="storeName">
        <el-input
          v-model="queryParams.storeName"
          placeholder="请输入门店名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="店长名称" prop="bossName">
        <el-input
          v-model="queryParams.bossName"
          placeholder="请输入店长名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="店长手机号" prop="bossPhone">
        <el-input
          v-model="queryParams.bossPhone"
          placeholder="请输入店长手机号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="咨询顾问" prop="consultantCode">
        <el-select
          v-model="queryParams.consultantCode"
          placeholder="请选择咨询顾问"
          clearable
          @keyup.enter.native="handleQuery"
        >
          <el-option
            v-for="consultant in consultantList"
            :key="consultant.consultantId"
            :label="consultant.consultantName"
            :value="consultant.consultantCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所属大区" prop="regionCode">
        <el-select
          v-model="queryParams.regionCode"
          placeholder="请选择所属大区"
          clearable
          @change="handleRegionChange"
          @keyup.enter.native="handleQuery"
        >
          <el-option
            v-for="region in regionList"
            :key="region.regionId"
            :label="region.regionName"
            :value="region.regionCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="分公司名称" prop="branchCode">
        <el-select
          v-model="queryParams.branchCode"
          placeholder="请选择分公司名称"
          clearable
          :disabled="!queryParams.regionCode"
          @keyup.enter.native="handleQuery"
        >
          <el-option
            v-for="branch in filteredBranchList"
            :key="branch.branchId"
            :label="branch.branchName"
            :value="branch.branchCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['main:store:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['main:store:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['main:store:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="storeList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="门店ID" align="center" prop="storeId" />
      <el-table-column label="门店名称" align="center" prop="storeName" />
      <el-table-column label="店长名称" align="center" prop="bossName" />
      <el-table-column label="店长手机号" align="center" prop="bossPhone" />
      <el-table-column
        label="咨询顾问姓名"
        align="center"
        prop="consultantName"
      />
      <el-table-column label="所属大区" align="center" prop="regionName" />
      <el-table-column label="分公司名称" align="center" prop="branchCompany" />
      <el-table-column label="已绑定的卡" align="left" prop="flowCardList">
        <template slot-scope="scope">
          <div>{{ scope.row.flowCardList | dealListByCard }}</div>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-paperclip"
            @click="bindCard(scope.row)"
            v-hasPermi="['main:store:bind']"
            >绑卡</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['main:store:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['main:store:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改门店主对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="门店名称" prop="storeName">
          <el-input v-model="form.storeName" placeholder="请输入门店名称" />
        </el-form-item>
        <el-form-item label="店长名称" prop="bossName">
          <el-input v-model="form.bossName" placeholder="请输入店长名称" />
        </el-form-item>
        <el-form-item label="店长手机号" prop="bossPhone">
          <el-input v-model="form.bossPhone" placeholder="请输入店长手机号" />
        </el-form-item>
        <el-form-item label="咨询顾问" prop="consultantCode">
          <el-select
            v-model="form.consultantCode"
            placeholder="请选择咨询顾问"
            style="width: 100%"
          >
            <el-option
              v-for="consultant in consultantList"
              :key="consultant.consultantId"
              :label="consultant.consultantName"
              :value="consultant.consultantCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属大区" prop="regionCode">
          <el-select
            v-model="form.regionCode"
            placeholder="请选择所属大区"
            style="width: 100%"
            @change="handleFormRegionChange"
          >
            <el-option
              v-for="region in regionList"
              :key="region.regionId"
              :label="region.regionName"
              :value="region.regionCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="分公司名称" prop="branchCode">
          <el-select
            v-model="form.branchCode"
            placeholder="请选择分公司名称"
            style="width: 100%"
            :disabled="!form.regionCode"
          >
            <el-option
              v-for="branch in filteredFormBranchList"
              :key="branch.branchId"
              :label="branch.branchName"
              :value="branch.branchCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 绑卡、解绑 -->
    <el-dialog
      title="绑卡"
      :visible.sync="openCard"
      width="600px"
      append-to-body
    >
      <el-form label-width="120px">
        <el-form-item label="门店名称">
          <el-input :value="selectStore.storeName" disabled />
        </el-form-item>
        <el-form-item label="店长名称">
          <el-input :value="selectStore.bossName" disabled />
        </el-form-item>
        <el-form-item label="店长手机号">
          <el-input :value="selectStore.bossPhone" disabled />
        </el-form-item>
        <el-form-item label="已绑定流量卡">
          <el-select
            style="width: 100%"
            v-model="cardList"
            multiple
            placeholder="请选择"
          >
            <el-option
              v-for="item in selectCardList"
              :key="item.value"
              :label="item.cardName"
              :value="item.cardId"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sureBindCard">确 定</el-button>
        <el-button @click="openCard = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listStore,
  getStore,
  delStore,
  addStore,
  updateStore,
  updateCard,
  cardListWithBindStatusList,
} from "@/api/system/store";
import { listConsultant } from "@/api/system/consultant";
import { listRegion } from "@/api/system/region";
import { listBranch } from "@/api/system/branch";

export default {
  name: "Store",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 门店主表格数据
      storeList: [],
      // 咨询顾问列表
      consultantList: [],
      // 大区列表
      regionList: [],
      // 分公司列表
      branchList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 绑卡弹出层
      openCard: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        storeName: null,
        bossName: null,
        bossPhone: null,
        consultantCode: null,
        branchCode: null,
        regionCode: null,
      },
      // 表单参数
      form: {},
      selectStore: {},
      cardList: [], // 已绑定流量卡
      selectCardList: [], // 已选择流量卡
      // 表单校验
      rules: {},
    };
  },
  filters: {
    dealListByCard(list) {
      if (!list || !list.length) return "-"; // 增加对null/undefined的判断
      return list.map((item) => item.cardName).join("、");
    },
  },
  computed: {
    // 根据选择的大区过滤分公司列表（搜索表单）
    filteredBranchList() {
      if (!this.queryParams.regionCode) {
        return [];
      }
      return this.branchList.filter(
        (branch) => branch.regionCode === this.queryParams.regionCode
      );
    },
    // 根据选择的大区过滤分公司列表（编辑表单）
    filteredFormBranchList() {
      if (!this.form.regionCode) {
        return [];
      }
      return this.branchList.filter(
        (branch) => branch.regionCode === this.form.regionCode
      );
    },
  },
  created() {
    this.getList();
    this.getConsultantList();
    this.getRegionList();
    this.getBranchList();
  },
  methods: {
    /** 查询门店主列表 */
    getList() {
      this.loading = true;
      listStore(this.queryParams).then((response) => {
        this.storeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 获取咨询顾问列表 */
    getConsultantList() {
      listConsultant({ pageNum: 1, pageSize: 999 }).then((response) => {
        this.consultantList = response.rows || [];
      });
    },
    /** 获取大区列表 */
    getRegionList() {
      listRegion({ pageNum: 1, pageSize: 999 }).then((response) => {
        this.regionList = response.rows || [];
      });
    },
    /** 获取分公司列表 */
    getBranchList() {
      listBranch({ pageNum: 1, pageSize: 999 }).then((response) => {
        this.branchList = response.rows || [];
      });
    },
    /** 搜索表单大区选择变化处理 */
    handleRegionChange(regionCode) {
      // 清空分公司选择
      this.queryParams.branchCode = null;
    },
    /** 编辑表单大区选择变化处理 */
    handleFormRegionChange(regionCode) {
      // 清空分公司选择
      this.form.branchCode = null;
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        storeName: null,
        bossName: null,
        bossPhone: null,
        consultantCode: null,
        branchCode: null,
        regionCode: null,
        remark: null,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.storeId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加门店";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const storeId = row.storeId || this.ids;
      getStore(storeId).then((response) => {
        const {
          storeName,
          bossName,
          bossPhone,
          consultantCode,
          branchCode,
          regionCode,
          remark,
        } = response.data;
        this.form = {
          storeName,
          bossName,
          bossPhone,
          consultantCode,
          branchCode,
          regionCode,
          remark,
        };
        this.open = true;
        this.title = "修改门店";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.storeId != null) {
            updateStore(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addStore(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 打开绑卡弹窗 */
    bindCard(row) {
      this.openCard = true;
      this.selectStore = {
        storeName: row.storeName,
        storeIds: row.storeId,
        bossName: row.bossName,
        bossPhone: row.bossPhone,
      };
      const storeIds = row.storeId;
      if (storeIds) {
        /** 查询流量卡列表及绑定状态 */
        cardListWithBindStatusList(storeIds).then((res) => {
          this.selectCardList = res.data;
          this.cardList = res.data
            ?.filter((o) => o.isBound)
            ?.map((i) => i.cardId);
          console.log(this.cardList, "cardListcardList");
        });
      } else {
        this.$modal.msgError("请先选择门店");
      }
    },
    /** 确定绑卡操作 */
    sureBindCard() {
      const { storeIds = "" } = this.selectStore;
      if (storeIds) {
        updateCard({ storeId: storeIds, cardIds: this.cardList }).then(
          (response) => {
            this.$modal.msgSuccess("修改成功");
            this.openCard = false;
            this.getList();
            // 关闭弹窗，信息清空
            this.selectStore = {};
            this.cardList = [];
          }
        );
      } else {
        this.$modal.msgError("请先选择门店");
      }
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const storeIds = row.storeId || this.ids;
      this.$modal
        .confirm('是否确认删除门店主编号为"' + storeIds + '"的数据项？')
        .then(function () {
          return delStore(storeIds);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "business/store/export",
        {
          ...this.queryParams,
        },
        `store_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
