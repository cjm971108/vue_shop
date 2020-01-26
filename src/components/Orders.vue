<!--  -->
<template>
  <div class>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <!-- 用户搜索框 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-input placeholder="请输入内容" v-model="usersForm.query" class="input-with-select">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </div>
        </el-col>
      </el-row>
      <!-- 订单列表 -->
      <el-table :data="orderList" border style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="180"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column prop="" label="是否付款">
            <template slot-scope="scope">
                <el-tag type="danger" v-if="!scope.row.pay_status">未付款</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否收货"></el-table-column>
        <el-table-column label="下单时间">
            <template slot-scope="scope">
                {{ moment(scope.row.create_time).format(YYYY-MM-DD)}}
            </template>
        </el-table-column>
        <el-table-column label="操作" width="220px">
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="usersForm.pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="usersForm.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'Users',
  data() {
    return {
      usersForm: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      orderList: [],
      total: 0,
      addDialogVisible: false,
      editForm: {},
      editDialogVisible: false,
      userInfo: {},
      rolesList: [],
      setRoleDialogVisible: false,
      selectedRoleId: '',
      model: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      }
    }
  },
  created() {
    this.ordersList()
  },
  methods: {
    moment,
    async ordersList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.usersForm
      })
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    // 用户列表页大小改变
    handleSizeChange(newSize) {
      this.usersForm.pagesize = newSize
      this.ordersList()
    },
    // 用户列表页号改变
    handleCurrentChange(newPage) {
      this.usersForm.pagenum = newPage
      this.ordersList()
    }
  }
}
</script>
<style lang='less' scoped>
</style>
