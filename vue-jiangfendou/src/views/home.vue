<template>
    <el-container>
        <el-aside width="200px">
           <sideMenu></sideMenu>
        </el-aside>
        <el-container>
            <el-header>
                <strong>英雄联盟管理系统</strong>
                <div class="header-avatar">
                    <el-avatar size="medium" :src="userInfo.avatar"></el-avatar>
                    <el-dropdown>
                        <span class="el-dropdown-link">
                            {{userInfo.username}}<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>
                                <router-link to="/userCenter" style="color: #606266; text-decoration: none;"
                                 @click.native="selectMenu({name: 'userCenter', title: '个人中心'})">个人中心</router-link>
                            </el-dropdown-item>
                            <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
                        </el-dropdown-menu> 
                    </el-dropdown>
                    <el-link href="https://lpl.qq.com/es/worlds/2021/" target="_blank">官方网站</el-link>
                    <el-link href="https://lpl.qq.com/es/worlds/2021/" target="_blank">游戏记录</el-link>
                </div>
            </el-header>
            <el-main>
                <tabs></tabs>
                <div style="margin: 0 15px">
                    <router-view></router-view>
                </div>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    import sideMenu from "./inc/sideMenu.vue"
    import tabs from "./inc/tabs.vue"
    export default {
        name: "home",
        components: {
            sideMenu,
            tabs
        },
        data() {
            return {
                userInfo: {
                    id: "",
                    username: "",
                    avatar: ""
                }
            }
        },
        created() {
            this.getUserinfo()
        },
        methods: {
            getUserinfo() {
                let userId = localStorage.getItem("userId");
                this.$axios.get("/sys/user/userInfo?userId=" + userId).then(res => {
                    this.userInfo = res.data.data
                })
            },
            logout() {
                this.$axios.post("/logout").then(res => {
                    localStorage.clear()
                    sessionStorage.clear()
                    this.$store.commit ("resetState")
                    this.$router.push("/login")
                })
            },
            selectMenu(item) {
                this.$store.commit("addTab", item);
            }
        }
    }
</script>

<style scoped>
    .el-container {
        padding: 0;
        margin: 0;
        height: 100%;
    }

    .header-avatar {
        float: right;
        width: 280px;
        display: flex;
        justify-content: space-around;
        align-items: center;
    }

    
    .el-header {
        background-color: #B3C0D1;
        color: #333;
        line-height: 60px;
    }
    
    .el-aside {
        background-color: #D3DCE6;
        color: #333;
        line-height: 200px;
    }
    
    .el-main {
        background-color: #E9EEF3;
        color: #333;
        text-align: left;
        /* line-height: 160px; */
        padding: 0;
    }
    
    a {
        text-decoration: none;
    }
   
</style>
