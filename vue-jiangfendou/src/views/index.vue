<template>
  <div>
    <el-row class="home" :getter="20">
      <!-- 左侧 -->
      <el-col :span="8" style="margin-top: 20px" v-loading="loading">
        <el-card shadow="hover">
          <div class="user">
            <img :src="avatar" @click="uploadAvatar"/>
            <div class="userinfo">
              <p class="name">{{ username }}</p>
              <span class="access" v-for="(item ,index) in roleNames">{{ item }}
                  <span v-if="index != roleNames.length-1">、</span>
                  </span>
            </div>
          </div>
          <div class="login-info">
            <p>
              上次登录时间：<span>{{ lastLogin }}</span>
            </p>
            <p>
              上次登录地点：<span>{{ city }}</span>
            </p>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog
      title="修改头像"
      :visible.sync="dialogVisible"
      width="20%"
      :before-close="handleClose">
      <el-form :model="editFrom" ref="editFrom" label-width="160px" class="demo-editFrom">
        <el-upload
          class="avatar-uploader"
          action="#"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="handleChange"
          :before-upload="beforeAvatarUpload">
          <el-image v-if="editFrom.imageUrl" :src="editFrom.imageUrl" class="avatar"></el-image>
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>

        <el-form-item>
            <el-button type="primary" @click="submitForm('editFrom')">提交</el-button>
            <el-button @click="resetForm('editFrom')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      loading: true,
      editFrom: {
        imageUrl: '',
        multipartFile: ''
      },
      avatar: '',
      username: '',
      roleNames: [],
      lastLogin: '',
      city: '', 
      userId: '',
      lockVersion: '' 
    };
  },

  methods: {
    submitForm(formName) {
      console.log(this.lockVersion);
      var image = new FormData()
      image.append('multipartFile', this.editFrom.multipartFile)
      image.append('id', this.userId)
      image.append('lockVersion', this.lockVersion)
      this.$refs[formName].validate((valid) => {
          if (valid) {
              this.$axios.put('/sys/user/update-upload/', image, {
                headers: {
                  "Content-Type": "multipart/form-data"
                }
              }).then (res => {
                this.$message({
                    showClose: true,
                    message: '恭喜你，操作成功！',
                    type: 'success'
                });
                this.dialogVisible = false;
                this.getUserIndex()
              }).catch((error) => {
                  Element.Message.error(error.response.data.apiError.message)
              }); 
          } else {
              console.log('error submit!!');
              return false;
          }
      });
    },
    getUserIndex() {
      var userId = localStorage.getItem("userId");
      this.$axios.get("/sys/user/user-index/" + userId).then((res) => {
        this.roleNames = res.data.data.roleNames;
        this.username = res.data.data.username;
        this.lastLogin = res.data.data.lastLogin;
        this.city = res.data.data.city;
        this.avatar = res.data.data.avatar;
        this.userId = userId;
        this.lockVersion = res.data.data.lockVersion;
        this.loading = false;
      });
    },
    uploadAvatar() {
      this.dialogVisible = true;
    },
    handleClose(done) {
        this.editFrom.imageUrl = "";
        this.dialogVisible = false;
    },
    handleChange(file, fileList) {
      this.editFrom.imageUrl = URL.createObjectURL(file.raw);
      this.editFrom.multipartFile = file.raw;
    },
    beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
    },
    // 清空表单
    resetForm() {
        this.editFrom.imageUrl = "";
        this.dialogVisible = false
    }
  },
  mounted() {
    this.getUserIndex();
  },
};
</script>
<style lang="scss">
  @import "../assets/scss/home.scss";

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon, .el-icon-plus:before {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>