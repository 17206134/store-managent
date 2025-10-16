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
            icon="el-icon-view"
            @click="handleView(scope.row)"
            v-hasPermi="['main:card:view']"
            >查看</el-button
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
  </div>
</template>

<script>
import { listCard, delCard } from "@/api/system/card";

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
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        cardCode: null,
        cardName: null,
        // cardPrice: null,
        // status: null,
      },
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
      this.$router.push("/main/card-edit/add");
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const cardId = row.cardId || this.ids;
      this.$router.push(`/main/card-edit/index/${cardId}`);
    },
    handleView(row) {
      const cardId = row.cardId || this.ids;
      this.$router.push(`/main/card-edit/view/${cardId}`);
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
