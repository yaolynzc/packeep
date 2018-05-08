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
          <el-form
            :model="ruleForm"
            status-icon :rules="rules"
            ref="ruleForm"
            label-width="100px">
            <el-tag>包裹入库</el-tag>
            <el-form-item label="编号：" prop="code">
              <el-input
                v-model="ruleForm.code"
                :autofocus="true"
                @keyup.enter.native="getFocus('inputUphone')"
                auto-complete="true">
              </el-input>
            </el-form-item>
            <el-form-item label="手机：" prop="tel">
              <el-autocomplete
                v-model="ruleForm.tel"
                ref="inputUphone"
                @keyup.enter.native="getFocus('inputUname')"
                @input="searchUphone"
                :fetch-suggestions="querySearch"
                @select="handleSelect">
              </el-autocomplete>
            </el-form-item>
            <el-form-item label="姓名：" prop="name">
              <el-input
                v-model="ruleForm.name"
                ref="inputUname"
                @keyup.enter.native="submitForm('ruleForm')"
                auto-complete="true">
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-check" @click="submitForm('ruleForm')">入库</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="18">
          <el-row>
            <el-col :span="24">
              <div class="search-params-block">
                手机尾号：
                <el-input
                  placeholder="请输入手机尾号"
                  prefix-icon="el-icon-search"
                  v-model="packData.userphone"
                  clearable
                  @keyup.enter.native="search"
                  @clear="search">
                </el-input>
                <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
              </div>
            </el-col>
            <el-col :span="24" style="margin-top: 15px">
              <el-tabs v-model="activeName" @tab-click="tabhandleClick">
              <el-tab-pane label="未签收" name="0">
                <el-table
                  v-loading="loading"
                  element-loading-text="加载中"
                  element-loading-spinner="el-icon-loading"
                  element-loading-background="rgba(0, 0, 0, 0.8)"
                  :data="packData.data"
                  style="width: 100%">
                  <el-table-column
                    label="编号"
                    prop="Poscode"
                    width="180">
                  </el-table-column>
                  <el-table-column
                    label="手机"
                    prop="Userphone"
                    width="180"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    label="姓名"
                    prop="Username"
                    width="220"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    label="入库时间"
                    prop="Intime"
                    width="280"
                    align="center"
                    :formatter="intimeFormatter">
                  </el-table-column>
                  <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                      <el-button
                        icon="el-icon-edit"
                        size="mini"
                        type="primary"
                        @click="handleOutClick(scope.$index, scope.row)">签收</el-button>
                      <el-button
                        icon="el-icon-phone"
                        size="mini"
                        type="success"
                        @click="handleDialClick(scope.$index, scope.row)">电话</el-button>
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
                  v-loading="loading"
                  element-loading-text="加载中"
                  element-loading-spinner="el-icon-loading"
                  element-loading-background="rgba(0, 0, 0, 0.8)"
                  :data="packData.data"
                  style="width: 100%">
                  <el-table-column
                    label="编号"
                    prop="Poscode"
                    width="180">
                  </el-table-column>
                  <el-table-column
                    label="手机"
                    prop="Userphone"
                    width="180"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    label="姓名"
                    prop="Username"
                    width="180"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    label="出库时间"
                    prop="Outtime"
                    align="center"
                    :formatter="outtimeFormatter">
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
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
// 引入百度语音RESTful跨域请求api
import BaiduAip from '@/utils/baidu_tts_cors.js'
import moment from 'moment'
export default {
  name: 'Index',
  data () {
    return {
      userTelFill: [
        // { 'value': '153', 'name': 'chen' },
        // { 'value': '186', 'name': 'flame' }
      ],
      activeName: '0',
      loading: null,
      ruleForm: {
        code: '',
        tel: '',
        name: ''
      },
      rules: {
        code: [
          {required: true, message: '请输入包裹位置编号', trigger: 'blur'},
          {pattern: /^[0-9]*$/, message: '请输入数字编号！', trigger: 'blur'}
        ],
        tel: [
          {required: true, message: '请输入手机号码', trigger: 'blur'},
          {min: 11, max: 11, message: '请输入11位手机号码', trigger: 'blur'},
          {pattern: /^[1-9]{1}\d{10}$/, message: '手机号格式不对！', trigger: 'blur'}
        ],
        name: []
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
    this.getCount('', this.activeName)
  },
  methods: {
    getCount (uphone, state) {
      let obj = {
        uphone: uphone,
        state: state,
        rad: Math.random()
      }

      this.loading = true
      let that = this
      this.$http.get('/api/pack', {params: obj})
        .then(function (res) {
          if (res.data.count > 0) {
            that.packData.pagination.total = res.data.count
            that.getList(uphone, state)
          } else {
            that.packData.data = []
            that.loading = false
          }
        })
        .catch(function (err) {
          console.log(err.message)
        })
    },
    getList (uphone, state) {
      let obj = {
        uphone: uphone,
        state: state,
        page: this.packData.pagination.page,
        size: this.packData.pagination.size,
        rad: Math.random()
      }

      let that = this
      this.$http.get('/api/pack', {params: obj})
        .then(function (res) {
          that.loading = false
          that.packData.data = res.data.dt

          if (uphone) {
            let redt = res.data.dt
            let text = '包裹编号'
            let audio = null

            // 拼接检索到的编码
            for (let n of redt) {
              text += n.Poscode
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
              hidden: true,
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
      this.getList(this.packData.userphone, this.activeName)
    },
    // 搜索
    search () {
      this.packData.pagination.page = 1
      this.packData.data = []
      this.getCount(this.packData.userphone, this.activeName)
    },
    // 入库
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let obj = {
            pcode: this.ruleForm.code,
            uphone: this.ruleForm.tel,
            uname: this.ruleForm.name
          }

          let that = this
          this.$http.post('/api/pack', this.$qs.stringify(obj))
            .then(function (res) {
              if (res.data.success) {
                that.$message({
                  message: '入库成功！',
                  type: 'success'
                })
                that.resetForm()
                that.getCount('', that.activeName)
              }
            })
            .catch(function (err) {
              console.log(err.message)
            })
        }
      })
    },
    resetForm () {
      this.$refs['ruleForm'].resetFields()
      this.getFocus('inputUphone')
    },
    // tab切换点击事件
    tabhandleClick (tab, event) {
      this.packData.data = []
      this.getCount(this.packData.userphone, this.activeName)
    },
    handleOutClick (index, row) {
      console.log(index, row)
      let obj = {
        state: 1
      }

      let that = this
      this.$http.put('/api/pack/' + row.Id, this.$qs.stringify(obj))
        .then(function (res) {
          if (res.data.success) {
            that.$message({
              message: '签收成功！',
              type: 'success'
            })
            that.getCount(that.packData.userphone, that.activeName)
          }
        })
        .catch(function (err) {
          console.log(err.message)
        })
    },
    handleDialClick (index, row) {
      this.$message({
        message: '开发中，敬请期待！'
      })
    },
    intimeFormatter (row, column) {
      return moment(row.Intime).format('YYYY-MM-DD HH:mm:ss')
    },
    outtimeFormatter (row, column) {
      return moment(row.Outtime).format('YYYY-MM-DD HH:mm:ss')
    },
    getFocus (inputname) {
      this.$refs[inputname].focus()
    },
    searchUphone () {
      // console.log('change')
      let obj = {
        uphone: this.ruleForm.tel,
        size: this.packData.pagination.size,
        rad: Math.random()
      }

      let that = this
      this.$http.get('/api/phone', {params: obj})
        .then(function (res) {
          if (res.data.dt.length > 0) {
            let redt = res.data.dt

            // 挑选userphone和username
            for (let n of redt) {
              n.value = n.Userphone
            }
            that.userTelFill = redt
          }
        })
        .catch(function (err) {
          console.log(err.message)
        })
    },
    querySearch (queryString, cb) {
      if (!this.ruleForm.tel) {
        this.userTelFill = []
      }
      var results = this.userTelFill
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    handleSelect (item) {
      // console.log(item.Username)
      this.getFocus('inputUname')
      this.ruleForm.name = item.Username
    }
  }
}
</script>

<style scoped>
  .el-tag {
    margin:0px 0px 15px 0px;
    font-size: 15px;
  }
  .el-form {
    padding-right: 25px;
  }
  .el-form-item {
    margin-left: -30px;
  }
  .search-params-block {
    float: left;
  }
  .search-params-block .el-input {
    width: 200px;
  }
  .el-pagination {
    margin-top: 20px;
    float: right;
  }
</style>
