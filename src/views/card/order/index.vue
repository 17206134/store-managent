<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="140px"
    >
      <el-form-item label="订单号" prop="orderNo">
        <el-input
          v-model="queryParams.orderNo"
          placeholder="请输入订单号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联盟店ID" prop="storeId">
        <el-input
          v-model="queryParams.storeId"
          placeholder="请输入联盟店ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="流量卡ID" prop="cardId">
        <el-input
          v-model="queryParams.cardId"
          placeholder="请输入流量卡ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="销售员ID" prop="salesmanId">
        <el-input
          v-model="queryParams.salesmanId"
          placeholder="请输入销售员ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户姓名" prop="customerName">
        <el-input
          v-model="queryParams.customerName"
          placeholder="请输入客户姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户手机号" prop="customerPhone">
        <el-input
          v-model="queryParams.customerPhone"
          placeholder="请输入客户手机号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单金额" prop="orderAmount">
        <el-input
          v-model="queryParams.orderAmount"
          placeholder="请输入订单金额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="微信支付订单号" prop="wxOrderNo">
        <el-input
          v-model="queryParams.wxOrderNo"
          placeholder="请输入微信支付订单号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="微信支付交易流水号" prop="wxTransactionId">
        <el-input
          v-model="queryParams.wxTransactionId"
          placeholder="请输入微信支付交易流水号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="支付时间" prop="payTime">
        <el-date-picker
          clearable
          style="width: 215px"
          v-model="queryParams.payTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择支付时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="订单过期时间" prop="expireTime">
        <el-date-picker
          clearable
          style="width: 215px"
          v-model="queryParams.expireTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择订单过期时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="核销时间" prop="verifyTime">
        <el-date-picker
          clearable
          style="width: 215px"
          v-model="queryParams.verifyTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择核销时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="核销人" prop="verifyBy">
        <el-input
          v-model="queryParams.verifyBy"
          placeholder="请输入核销人"
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
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:order:remove']"
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
          v-hasPermi="['system:order:export']"
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
      :data="orderList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="订单ID" align="center" prop="orderId" />
      <el-table-column label="订单号" align="center" prop="orderNo" />
      <el-table-column label="联盟店ID" align="center" prop="storeId" />
      <el-table-column label="流量卡ID" align="center" prop="cardId" />
      <el-table-column label="销售员ID" align="center" prop="salesmanId" />
      <el-table-column label="客户姓名" align="center" prop="customerName" />
      <el-table-column
        label="客户手机号"
        width="160"
        align="center"
        prop="customerPhone"
      />
      <el-table-column label="订单金额" align="center" prop="orderAmount" />
      <el-table-column label="订单状态" align="center" prop="orderStatus" />
      <el-table-column label="支付状态" align="center" prop="payStatus" />
      <el-table-column label="支付方式" align="center" prop="payType" />
      <el-table-column
        label="支付二维码URL"
        align="center"
        width="200"
        prop="qrCodeUrl"
      />
      <el-table-column
        label="微信支付订单号"
        align="center"
        width="200"
        prop="wxOrderNo"
      />
      <el-table-column
        label="微信支付交易流水号"
        align="center"
        width="200"
        prop="wxTransactionId"
      />
      <el-table-column
        label="支付时间"
        align="center"
        prop="payTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.payTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="订单过期时间"
        align="center"
        prop="expireTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.expireTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="核销状态" align="center" prop="verifyStatus" />
      <el-table-column
        label="核销时间"
        align="center"
        prop="verifyTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.verifyTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="核销人" align="center" prop="verifyBy" />
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
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:order:remove']"
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
import { listOrder, delOrder } from "@/api/system/order";

export default {
  name: "Order",
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
      // 流量卡订单表格数据
      orderList: [],
      // 弹出层标题
      title: "",
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderNo: null,
        storeId: null,
        cardId: null,
        salesmanId: null,
        customerName: null,
        customerPhone: null,
        orderAmount: null,
        orderStatus: null,
        payStatus: null,
        payType: null,
        qrCodeUrl: null,
        wxOrderNo: null,
        wxTransactionId: null,
        payTime: null,
        expireTime: null,
        verifyStatus: null,
        verifyTime: null,
        verifyBy: null,
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询流量卡订单列表 */
    getList() {
      this.loading = true;
      listOrder(this.queryParams).then((response) => {
        this.orderList = response.rows;
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
      this.ids = selection.map((item) => item.orderId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const orderIds = row.orderId || this.ids;
      this.$modal
        .confirm('是否确认删除流量卡订单编号为"' + orderIds + '"的数据项？')
        .then(function () {
          return delOrder(orderIds);
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
        "system/order/export",
        {
          ...this.queryParams,
        },
        `order_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
