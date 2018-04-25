<template>
  <el-container>
    <el-header>
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
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
              :data="tableData"
              style="width: 100%">
              <el-table-column
                label="编号"
                width="180">
                <template slot-scope="scope">
                  <span>{{ scope.row.date }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="手机"
                width="180">
                <template slot-scope="scope">
                  <el-popover trigger="hover" placement="top">
                    <p>姓名: {{ scope.row.name }}</p>
                    <p>住址: {{ scope.row.address }}</p>
                    <div slot="reference" class="name-wrapper">
                      <el-tag size="medium">{{ scope.row.name }}</el-tag>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column
                label="姓名"
                width="180">
                <template slot-scope="scope">
                  <el-popover trigger="hover" placement="top">
                    <p>姓名: {{ scope.row.name }}</p>
                    <p>住址: {{ scope.row.address }}</p>
                    <div slot="reference" class="name-wrapper">
                      <el-tag size="medium">{{ scope.row.name }}</el-tag>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column
                label="入库"
                width="180">
                <template slot-scope="scope">
                  <i class="el-icon-time"></i>
                  <span style="margin-left: 10px;" >{{ scope.row.date }}</span>
                </template>
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
              :total="1000">
            </el-pagination>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'PackMain',
  data () {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      input2: '',
      input21: '',
      activeIndex: '1'
    }
  },
  methods: {
    handleEdit (index, row) {
      console.log(index, row)
    },
    handleDelete (index, row) {
      console.log(index, row)
    },
    initListData (){

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
