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
      <el-form-item label="分公司编码" prop="branchCode">
        <el-input
          v-model="queryParams.branchCode"
          placeholder="请输入分公司编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分公司名称" prop="branchName">
        <el-input
          v-model="queryParams.branchName"
          placeholder="请输入分公司名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属大区" prop="regionId">
        <el-select
          v-model="queryParams.regionId"
          placeholder="请选择所属大区"
          clearable
          @change="handleQueryRegionChange"
        >
          <el-option
            v-for="region in regionList"
            :key="region.regionId"
            :label="region.regionName"
            :value="region.regionId"
          />
        </el-select>
      </el-form-item>
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
          v-hasPermi="['system:branch:add']"
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
          v-hasPermi="['system:branch:remove']"
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
          v-hasPermi="['system:branch:export']"
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
      :data="branchList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="分公司编码" align="center" prop="branchCode" />
      <el-table-column label="分公司名称" align="center" prop="branchName" />
      <el-table-column label="所属大区编码" align="center" prop="regionCode" />
      <el-table-column label="所属大区名称" align="center" prop="regionName" />
      <!-- <el-table-column label="显示顺序" align="center" prop="sortOrder" /> -->
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
            v-hasPermi="['system:branch:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:branch:remove']"
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

    <!-- 添加或修改分公司主数据对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="分公司编码" prop="branchCode">
          <el-input v-model="form.branchCode" placeholder="请输入分公司编码" />
        </el-form-item>
        <el-form-item label="分公司名称" prop="branchName">
          <el-input v-model="form.branchName" placeholder="请输入分公司名称" />
        </el-form-item>
        <el-form-item label="所属大区" prop="regionId">
          <el-select
            v-model="form.regionId"
            placeholder="请选择所属大区"
            style="width: 100%"
            @change="handleRegionChange"
            clearable
          >
            <el-option
              v-for="region in regionList"
              :key="region.regionId"
              :label="region.regionName"
              :value="region.regionId"
              :data-region-code="region.regionCode"
              :data-region-name="region.regionName"
            />
          </el-select>
        </el-form-item>
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
  listBranch,
  getBranch,
  delBranch,
  addBranch,
  updateBranch,
} from "@/api/system/branch";
import { listRegion } from "@/api/system/region";

export default {
  name: "Branch",
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
      // 分公司主数据表格数据
      branchList: [],
      // 大区列表数据
      regionList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        branchCode: null,
        branchName: null,
        regionId: null,
        regionCode: null,
        regionName: null,
        // sortOrder: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        branchCode: [
          { required: true, message: "分公司编码不能为空", trigger: "blur" },
        ],
        branchName: [
          { required: true, message: "分公司名称不能为空", trigger: "blur" },
        ],
        regionId: [
          { required: true, message: "所属大区ID不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getRegionList();
  },
  methods: {
    /** 查询分公司主数据列表 */
    getList() {
      this.loading = true;
      listBranch(this.queryParams).then((response) => {
        this.branchList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询大区列表 */
    getRegionList() {
      return listRegion({ pageNum: 1, pageSize: 999 }).then((response) => {
        this.regionList = response.rows || [];
      });
    },
    /** 大区选择变化处理 */
    handleRegionChange(regionId) {
      if (regionId) {
        const selectedRegion = this.regionList.find(
          (region) => region.regionId === regionId
        );
        if (selectedRegion) {
          this.form.regionCode = selectedRegion.regionCode;
          this.form.regionName = selectedRegion.regionName;
        }
      } else {
        this.form.regionCode = null;
        this.form.regionName = null;
      }
    },
    /** 搜索表单大区选择变化处理 */
    handleQueryRegionChange(regionId) {
      if (regionId) {
        const selectedRegion = this.regionList.find(
          (region) => region.regionId === regionId
        );
        if (selectedRegion) {
          this.queryParams.regionCode = selectedRegion.regionCode;
          this.queryParams.regionName = selectedRegion.regionName;
          this.handleQuery();
        }
      } else {
        this.queryParams.regionCode = null;
        this.queryParams.regionName = null;
      }
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        branchId: null,
        branchCode: null,
        branchName: null,
        regionId: null,
        regionCode: null,
        regionName: null,
        // sortOrder: null,
        status: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
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
      this.ids = selection.map((item) => item.branchId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加分公司主数据";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const branchId = row.branchId || this.ids;
      getBranch(branchId).then((response) => {
        this.form = response.data;
        // 确保大区列表已加载
        if (this.regionList.length === 0) {
          this.getRegionList().then(() => {
            this.open = true;
            this.title = "修改分公司主数据";
          });
        } else {
          this.open = true;
          this.title = "修改分公司主数据";
        }
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.branchId != null) {
            updateBranch(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addBranch(this.form).then((response) => {
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
      const branchIds = row.branchId || this.ids;
      this.$modal
        .confirm('是否确认删除分公司主数据编号为"' + branchIds + '"的数据项？')
        .then(function () {
          return delBranch(branchIds);
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
        "business/branch/export",
        {
          ...this.queryParams,
        },
        `branch_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
