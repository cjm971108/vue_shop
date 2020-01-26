<!--  -->
<template>
  <div class>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <!-- 用户搜索框 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-input placeholder="请输入内容" v-model="usersForm.query" class="input-with-select">
              <el-button slot="append" icon="el-icon-search" @click="usersList"></el-button>
            </el-input>
          </div>
        </el-col>
        <!-- 添加新用户 -->
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
          </div>
        </el-col>
      </el-row>
      <!-- 添加用户的对话框 -->
      <el-dialog title="添加用户" :visible.sync="addDialogVisible" @closed="closeDialog" width="50%">
        <el-form :model="model" :rules="rules" ref="addUserFormRef" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="model.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="model.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="model.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="model.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 用户列表 -->
      <el-table :data="userList" border style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="updateStatus(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220px">
          <template slot-scope="scope">
            <!-- 修改用户信息 -->
            <el-button type="primary" @click="editUser(scope.row.id)" size="mini">
              <i class="el-icon-edit"></i>
            </el-button>
            <!-- 删除用户 -->
            <el-button type="danger" @click="deleteUser(scope.row.id)" size="mini">
              <i class="el-icon-delete"></i>
            </el-button>
            <!-- 设置用户角色 -->
            <el-button type="warning" @click="getUserRole(scope.row)" size="mini">
              <i class="el-icon-setting"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 编辑用户信息的对话框,由于时间关系，这里rules就不做校验了 -->
      <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%">
        <el-form :model="model" :rules="rules" ref="editUserFormRef" label-width="70px">
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmEditUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分配角色的对话框 -->
      <el-dialog
        title="分配角色"
        :visible.sync="setRoleDialogVisible"
        width="50%"
        @close="setRoleDialogClosed"
      >
        <div>
          <p>当前的用户：{{userInfo.username}}</p>
          <p>当前的角色：{{userInfo.role_name}}</p>
          <p>
            分配新角色：
            <el-select v-model="selectedRoleId" placeholder="请选择">
              <el-option
                v-for="item in rolesList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              ></el-option>
            </el-select>
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
        </span>
      </el-dialog>
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
export default {
  name: 'Users',
  data() {
    return {
      usersForm: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
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
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15个字符', trigger: 'blur' }
        ],
        email: [
          { required: false, message: '请输入邮箱', trigger: 'blur' },
          {
            pattern: /^\w+@\w+(\.\w+)+$/,
            message: '邮箱格式不对，请重新输入',
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: false, message: '请输入手机号码', trigger: 'blur' },
          {
            pattern: /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/,
            message: '手机号码格式不对，请重新输入',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.usersList()
  },
  methods: {
    async usersList() {
      const { data: res } = await this.$http.get('users', {
        params: this.usersForm
      })
      this.userList = res.data.users
      this.total = res.data.total
    },
    async updateStatus(row) {
      const { data: res } = await this.$http.put(
        `users/${row.id}/state/${row.mg_state}`
      )
      if (res.meta.status !== 200) {
        row.mg_state = !row.mg_state
        return this.$message.error('修改用户状态失败')
      }
      this.$message.success('修改用户状态成功')
    },
    // 添加新用户
    async addUser() {
      this.$refs.addUserFormRef.validate(valid => {
        if (!valid) return this.$message.error('验证失败')
      })
      const { data: res } = await this.$http.post('users', this.model)
      if (res.meta.status !== 201) {
        return this.$message.error('添加用户失败')
      }
      this.usersList()
      this.$message.error('添加用户成功')
      this.addDialogVisible = false
    },
    // 关闭添加用户对话框清空表单
    closeDialog() {
      this.$refs.addUserFormRef.resetFields()
    },
    // 用户列表页大小改变
    handleSizeChange(newSize) {
      this.usersForm.pagesize = newSize
      this.usersList()
    },
    // 用户列表页号改变
    handleCurrentChange(newPage) {
      this.usersForm.pagenum = newPage
      this.usersList()
    },
    async editUser(id) {
      const { data: res } = await this.$http.get('users/' + id)
      // 判断如果添加失败，就做提示
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户信息失败')
      }
      // 将获取到的数据保存到数据editForm中
      this.editForm = res.data
      // 显示弹出窗
      this.editDialogVisible = true
    },
    async confirmEditUser() {
      const { data: res } = await this.$http.put(
        `users/${this.editForm.id}`,
        this.editForm
      )
      if (res.meta.status !== 200) {
        return this.$message.error('修改用户数据失败')
      }
      this.usersList()
      this.$message.success('修改用户数据成功')
    },
    // 删除用户弹框
    async deleteUser(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('users/' + id)
          if (res.meta.status !== 200) {
            return this.$message.error('删除用户失败')
          }
          this.usersList()
          this.$message.success('删除用户成功')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 获取用户角色
    async getUserRole(userinfo) {
      this.userInfo = userinfo
      // 在展示对话框之前，获取所有角色的列表
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }
      this.rolesList = res.data
      this.setRoleDialogVisible = true
    },
    // 点击按钮，分配角色
    async saveRoleInfo() {
      if (!this.selectedRoleId) {
        return this.$message.error('请选择要分配的角色！')
      }

      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        {
          rid: this.selectedRoleId
        }
      )

      if (res.meta.status !== 200) {
        return this.$message.error('更新角色失败！')
      }

      this.$message.success('更新角色成功！')
      this.usersList()
      this.setRoleDialogVisible = false
    },
    // 监听分配角色对话框的关闭事件
    setRoleDialogClosed() {
      this.selectedRoleId = ''
      this.userInfo = {}
    }
  }
}
</script>
<style lang='less' scoped>
</style>
