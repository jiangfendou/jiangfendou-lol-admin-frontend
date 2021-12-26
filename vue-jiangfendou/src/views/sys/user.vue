<template>
  <div>
    <el-form :inline="true" :model="searchForm" ref="searchForm">
      <el-form-item prop="username">
        <el-input
          v-model="searchForm.username"
          placeholder="用户名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getUserList">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="dialogVisible = true">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-popconfirm title="确定要批量删除吗？" @confirm="delSomeHandle()">
          <el-button
            type="danger"
            slot="reference"
            :disabled="searchForm.delBtStatus"
            >批量删除</el-button
          >
        </el-popconfirm>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      ref="multipleTable"
      :data="tableData"
      border
      stripe
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>

      <el-table-column prop="avatar" label="头像" width="60">
        <template slot-scope="scope">
          <el-avatar size="small" :src="scope.row.avatar"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名称" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="name" label="角色名称" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag size="medium" type="info" v-for="item in scope.row.roles">{{
            item.name
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="email" label="邮箱" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="city" label="城市" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="phone" label="手机号" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.status === 1" type="success"
            >正常</el-tag
          >
          <el-tag size="small" v-else-if="scope.row.status === 0" type="danger"
            >禁用</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column prop="lastLogin" label="登录时间" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="" label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="roleHandle(scope.row.roles, scope.row.id)"
            >分配角色</el-button
          >
          <el-divider direction="vertical"></el-divider>
          <el-button
            type="text"
            @click="
              repassHandle(
                scope.row.id,
                scope.row.username,
                scope.row.lockVersion
              )
            "
            >重置密码</el-button
          >
          <el-divider direction="vertical"></el-divider>
          <el-button type="text" @click="editHandle(scope.row.id)"
            >编辑</el-button
          >
          <el-divider direction="vertical"></el-divider>
          <template>
            <el-popconfirm
              title="这是一段内容确定删除吗？"
              @confirm="delHandle(scope.row.id, scope.row.lockVersion)"
            >
              <el-button type="text" slot="reference">删除</el-button>
            </el-popconfirm>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[10, 20, 50, 100]"
      :current-page="current"
      :page-size="size"
      :total="total"
    >
    </el-pagination>

    <!-- 新增对话框 -->
    <el-dialog
      title="新增用户"
      :visible.sync="dialogVisible"
      width="600px"
      :before-close="handleClose"
    >
      <el-form
        :model="editFrom"
        :rules="editFromRules"
        ref="editFrom"
        label-width="100px"
        class="demo-editFrom"
      >
        <el-form-item label="用户名" prop="username" label-width="100px">
          <el-input v-model="editFrom.username" autocomplete="off"></el-input>
          <el-alert
            title="默认初始密码为888888"
            :closable="false"
            type="info"
            style="height: 25px; width: 200px"
          ></el-alert>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" label-width="100px">
          <el-input v-model="editFrom.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone" label-width="100px">
          <el-input v-model="editFrom.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="城市" prop="city" label-width="100px">
          <el-input v-model="editFrom.city" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status" label-width="100px">
          <el-radio-group v-model="editFrom.status">
            <el-radio :label="0">禁用</el-radio>
            <el-radio :label="1">正常</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('editFrom')"
            >立即创建</el-button
          >
          <el-button @click="resetForm('editFrom')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="roleDialogVisible" width="600px">
      <el-form :model="roleForm">
        <el-tree
          :data="roleTreeData"
          show-checkbox
          ref="roleTree"
          :default-expand-all="true"
          node-key="id"
          :check-strictly="true"
          :props="defaultProps"
        >
        </el-tree>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="roleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitRoleFormHandle('roleForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Element, { FormItem } from "element-ui";
export default {
  name: "user",
  data() {
    return {
      total: 0,
      size: 10,
      current: 1,
      dialogVisible: false,
      loading: true,
      editFrom: {
        username: "",
        email: "",
        phone: "",
        city: "",
        status: "",
      },
      searchForm: {
        delBtStatus: true,
        username: "",
      },
      editFromRules: {
        username: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
        phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        status: [{ required: true, message: "请选择状态", trigger: "blur" }],
      },
      tableData: [],
      multipleSelection: [],

      roleDialogVisible: false,
      roleForm: {
          userId: ''
      },
      defaultProps: {
        children: "children",
        label: "name",
      },
      roleTreeData: [],
    };
  },
  created() {
    this.getUserList();
    this.$axios.get("/sys/role/list").then((res) => {
      this.roleTreeData = res.data.data.records;
      
    });
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios
            .post(
              "/sys/user/" + (this.editFrom.id ? "update" : "save"),
              this.editFrom
            )
            .then((res) => {
              this.$message({
                showClose: true,
                message: "恭喜你，操作成功！",
                type: "success",
              });
              this.getUserList();
              this.resetForm("editFrom");
            })
            .catch((error) => {
              Element.Message.error(error.response.data.apiError.message);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    editHandle(id) {
      this.$axios
        .get("/sys/user/detail?userId=" + id)
        .then((res) => {
          this.editFrom = res.data.data;
          this.dialogVisible = true;
        })
        .catch((error) => {
            Element.Message.error(error.response.data.apiError.message);
        });
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      console.log("批量删除");
      console.log(val);
      this.multipleSelection = val;
      this.searchForm.delBtStatus = val.length == 0 ? true : false;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.size = val;
      this.getRoleList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.current = val;
      this.getRoleList();
    },
    // 清空表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.editFrom = {};
      this.dialogVisible = false;
    },
    handleClose() {
      this.resetForm("editFrom");
    },
    // 删除
    delHandle(id, lockVersion) {
      this.$axios
        .delete("/sys/user/delete", {
          data: {
            id: id,
            lockVersion: lockVersion,
          },
        })
        .then((res) => {
            this.$message({
                showClose: true,
                message: "恭喜你，操作成功！",
                type: "success"
            });
            this.roleDialogVisible = false;
            this.getUserList();
        }).catch((error) => {
            Element.Message.error(error.response.data.apiError.message);
        });
    },
    delSomeHandle() {
      var deleteUsers = [];
      this.multipleSelection.forEach((row) => {
        var user = {
          userId: row.id,
          lockVersion: row.lockVersion
        }
        deleteUsers.push(user);
      });
      console.log(deleteUsers);
      this.$axios.delete("/sys/user/delete-batch", {
          data: {
            deleteUserBatch: deleteUsers 
          }
        }).then((res) => {
          this.$message({
            showClose: true,
            message: "恭喜你，操作成功！",
            type: "success"
          });
      }).catch((error) => {
          Element.Message.error(error.response.data.apiError.message);
      });
    },
    getUserList() {
      console.log("this.searchForm.username");
      console.log(this.searchForm);
      this.$axios
        .get("/sys/user/list", {
          params: {
            username: this.searchForm.username,
            current: this.current,
            size: this.size,
          },
        })
        .then((res) => {
          console.log("res");
          console.log(res);
          this.tableData = res.data.data.records;
          this.size = res.data.data.size;
          this.current = res.data.data.current;
          this.total = res.data.data.total;
          this.loading = false;
        });
    },

    roleHandle(roles, id) {
        this.roleDialogVisible = true;
        console.log(roles.map((item) => item.id));
        this.$nextTick(() => {
            this.$refs.roleTree.setCheckedKeys(roles.map((item) => item.id))
        });
        this.roleForm.userId = id;
    },
    submitRoleFormHandle(formName) {
        var userId = this.roleForm.userId;
        var roleIds = this.$refs.roleTree.getCheckedKeys();
        console.log("userId");
        console.log(userId);
        console.log(roleIds);
        this.$axios
            .post("/sys/user/update-user-role", {
                    userId: userId, 
                    roleIds: roleIds
                }   
            )
            .then((res) => {
                this.$message({
                    showClose: true,
                    message: "恭喜你，操作成功！",
                    type: "success"
                })
                this.roleDialogVisible = false;
                this.getUserList();
            }).catch((error) => {
                Element.Message.error(error.response.data.apiError.message);
            });
    },
    repassHandle(id, username, lockVersion) {
      this.$confirm(
        "将重置用户【" + username + "】的密码，是否继续？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        this.$axios
          .put("/sys/user/repass", {
            id: id,
            lockVersion: lockVersion,
          })
          .then((res) => {
            this.$message({
              showClose: true,
              message: "恭喜你，操作成功",
              type: "success",
            });
            this.getUserList();
          })
          .catch((error) => {
            Element.Message.error(error.response.data.apiError.message);
          });
      });
    },
  },
};
</script>

<style scoped>
.el-pagination {
  float: right;
  margin-top: 20px;
}
</style>