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
      <el-form-item label="流水号" prop="recordNo">
        <el-input
          v-model="queryParams.recordNo"
          placeholder="请输入流水号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单ID" prop="orderId">
        <el-input
          v-model="queryParams.orderId"
          placeholder="请输入订单ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单号" prop="orderNo">
        <el-input
          v-model="queryParams.orderNo"
          placeholder="请输入订单号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联盟店" prop="storeName">
        <el-input
          v-model="queryParams.storeName"
          placeholder="请输入联盟店名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="流量卡" prop="cardName">
        <el-input
          v-model="queryParams.cardName"
          placeholder="请输入流量卡名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="销售员" prop="salesmanName">
        <el-input
          v-model="queryParams.salesmanName"
          placeholder="请输入销售员"
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
      <el-form-item label="支付金额" prop="payAmount">
        <el-input
          v-model="queryParams.payAmount"
          placeholder="请输入支付金额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="支付渠道" prop="payChannel">
        <el-input
          v-model="queryParams.payChannel"
          placeholder="请输入支付渠道"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="第三方支付流水号" prop="transactionNo">
        <el-input
          v-model="queryParams.transactionNo"
          placeholder="请输入第三方支付流水号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="第三方订单号" prop="thirdOrderNo">
        <el-input
          v-model="queryParams.thirdOrderNo"
          placeholder="请输入第三方订单号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="支付完成时间" prop="payTime">
        <el-date-picker
          clearable
          v-model="queryParams.payTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择支付完成时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="手续费" prop="feeAmount">
        <el-input
          v-model="queryParams.feeAmount"
          placeholder="请输入手续费"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="实际到账金额" prop="actualAmount">
        <el-input
          v-model="queryParams.actualAmount"
          placeholder="请输入实际到账金额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="退款金额" prop="refundAmount">
        <el-input
          v-model="queryParams.refundAmount"
          placeholder="请输入退款金额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="退款时间" prop="refundTime">
        <el-date-picker
          clearable
          v-model="queryParams.refundTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择退款时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="退款流水号" prop="refundNo">
        <el-input
          v-model="queryParams.refundNo"
          placeholder="请输入退款流水号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="结算时间" prop="settleTime">
        <el-date-picker
          clearable
          v-model="queryParams.settleTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择结算时间"
        >
        </el-date-picker>
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
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:record:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="recordList">
      <el-table-column label="流水号ID" align="center" prop="recordId">
        <template slot-scope="scope">
          <el-button type="text" @click="handleDetail(scope.row.recordId)">{{
            scope.row.recordId
          }}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="流水号"
        align="center"
        prop="recordNo"
        width="140"
      />

      <el-table-column label="订单ID" align="center" prop="orderId" />
      <el-table-column
        label="订单号"
        align="center"
        prop="orderNo"
        width="140"
      />
      <el-table-column label="联盟店" align="center">
        <span slot-scope="scope" v-if="scope.row.allianceStore">
          {{ scope.row.allianceStore.storeName }}
        </span>
      </el-table-column>
      <el-table-column label="流量卡" align="center" prop="flowCard">
        <span slot-scope="scope" v-if="scope.row.flowCard">
          {{ scope.row.flowCard.cardName }}
        </span>
      </el-table-column>
      <el-table-column label="销售员" align="center">
        <span slot-scope="scope" v-if="scope.row.salesmanInfo">
          {{ scope.row.salesmanInfo.nickname }}
        </span>
      </el-table-column>
      <el-table-column label="客户姓名" align="center" prop="customerName" />
      <el-table-column
        label="客户手机号"
        align="center"
        prop="customerPhone"
        width="120"
      />
      <el-table-column label="支付金额" align="center" prop="payAmount" />
      <el-table-column label="支付方式" align="center" prop="payType" />
      <el-table-column label="支付渠道" align="center" prop="payChannel" />
      <el-table-column label="支付状态" align="center" prop="payStatus" />
      <el-table-column
        label="第三方支付流水号"
        align="center"
        width="160"
        prop="transactionNo"
      />
      <el-table-column
        label="第三方订单号"
        width="140"
        align="center"
        prop="thirdOrderNo"
      />
      <el-table-column
        label="支付完成时间"
        align="center"
        prop="payTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.payTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手续费" align="center" prop="feeAmount" />
      <el-table-column
        label="实际到账金额"
        align="center"
        width="140"
        prop="actualAmount"
      />
      <el-table-column label="退款金额" align="center" prop="refundAmount" />
      <el-table-column label="退款状态" align="center" prop="refundStatus" />
      <el-table-column
        label="退款时间"
        align="center"
        prop="refundTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.refundTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="退款流水号"
        align="center"
        prop="refundNo"
        width="140"
      />
      <el-table-column label="结算状态" align="center" prop="settleStatus" />
      <el-table-column
        label="结算时间"
        align="center"
        prop="settleTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.settleTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
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
import { listRecord } from "@/api/system/record";

export default {
  name: "Pay",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 支付流水表格数据
      recordList: [],
      // 联盟店选项
      storeOptions: [],
      // 流量卡选项
      cardOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        recordNo: null,
        orderId: null,
        orderNo: null,
        storeName: null,
        cardName: null,
        salesmanName: null,
        customerName: null,
        customerPhone: null,
        payAmount: null,
        payType: null,
        payChannel: null,
        payStatus: null,
        transactionNo: null,
        thirdOrderNo: null,
        payTime: null,
        feeAmount: null,
        actualAmount: null,
        refundAmount: null,
        refundStatus: null,
        refundTime: null,
        refundNo: null,
        settleStatus: null,
        settleTime: null,
        notifyStatus: null,
        callbackData: null,
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询支付流水列表 */
    getList() {
      this.loading = true;
      listRecord(this.queryParams).then((response) => {
        this.recordList = response.rows;
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
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "business/record/export",
        {
          ...this.queryParams,
        },
        `record_${new Date().getTime()}.xlsx`
      );
    },
    /** 查看详情按钮操作 */
    handleDetail(id) {
      console.log(id, "流水id");
      this.$router.push({
        path: `/report/pay-detail/detail/${id}`,
      });
    },
  },
};
</script>
