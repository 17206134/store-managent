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
          icon="el-icon-circle-check"
          size="mini"
          :disabled="multiple"
          @click="handleVerify"
          v-hasPermi="['system:order:remove']"
          >核销</el-button
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
    <el-tabs v-model="orderStatus" type="card" @tab-click="getList">
      <el-tab-pane
        v-for="i in orderStatusList"
        :key="i.orderStatusText"
        :label="i.orderStatusText"
        :name="i.orderStatus"
      >
        <el-table
          v-loading="loading"
          :data="orderList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="订单ID" align="center" prop="orderId" />
          <el-table-column
            label="订单号"
            width="120"
            align="center"
            prop="orderNo"
          />
          <el-table-column
            label="客户姓名"
            align="center"
            prop="customerName"
          />
          <el-table-column
            label="客户手机号"
            width="160"
            align="center"
            prop="customerPhone"
          />
          <el-table-column
            label="订单金额(元)"
            width="120"
            align="center"
            prop="orderAmount"
          />
          <el-table-column
            label="订单状态"
            align="center"
            prop="orderStatusText"
          />
          <el-table-column
            label="支付状态"
            align="center"
            prop="payStatusText"
          />
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
          />
          <el-table-column
            label="订单过期时间"
            align="center"
            prop="expireTime"
            width="180"
          />
          <el-table-column
            label="核销状态"
            align="center"
            prop="verifyStatusText"
          />
          <el-table-column
            label="核销时间"
            align="center"
            prop="verifyTime"
            width="180"
          />

          <el-table-column label="核销人" align="center" prop="verifyBy" />
          <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
          >
            <!-- <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:order:remove']"
            >删除</el-button
          >
        </template> -->
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                v-if="scope.row.orderStatus == '1'"
                @click="handleVerify(scope.row)"
                v-hasPermi="['system:order:verify']"
                >核销</el-button
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
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { listOrder, batchVerify } from "@/api/system/order";

export default {
  name: "Order",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      selectionList: [],
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
        customerName: null,
        customerPhone: null,
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
      orderStatus: "all",
      orderStatusList: [
        {
          orderStatus: "all",
          orderStatusText: "全部",
        },
        {
          orderStatus: "0",
          orderStatusText: "待支付",
        },
        {
          orderStatus: "1",
          orderStatusText: "已支付",
        },
        {
          orderStatus: "2",
          orderStatusText: "已取消",
        },
        {
          orderStatus: "3",
          orderStatusText: "已退款",
        },
        {
          orderStatus: "4",
          orderStatusText: "已完成",
        },
      ],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询流量卡订单列表 */
    getList() {
      this.loading = true;
      listOrder({
        ...this.queryParams,
        orderStatus: this.orderStatus === "all" ? null : this.orderStatus,
      }).then((response) => {
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
      this.selectionList = selection;
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 删除按钮操作 */
    handleVerify(row) {
      const isNotVerify = this.selectionList.some(
        (item) => item.orderStatus !== "1"
      );
      if (isNotVerify) {
        return this.$modal.msgError("存在未完成订单，不能核销！");
      }
      const orderIds = row.orderId
        ? [row.orderId]
        : this.selectionList.map((item) => item.orderId);
      this.$modal
        .confirm(
          '是否确认核销订单编号为"' + orderIds.join("、") + '"的数据项？'
        )
        .then(function () {
          return batchVerify(orderIds);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("核销成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "business/order/export",
        {
          ...this.queryParams,
        },
        `order_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
