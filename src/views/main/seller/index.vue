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
      <el-form-item label="卖卡人类型编码" prop="sellerCode">
        <el-input
          v-model="queryParams.sellerCode"
          placeholder="请输入卖卡人类型编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="卖卡人类型名称" prop="sellerName">
        <el-input
          v-model="queryParams.sellerName"
          placeholder="请输入卖卡人类型名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="卖卡人父级编码" prop="parentCode">
        <el-cascader
          v-model="queryParams.parentCode"
          :options="parentCodeOptions"
          :props="{
            value: 'sellerCode',
            label: 'sellerName',
            children: 'children',
            checkStrictly: true,
          }"
          placeholder="请选择卖卡人父级编码"
          clearable
          style="width: 100%"
        />
      </el-form-item> -->
      <!-- <el-form-item label="卖卡人层级" prop="sellerLevel">
        <el-input
          v-model="queryParams.sellerLevel"
          placeholder="请输入卖卡人层级"
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
          v-hasPermi="['system:seller:add']"
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
          v-hasPermi="['system:seller:remove']"
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
          v-hasPermi="['system:seller:export']"
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
      :data="sellerList"
      row-key="sellerId"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="卖卡人ID" align="center" prop="sellerId" /> -->
      <el-table-column label="卖卡人类型编码" align="left" prop="sellerCode" />
      <el-table-column
        label="卖卡人类型名称"
        align="center"
        prop="sellerName"
      />
      <el-table-column
        label="卖卡人父级编码"
        align="center"
        prop="parentCode"
      />
      <el-table-column label="卖卡人层级" align="center" prop="sellerLevel">
        <template slot-scope="scope">
          {{ numberToChineseLevel(scope.row.sellerLevel) }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="排序" align="center" prop="sortOrder" /> -->
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
            icon="el-icon-plus"
            @click="handleAddChild(scope.row)"
            v-hasPermi="['system:seller:add']"
            >新增子级</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:seller:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:seller:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 树形数据不需要分页 -->

    <!-- 添加或修改卖卡人对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="卖卡人类型编码" prop="sellerCode">
          <el-input
            v-model="form.sellerCode"
            placeholder="请输入卖卡人类型编码"
          />
        </el-form-item>
        <el-form-item label="卖卡人类型名称" prop="sellerName">
          <el-input
            v-model="form.sellerName"
            placeholder="请输入卖卡人类型名称"
          />
        </el-form-item>
        <el-form-item
          v-if="isAddChild || title === '修改卖卡人'"
          label="卖卡人父级类型"
          prop="parentCode"
        >
          <el-cascader
            v-model="form.parentCode"
            :options="parentCodeOptions"
            :props="{
              value: 'sellerCode',
              label: 'sellerName',
              children: 'children',
              checkStrictly: true,
              emitPath: false,
            }"
            placeholder="请选择卖卡人父级类型"
            :disabled="isAddChild && title !== '修改卖卡人'"
            clearable
            style="width: 100%"
          />
        </el-form-item>
        <!-- <el-form-item label="卖卡人层级" prop="sellerLevel">
          <el-input v-model="form.sellerLevel" placeholder="请输入卖卡人层级" />
        </el-form-item> -->
        <!-- <el-form-item label="排序" prop="sortOrder">
          <el-input v-model="form.sortOrder" placeholder="请输入排序" />
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
  getSellerTree,
  getSeller,
  delSeller,
  addSeller,
  updateSeller,
} from "@/api/system/seller";
import { numberToChineseLevel } from "@/utils/num";
export default {
  name: "Seller",
  data() {
    return {
      numberToChineseLevel: numberToChineseLevel,
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
      // 卖卡人表格数据
      sellerList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否为新增子级模式
      isAddChild: false,
      // 查询参数
      queryParams: {
        sellerCode: null,
        sellerName: null,
        // parentCode: null,
        // sellerLevel: null,
        // sortOrder: null,
        // status: null, // 0-正常 1-停用
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        sellerCode: [
          {
            required: true,
            message: "卖卡人类型编码不能为空",
            trigger: "blur",
          },
        ],
        sellerName: [
          {
            required: true,
            message: "卖卡人类型名称不能为空",
            trigger: "blur",
          },
        ],
      },
      // 父级编码选项
      parentCodeOptions: [],
    };
  },
  created() {
    this.getList();
    this.getParentCodeOptions();
  },
  methods: {
    /** 查询卖卡人列表 */
    getList() {
      this.loading = true;
      getSellerTree(this.queryParams).then((response) => {
        this.sellerList = response.data;
        this.total = response.data.length;
        this.loading = false;
      });
    },
    /** 获取父级编码选项 */
    getParentCodeOptions() {
      getSellerTree().then((response) => {
        let treeData = response.data || [];
        // 如果是编辑模式，排除当前编辑的账号及其子节点
        if (this.form.sellerId) {
          treeData = this.filterTreeData(treeData, this.form.sellerId);
        }
        this.parentCodeOptions = treeData;
      });
    },

    /** 过滤树形数据，排除指定节点及其子节点 */
    filterTreeData(treeData, excludeId) {
      return treeData.filter((item) => {
        if (item.sellerId === excludeId) {
          return false; // 排除当前编辑的节点
        }
        // 递归过滤子节点
        if (item.children && item.children.length > 0) {
          item.children = this.filterTreeData(item.children, excludeId);
        }
        return true;
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
        sellerId: null,
        sellerCode: null,
        sellerName: null,
        parentCode: null,
        // sellerLevel: null,
        // sortOrder: null,
        // status: null,
        remark: null,
      };
      this.isAddChild = false; // 重置新增子级模式标识
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.sellerId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加一级卖卡人";
      // 获取父级编码选项
      this.getParentCodeOptions();
    },
    /** 新增子级按钮操作 */
    handleAddChild(row) {
      this.reset();
      this.isAddChild = true; // 设置为新增子级模式
      this.form.parentCode = row.sellerCode; // 自动设置父级编码
      this.open = true;
      this.title = "添加子级卖卡人";
      // 获取父级编码选项
      this.getParentCodeOptions();
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const sellerId = row.sellerId || this.ids;
      getSeller(sellerId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改卖卡人";
        // 获取父级编码选项（排除当前编辑的账号）
        this.getParentCodeOptions();
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.sellerId != null) {
            updateSeller(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSeller(this.form).then((response) => {
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
      const sellerIds = row.sellerId || this.ids;
      this.$modal
        .confirm('是否确认删除卖卡人编号为"' + sellerIds + '"的数据项？')
        .then(function () {
          return delSeller(sellerIds);
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
        "business/seller/export",
        {
          ...this.queryParams,
        },
        `seller_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
