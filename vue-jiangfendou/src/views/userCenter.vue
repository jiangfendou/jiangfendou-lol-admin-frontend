<template>
    <div>
        <h2>欢迎，{{userInfo.username}}</h2>
        
        <el-row>
            <el-col :span="10" :offset="7">
               <el-form :model="passForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="旧密码" prop="currentPass">
                        <el-input v-model="passForm.currentPass" type="password" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="password">
                        <el-input v-model="passForm.password" type="password" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="checkPass">
                        <el-input v-model="passForm.checkPass" type="password" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                        <el-button @click="resetForm('ruleForm')">重置</el-button>
                    </el-form-item> 
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import Element from "element-ui"
    export default {
        name: "userCenter",
        data() {
            var validataPass = (rule, value, callback) => {
                if(value === '') {
                    callback(new Error('请在此输入密码'));
                } else if (value !== this.passForm.password){
                    callback(new Error('两次输入密码不一致'));
                } else {
                    callback();
                }
            };
            return {
                userInfo: {
                    username: ''
                },
                passForm: {
                    currentPass: '',
                    password: '',
                    checkPass: '',
                    id: '',
                    lockVersion: ''
                },
                rules: {
                    currentPass: [
                        { required: true, message: '请输入旧密码', trigger: 'blur' },
                    ],
                    checkPass: [
                        { required: true, validator: validataPass , trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入新密码', trigger: 'blur' }
                    ]
                }
            };
        },
        created() {
            this.getUserInfo()
        },
        methods: {
            getUserInfo() {
                let userId = localStorage.getItem("userId");
                this.$axios.get("/sys/user/userInfo?userId=" + userId).then(res => {
                    this.userInfo = res.data.data; 
                    this.passForm.id = userId;
                    this.passForm.lockVersion = res.data.data.lockVersion;
                })
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$axios.put("/sys/user/update-password", this.passForm).then(res => {
                        this.$message({
                            showClose: true,
                            message: "恭喜你，修改密码成功！",
                            type: "success"
                        })
                        this.$router.push("/sys/users");
                    }).catch((error) => {
                        Element.Message.error(error.response.data.apiError.message)
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        }
    }
</script>

<style scoped>
    .el-input__inner {
        width: 80%;
    }
    h2 {
        text-align: center;
    }
   
</style>