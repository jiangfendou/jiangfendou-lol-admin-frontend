<template>
    <div>
        <el-form :inline="true">
            <el-form-item>
                <el-input v-model="searchForm.name" placeholder="名称" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="getRoleList">搜索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="dialogVisible = true">新增</el-button>
            </el-form-item>
            <el-form-item>
                 <el-popconfirm
                    title="确定要批量删除吗？" @confirm="delHandle(null)"
                >
                    <el-button type="danger" slot="reference" :disabled="searchForm.delBtStatus">批量删除</el-button>
                </el-popconfirm>
            </el-form-item>
        </el-form>
        <el-table
            ref="multipleTable"
            :data="tableData"
            border
            stripe
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
            type="selection"
            width="55">
            </el-table-column>

            
            <el-table-column
            prop="name"
            label="名称"
            width="120">
            </el-table-column>
            <el-table-column
            prop="code"
            label="唯一编码"
            show-overflow-tooltip>
            </el-table-column>
            <el-table-column
            prop="remark"
            label="描述"
            show-overflow-tooltip>
            </el-table-column>
            <el-table-column
            prop="status"
            label="状态">
                <template slot-scope="scope">
                    <el-tag size="small" v-if="scope.row.status === 1" type="success">正常</el-tag>
                    <el-tag size="small" v-else-if="scope.row.status === 0" type="danger">禁用</el-tag>
                </template>
            </el-table-column>
            <el-table-column
            prop="updateDatetime"
            label="更新时间"
            show-overflow-tooltip>
            </el-table-column>
            <el-table-column
            prop=""
            label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="permHandle(scope.row.id)">分配权限</el-button>
                    <el-divider direction="vertical"></el-divider>
                    <el-button type="text" @click="editHandle(scope.row.id)">编辑</el-button>
                    <el-divider direction="vertical"></el-divider>
                    <template>
                        <el-popconfirm
                        title="这是一段内容确定删除吗？" @confirm="delHandle(scope.row.id)"
                        >
                            <el-button type="text" slot="reference" >删除</el-button>
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
            :total="total">
        </el-pagination>

        <!-- 新增对话框 -->
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="600px"
            :before-close="handleClose">
            <el-form :model="editFrom" :rules="editFromRules" ref="editFrom" label-width="100px" class="demo-editFrom">
                <el-form-item label="角色名称" prop="name" label-width="100px">
                    <el-input v-model="editFrom.name" autocomplete="off"></el-input>
                </el-form-item>
                 <el-form-item label="唯一编码" prop="code" label-width="100px">
                    <el-input v-model="editFrom.code" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="remark" label-width="100px">
                    <el-input v-model="editFrom.remark" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status" label-width="100px">
                    <el-radio-group v-model="editFrom.status">
                    <el-radio :label=0>禁用</el-radio>
                    <el-radio :label=1>正常</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('editFrom')">立即创建</el-button>
                    <el-button @click="resetForm('editFrom')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

         <!-- 分配权限对话框 -->
        <el-dialog
            title="分配权限"
            :visible.sync="permDialogVisible"
            width="600px">
            <el-form :model = "permForm">
                <el-tree
                    :data = "permTreeData"
                    show-checkbox
                    ref="permTree"
                    :default-expand-all=true
                    node-key="id"
                    :check-strictly=true
                    :props="defaultProps"
                   
                >
                </el-tree>
            </el-form>
             <span slot="footer" class="dialog-footer">
                    <el-button @click="permDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submitPermFormHandle('permForm')">确 定</el-button>
                </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "role",
        data() {
            return {
                total: 0,
                size: 10,
                current: 1,
                dialogVisible: false,
                editFrom: {
                    name: '',
                    code: '',
                    remark: '',
                    status: 1
                },
                searchForm: {
                    delBtStatus: true,
                    
                },
                editFromRules: {
                    name: [
                        {required: true, message: '请输入角色名称', trigger: 'blur'}
                    ],
                    code: [
                        {required: true, message: '请输入唯一编码', trigger: 'blur'}
                    ],
                    status: [
                        {required: true, message: '请选择状态', trigger: 'blur'}
                    ]
                },
                tableData: [],
                multipleSelection: [],

                permDialogVisible: false,
                permForm: {

                },
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                permTreeData: []
            }
        },
        created() {
            this.getRoleList()
            this.$axios.get("/sys/menu/list").then(res => {
                console.log("menus");
                console.log(res.data.data);
                this.permTreeData =res.data.data
            })
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/sys/role/' + (this.editFrom.id ? 'update' : 'save'), this.editFrom).
                        then (res => {
                            this.$message({
                                showClose: true,
                                message: '恭喜你，操作成功！',
                                type: 'success',
                                onclose:() => {
                                    this.getRoleList()
                                }
                            });
                            this.resetForm('editFrom')
                        }); 
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            editHandle(id) {
                this.$axios.get('/sys/role/info/' + id).then(res => {
                    this.editFrom = res.data.data
                    this.dialogVisible = true
                })
            },
            toggleSelection(rows) {
                if (rows) {
                    rows.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row);
                    });
                } else {
                    this.$refs.multipleTable.clearSelection();
                }
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
                this.searchForm.delBtStatus = val === 0
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.size = val
                this.getRoleList()
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.current = val
                this.getRoleList()
            },
            // 清空表单
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.editFrom = {}
                this.dialogVisible = false
            },
            handleClose() {
                this.resetForm('editFrom')
            },
            // 删除
            delHandle(id) {

                var ids = []
                if (id) {
                    ids.push(id) 
                } else {
                    this.multipleSelection.forEach(row => {
                        ids.push(row.id)
                    })
                }
                this.$axios.post("/sys/role/delete/" + ids).then(res => {
                    this.$message({
                        showClose: true,
                        message: '恭喜你，操作成功！',
                        type: 'success',
                        onclose:() => {
                            this.getMenuTree()
                        }
                    });
                })
            },
            getRoleList() {
                 this.$axios.get("/sys/role/list", {
                     params: {
                         name: this.searchForm.name,
                         current: this.current,
                         size: this.size
                     }
                 }).then(res => {
                    this.tableData = res.data.data.records
                    this.size = res.data.data.size
                    this.current = res.data.data.current
                    this.total = res.data.data.total
                })   
            },

            permHandle(id) {
                this.permDialogVisible = true
                this.$axios.get("/sys/role/info/" + id).then(res => {
                    console.log(res.data.data.menuIds);
                    this.$refs.permTree.setCheckedKeys(res.data.data.menuIds);
                    this.permForm = res.data.data
                })
            },
            submitPermFormHandle(formName) {
                var menuIds = this.$refs.permTree.getCheckedKeys()
                console.log(menuIds);
                this.$axios.post('/sys/role/perm', this.permForm.id, menuIds).then(res => {
                     this.$message({
                        showClose: true,
                        message: '恭喜你，操作成功！',
                        type: 'success',
                        onclose:() => {
                            this.getMenuTree()
                        }
                    });
                    this.permDialogVisible = false
                })
                
            }
        }
    }
</script>

<style scoped>
    .el-pagination {
        float: right;
        margin-top: 20px;
    }
   
</style>