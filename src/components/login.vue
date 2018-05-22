<template>
  <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
    <el-form-item label="账户" prop="id">
      <el-input v-model="ruleForm.id" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="pass">
      <el-input type="password" v-model="ruleForm.pass"  auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import md5 from 'md5'
export default {
  name: 'login',
  data () {
    return {
      ruleForm: {
        id: '',
        pass: ''
      },
      rules: {
        id: [
          {required: true, message: '请输入账户名或手机号', trigger: 'blur'}
        ],
        pass: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let uid = this.ruleForm.id
          let upass = md5(this.ruleForm.pass)
          console.log(uid + '-' + upass)
          let obj = {
            pwd: upass
          }
          let that = this
          this.$http.get('/api/user/' + uid, {params: obj})
            .then(function (res) {
              if (res.data.success) {
                that.$message({
                  message: '登录成功！',
                  type: 'success'
                })
                that.$cookie.set('uid', uid, 1)
                that.$router.push('/index')
              } else {
                that.$message({
                  message: '用户名或密码错误！',
                  type: 'error'
                })
              }
            })
            .catch(function (err) {
              console.log(err.message)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style scoped>
  .el-form {
    margin-top:20%;
    margin-left:35%;
  }

  .el-input {
    width:200px;
  }
</style>
