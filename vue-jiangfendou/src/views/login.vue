<template>
    <el-row type="flex" class="row-bg" justify="center">
        <el-col :xl="6" :lg="7">
            <h2>欢迎来到英雄联盟管理系统</h2>
            <el-image :src="require('@/assets/lol_all.png')" style="height: 180px; width: 180px" ></el-image>
            <p>公众号 LOL</p>
        </el-col>
        <el-col :span="1">
            <el-divider direction="vertical"></el-divider>
        </el-col>
        <el-col :xl="6" :lg="7">
            <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="loginForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="loginForm.password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="验证码" prop="code"> 
                    <el-input v-model="loginForm.code" style="width: 152px; float: left"></el-input>
                    <el-image :src="captchaImg" class="captchaImg" @click="getCaptchaImg"></el-image>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
                    <el-button @click="resetForm('loginForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<script>
    import qs from 'qs'
    import Element from "element-ui"
    export default {
        name: "login",
        data() {
            return {
                loginForm: {
                    username: 'jiangfendou',
                    password: '111111',
                    code: '',
                    token: '',
                    
                },
                captchaImg: '',
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ],
                    code: [
                        { required: true, message: '请输入验证码', trigger: 'blur' },
                        { min: 5, max: 5, message: '长度 5 个字符', trigger: 'blur' }
                    ]
                }
            };
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/login?' + qs.stringify(this.loginForm)).then (res =>{
                            console.log("login success");
                            console.log(res);
                            const jwt = res.headers['authorization'];
                            this.$store.commit('SET_TOKEN', jwt);
                            this.$store.commit('USER_ID', res.data.data.userId);
                            this.$router.push("/index");
                        }).catch((error) => {
                            this.getCaptchaImg()
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
            },
            getCaptchaImg() {
                this.$axios.get('/captcha')
                .then (res =>{
                    this.loginForm.token = res.data.data.token
                    this.captchaImg = res.data.data.captchaImg
                    this.loginForm.code = ''
                })
                .catch((error) =>
                    Element.Message.error(error.response.data.apiError.message)
                );
            }
        },
        created() {
            this.getCaptchaImg()
        }
    }
</script>

<style scoped>
    .el-row {
        background-color: #fafafa;
        /* background-image: url('../assets/blue.png'); */
        background-repeat: no-repeat;
        background-size: 100% 100%;
        height: 100%;
        display: flex;
        align-items: center;
        text-align: center;
    }
    .el-divider {
        height: 200px;
    }
    .el-form-item {
        width: 380px;
    }
    .captchaImg {
        float: left;
        margin-left: 8px;
        border-radius: 5px;
    }
</style>
