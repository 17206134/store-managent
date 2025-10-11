<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <!-- <el-form-item label="顾问编码" prop="consultantCode">
        <el-input
          v-model="queryParams.consultantCode"
          placeholder="请输入顾问编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="顾问姓名" prop="consultantName">
        <el-input
          v-model="queryParams.consultantName"
          placeholder="请输入顾问姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入手机号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="账户" prop="userAccount">
        <el-input
          v-model="queryParams.userAccount"
          placeholder="请输入账户"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input
          v-model="queryParams.email"
          placeholder="请输入邮箱"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select
          v-model="queryParams.gender"
          placeholder="请选择性别"
          clearable
          @change="handleQuery"
        >
          <el-option
            v-for="dict in dict.type.sys_user_sex"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="身份证号" prop="idCard">
        <el-input
          v-model="queryParams.idCard"
          placeholder="请输入身份证号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <!-- <el-form-item label="显示顺序" prop="sortOrder">
        <el-input
          v-model="queryParams.sortOrder"
          placeholder="请输入显示顺序"
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
          v-hasPermi="['main:consultant:add']"
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
          v-hasPermi="['main:consultant:remove']"
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
          v-hasPermi="['main:consultant:export']"
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
      :data="consultantList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="咨询顾问ID" align="center" prop="consultantId" /> -->
      <el-table-column label="顾问编码" align="center" prop="consultantCode" />
      <el-table-column label="顾问姓名" align="center" prop="consultantName" />
      <el-table-column label="手机号" align="center" prop="phone" />
      <el-table-column label="账户" align="center" prop="userAccount" />
      <el-table-column label="邮箱" align="center" prop="email" />
      <el-table-column label="性别" align="center">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.sys_user_sex"
            :value="scope.row.gender"
          />
        </template>
      </el-table-column>
      <!-- <el-table-column label="身份证号" align="center" prop="idCard" /> -->
      <!-- <el-table-column label="显示顺序" align="center" prop="sortOrder" /> -->
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
            v-hasPermi="['main:consultant:edit']"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['main:consultant:remove']"
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

    <!-- 添加或修改咨询顾问主数据对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="顾问编码" prop="consultantCode">
          <el-input
            v-model="form.consultantCode"
            placeholder="请输入顾问编码"
          />
        </el-form-item>
        <el-form-item label="顾问姓名" prop="consultantName">
          <el-input
            v-model="form.consultantName"
            placeholder="请输入顾问姓名"
          />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="账户" prop="userAccount">
          <el-input v-model="form.userAccount" placeholder="请输入账户" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select
            style="width: 100%"
            v-model="form.gender"
            placeholder="请选择性别"
          >
            <el-option
              v-for="dict in dict.type.sys_user_sex"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="身份证号" prop="idCard">
          <el-input v-model="form.idCard" placeholder="请输入身份证号" />
        </el-form-item> -->
        <!-- <el-form-item label="显示顺序" prop="sortOrder">
          <el-input v-model="form.sortOrder" placeholder="请输入显示顺序" />
        </el-form-item> -->
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
  listConsultant,
  getConsultant,
  delConsultant,
  addConsultant,
  updateConsultant,
} from "@/api/system/consultant";
import { getDicts } from "@/api/system/dict/data";

export default {
  name: "Consultant",
  dicts: ["sys_user_sex"],
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
      // 咨询顾问主数据表格数据
      consultantList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        // consultantCode: null,
        consultantName: null,
        phone: null,
        userAccount: null,
        email: null,
        gender: null,
        // idCard: null,
        // sortOrder: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        consultantCode: [
          { required: true, message: "顾问编码不能为空", trigger: "blur" },
        ],
        consultantName: [
          { required: true, message: "顾问姓名不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询咨询顾问主数据列表 */
    getList() {
      this.loading = true;
      listConsultant(this.queryParams).then((response) => {
        this.consultantList = response.rows;
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
        consultantId: null,
        consultantCode: null,
        consultantName: null,
        phone: null,
        userAccount: null,
        email: null,
        gender: null,
        // idCard: null,
        // sortOrder: null,
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
      this.ids = selection.map((item) => item.consultantId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加咨询顾问主数据";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const consultantId = row.consultantId || this.ids;
      getConsultant(consultantId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改咨询顾问主数据";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.consultantId != null) {
            updateConsultant(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addConsultant(this.form).then((response) => {
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
      const consultantIds = row.consultantId || this.ids;
      this.$modal
        .confirm(
          '是否确认删除咨询顾问主数据编号为"' + consultantIds + '"的数据项？'
        )
        .then(function () {
          return delConsultant(consultantIds);
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
        "system/consultant/export",
        {
          ...this.queryParams,
        },
        `consultant_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
