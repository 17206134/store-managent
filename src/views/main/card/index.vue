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
      <el-form-item label="流量卡编码" prop="cardCode">
        <el-input
          v-model="queryParams.cardCode"
          placeholder="请输入流量卡编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="流量卡名称" prop="cardName">
        <el-input
          v-model="queryParams.cardName"
          placeholder="请输入流量卡名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="流量卡单价" prop="cardPrice">
        <el-input
          v-model="queryParams.cardPrice"
          placeholder="请输入流量卡单价"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="卖卡人奖励金" prop="sellerRewardAmount">
        <el-input
          v-model="queryParams.sellerRewardAmount"
          placeholder="请输入卖卡人奖励金"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联盟店奖励金" prop="storeRewardAmount">
        <el-input
          v-model="queryParams.storeRewardAmount"
          placeholder="请输入联盟店奖励金"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
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
          v-hasPermi="['main:card:add']"
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
          v-hasPermi="['main:card:remove']"
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
          v-hasPermi="['main:card:export']"
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
      :data="cardList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="流量卡ID" align="center" prop="cardId" /> -->
      <el-table-column label="流量卡编码" align="center" prop="cardCode" />
      <el-table-column label="流量卡名称" align="center" prop="cardName" />
      <el-table-column label="流量卡单价" align="center" prop="cardPrice" />
      <el-table-column
        label="卖卡人奖励金"
        align="center"
        prop="sellerRewardAmount"
      />
      <el-table-column
        label="联盟店奖励金"
        align="center"
        prop="storeRewardAmount"
      />
      <!-- <el-table-column label="状态" align="center" prop="status" /> -->
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
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['main:card:edit']"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['main:card:remove']"
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

    <!-- 添加或修改流量卡主对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="流量卡编码" prop="cardCode">
          <el-input v-model="form.cardCode" placeholder="请输入流量卡编码" />
        </el-form-item>
        <el-form-item label="流量卡名称" prop="cardName">
          <el-input v-model="form.cardName" placeholder="请输入流量卡名称" />
        </el-form-item>
        <el-form-item label="流量卡单价" prop="cardPrice">
          <el-input v-model="form.cardPrice" placeholder="请输入流量卡单价" />
        </el-form-item>
        <el-form-item label="卖卡人奖励金" prop="sellerRewardAmount">
          <el-input
            v-model="form.sellerRewardAmount"
            placeholder="请输入卖卡人奖励金"
          />
        </el-form-item>
        <el-form-item label="联盟店奖励金" prop="storeRewardAmount">
          <el-input
            v-model="form.storeRewardAmount"
            placeholder="请输入联盟店奖励金"
          />
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
  </div>
</template>

<script>
import {
  listCard,
  getCard,
  delCard,
  addCard,
  updateCard,
} from "@/api/system/card";

export default {
  name: "Card",
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
      // 流量卡主表格数据
      cardList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        cardCode: null,
        cardName: null,
        cardPrice: null,
        // sellerRewardAmount: null,
        // storeRewardAmount: null,
        // status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询流量卡主列表 */
    getList() {
      this.loading = true;
      listCard(this.queryParams).then((response) => {
        this.cardList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        cardId: null,
        cardCode: null,
        cardName: null,
        cardPrice: null,
        sellerRewardAmount: null,
        storeRewardAmount: null,
        // status: null,
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
      this.ids = selection.map((item) => item.cardId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加流量卡主数据";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const cardId = row.cardId || this.ids;
      getCard(cardId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改流量卡主数据";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.cardId != null) {
            updateCard(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCard(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const cardIds = row.cardId || this.ids;
      this.$modal
        .confirm('是否确认删除流量卡主编号为"' + cardIds + '"的数据项？')
        .then(function () {
          return delCard(cardIds);
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
        "business/card/export",
        {
          ...this.queryParams,
        },
        `card_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
