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
          <el-form  ref="numberValidateForm">
            <el-form-item label="编码：" prop="age">
              <el-input type="age" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="手机：" prop="age">
              <el-input auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="姓名：" prop="age">
              <el-input auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" >入库</el-button>
              <el-button >清空</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="18">
            <div class="search-params-block">
              包裹编号：
              <el-input
                placeholder="请输入编号"
                prefix-icon="el-icon-search"
                v-model="input21">
              </el-input>
              <el-button type="primary" icon="el-icon-search">搜索</el-button>
            </div>
            <el-table
              :data="packData.data"
              style="width: 100%">
              <el-table-column
                label="编号"
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
                label="入库"
                prop="Intime">
              </el-table-column>
              <el-table-column
                label="出库"
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
              background
              layout="prev, pager, next"
              :total="packData.pagination.total">
            </el-pagination>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'Index',
  data () {
    return {
      packData: {
        data: [],
        pagination: {
          total: null,
          page: 1,
          size: 10
        }
      },
      input2: '',
      input21: '',
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
        })
        .catch(function (err) {
          console.log(err.message)
        })
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
  .el-container {
    padding-top: 10px;
  }
  .search-params-block {
    float: left;
  }
  .search-params-block .el-input {
    width: 250px;
  }
  .el-form {
    margin:10px 5px;
  }
  .el-form-item .el-input {
    width: 250px;
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
