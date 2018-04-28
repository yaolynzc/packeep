<template>
  <el-container>
    <el-header>
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        background-color="#409EFF"
        text-color="#000"
        active-text-color="#fff">
        <el-menu-item index="1">处理中心</el-menu-item>
      </el-menu>
    </el-header>
    <el-main>
      <el-row>
        <el-col :span="6">
          <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px">
            <el-form-item label="包裹入库：">
            </el-form-item>
            <el-form-item label="手机：" prop="tel">
              <el-input
                v-model="ruleForm.tel"
                auto-complete="off">
              </el-input>
            </el-form-item>
            <el-form-item label="姓名：" prop="name">
              <el-input
                v-model="ruleForm.name"
                auto-complete="off">
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-check" @click="submitForm('ruleForm')">入库</el-button>
              <el-button icon="el-icon-delete" @click="clearForm">清空</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="18">
          <div class="search-params-block">
            手机尾号：
            <el-input
              placeholder="请输入手机尾号"
              prefix-icon="el-icon-search"
              v-model="packData.userphone"
              clearable>
            </el-input>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
          </div>
          <div></div>
          <div>
            <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="未签收" name="0">
              <el-table
                :data="packData.data"
                style="width: 100%">
                <el-table-column
                  label="编码"
                  prop="Id">
                </el-table-column>
                <el-table-column
                  label="手机"
                  prop="Userphone">
                </el-table-column>
                <el-table-column
                  label="姓名"
                  prop="Username">
                </el-table-column>
                <el-table-column
                  label="入库时间"
                  prop="Intime">
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button
                      icon="el-icon-edit"
                      size="mini"
                      type="primary"
                      @click="handleEdit(scope.$index, scope.row)">签收</el-button>
                    <el-button
                      icon="el-icon-phone"
                      size="mini"
                      type="success"
                      @click="handleDelete(scope.$index, scope.row)">电话</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                @current-change="handleCurrentChange"
                background
                layout="prev, pager, next"
                :page-size="packData.pagination.size"
                :total="packData.pagination.total">
              </el-pagination>
            </el-tab-pane>
            <el-tab-pane label="已签收" name="1">
              <el-table
                :data="packData.data"
                style="width: 100%">
                <el-table-column
                  label="编码"
                  prop="Id">
                </el-table-column>
                <el-table-column
                  label="手机"
                  prop="Userphone">
                </el-table-column>
                <el-table-column
                  label="姓名"
                  prop="Username">
                </el-table-column>
                <el-table-column
                  label="出库时间"
                  prop="Outtime">
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button
                      icon="el-icon-edit"
                      size="mini"
                      type="primary"
                      @click="handleEdit(scope.$index, scope.row)">签收</el-button>
                    <el-button
                      icon="el-icon-phone"
                      size="mini"
                      type="success"
                      @click="handleDelete(scope.$index, scope.row)">电话</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                @current-change="handleCurrentChange"
                background
                layout="prev, pager, next"
                :page-size="packData.pagination.size"
                :total="packData.pagination.total">
              </el-pagination>
            </el-tab-pane>
            </el-tabs>
          </div>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
// 引入百度语音RESTful跨域请求api
import BaiduAip from '@/utils/baidu_tts_cors.js'
export default {
  name: 'Index',
  data () {
    return {
      activeName: '0',
      ruleForm: {
        tel: '',
        name: ''
      },
      rules: {
        tel: [
          {required: true, message: '请输入手机号码', trigger: 'blur'},
          {min: 11, max: 11, message: '请输入11位手机号码', trigger: 'blur'},
          {pattern: /^[1-9]{1}\d{10}$/, message: '手机号格式不对！', trigger: 'blur'}
        ],
        name: [
          { required: true, message: '请输入收件人', trigger: 'blur' }
        ]
      },
      packData: {
        userphone: '',
        data: [],
        pagination: {
          total: null,
          page: 1,
          size: 10
        }
      },
      input2: '',
      activeIndex: '1'
    }
  },
  created () {
    this.getCount()
  },
  methods: {
    getCount (uphone) {
      let obj = {
        uphone: uphone,
        rad: Math.random()
      }
      let that = this
      this.$http.get('/api/pack', {params: obj})
        .then(function (res) {
          if (res.data.count > 0) {
            that.packData.pagination.total = res.data.count
            that.getList(uphone)
          }
        })
        .catch(function (err) {
          console.log(err.message)
        })
    },
    getList (uphone) {
      let obj = {
        uphone: uphone,
        page: this.packData.pagination.page,
        size: this.packData.pagination.size,
        rad: Math.random()
      }
      let that = this
      this.$http.get('/api/pack', {params: obj})
        .then(function (res) {
          that.packData.data = res.data.dt
          if(uphone){
            let redt = res.data.dt
            let text = '包裹编号'
            let audio = null
            console.log(redt)
            for (let n in redt) {
              console.log(redt[n].Id)
              text += redt[n].Id
            }
            audio = BaiduAip.btts({
              tex: text,
              tok: '24.591d35c06b22dda2d19094f77e6b7a23.2592000.1527471488.282335-11167025',
              spd: 5,
              pit: 5,
              vol: 9,
              per: 0
            }, {
              volume: 0.3,
              autoDestory: true,
              timeout: 10000,
              hidden: false,
              onInit: function (htmlAudioElement) {
              },
              onSuccess: function (htmlAudioElement) {
                // 合成后，自动播放语音
                audio = htmlAudioElement
                audio.play()
              },
              onError: function (errorText) {
              },
              onTimeout: function () {
              }
            })
          }
        })
        .catch(function (err) {
          console.log(err.message)
        })
    },
    // 点击页码
    handleCurrentChange (val) {
      this.packData.pagination.page = val
      this.getList()
    },
    // 搜索
    search () {
      this.packData.pagination.page = 1
      this.getCount(this.packData.userphone)
    },
    // 入库
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let obj = {
            uphone: this.ruleForm.tel,
            uname: this.ruleForm.name
          }
          console.log(this.uphone + ':' + this.uname)
          let that = this
          this.$http.post('/api/pack', this.$qs.stringify(obj))
            .then(function (res) {
              if (res.data.success) {
                that.$message({
                  message: '入库成功！',
                  type: 'success'
                })
                that.getCount()
              }
            })
            .catch(function (err) {
              console.log(err.message)
            })
        }
      })
    },
    clearForm () {
      this.uphone = ''
      this.uname = ''
    },
    handleClick (tab, event) {
      console.log(tab, event)
    },
    handleEdit (index, row) {
      console.log(index, row)
    },
    handleDelete (index, row) {
      console.log(index, row)
    }
  }
}
</script>

<style scoped>
  .el-col {
    padding-right: 10px;
  }
  .search-params-block {
    float: left;
  }
  .search-params-block .el-input {
    width: 200px;
  }
  .el-from {
    margin-right: 10px;
  }
  .el-form-item .el-input {
    /*width: 200px;*/
    float: left;
  }
  .el-table {
    margin-top: 50px;
  }
  .el-pagination {
    margin-top: 20px;
    float: right;
  }
</style>
