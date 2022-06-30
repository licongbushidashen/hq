<template>
  <div class="app-container">
    <div style="margin-bottom: 20px">
      <el-button
        type="primary"
        size="small"
        style="margin-left: 20px"
        @click="add"
      >
        <svg-icon icon-class="add" />
        新增
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <!-- <el-table-column align="center" label="ID" width="80">
                <template slot-scope="scope">
                    <span>{{ scope.row.id }}</span>
                </template>
            </el-table-column> -->

      <!-- <el-table-column width="120px" align="center" label="作者">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column> -->

      <!-- <el-table-column class-name="status-col" label="Status" width="110">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column> -->

      <el-table-column min-width="300px" label="服务名称">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{
            scope.row.creationTime | parseTime('{y}-{m}-{d} {h}:{i}')
          }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="240">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="edit(scope.row)"
          >
            修改
          </el-button>
          <el-popover
            :ref="`popover${scope.row.id}`"
            trigger="click"
            placement="top"
            width="160"
          >
            <p>是否确认删除</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="cancel">取消</el-button>
              <el-button
                size="small"
                style="margin-left: 20px"
                @click="del(scope.row)"
              >
                <svg-icon icon-class="dlt" />
                删除
              </el-button>
            </div>
            <el-button slot="reference" style="margin-left: 13px;">
              <svg-icon icon-class="dlt" />
              删除</el-button>

          </el-popover>

        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="id?'修改服务':'新增服务'" :visible.sync="dialogTableVisible" width="680px">
      <!-- <div style="margin-bottom:20px">
                <label style="margin-right:5px">{{from.flag?'创建子节点':' 创建根节点'}}:</label>
                <el-switch v-model="from.flag" active-color="#13ce66" inactive-color="#13ce66">
                </el-switch>
            </div> -->
      <div>
        <!-- <div class="jdcx" v-if="!from.flag">
                    <label>根节点:</label>
                    <el-input class="el_input_g" v-model="from.sname" />
                </div> -->
        <div class="jdcx" style="margin-top: 0px">
          <label><span class="bt">*</span>服务名称:</label>
          <el-input v-model="from.sname" class="el_input_g" />
        </div>
        <div class="jdcx" style="margin-top: 0px">
          <label><span class="bt">*</span>列表排序:</label>
          <el-input v-model="from.sortIndex" class="el_input_g" />
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="addtype">确 定</el-button>
      </span>
    </el-dialog>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.SkipCount"
      :limit.sync="listQuery.MaxResultCount"
      @pagination="getList"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ArticleList',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {

      options: [],
      list: null,
      value: '',
      editing: false,
      dialogTableVisible: false,
      total: 0,
      id: '',
      listLoading: true,
      from: {
        flag: false,
        pname: '',
        sname: '',
        sortIndex: ''
      },
      listQuery: {
        SkipCount: 0,
        MaxResultCount: 20
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    cancel() {
      document.body.click()
    },
    add() {
      this.dialogTableVisible = true
      this.value = ''
      this.id = ''
      this.from = {
        flag: false,
        pname: '',
        sname: '',
        sortIndex: ''
      }
    },
    edit(val) {
      this.editing = true
      this.from.sortIndex = val.sortIndex
      this.from.sname = val.name
      this.value = val.parentId ? val.parentId : ''
      this.dialogTableVisible = true
      this.id = val.id
    },
    addtype() {
      if (!this.from.sname) {
        this.$message.error('请输入服务名称')
        return
      } if (!this.from.sortIndex) {
        this.$message.error('请输入列表排序')
        return
      }
      var data = {
        name: this.from.sname,
        sortIndex: this.from.sortIndex
      }
      const types = this.editing ? 'put' : 'post'
      if (this.editing) {
        data.id = this.id
      }
      this.$api[types](`${this.https}/api/logistics/appCategory`, data).then(
        (res) => {
          this.from = {
            flag: false,
            pname: '',
            sname: '',
            sortIndex: ''
          }
          this.editing = false
          this.dialogTableVisible = false
          this.getList()
        }
      )
    },
    getList() {
      this.listLoading = true
      var x = {
        SkipCount:
          this.listQuery.SkipCount > 0
            ? (this.listQuery.SkipCount - 1) * this.listQuery.MaxResultCount
            : this.listQuery.SkipCount,
        MaxResultCount: this.listQuery.MaxResultCount
      }

      this.$api
        .get(`${this.https}/api/logistics/appCategory`, x)
        .then((res) => {
          this.list = res.items
          this.options = res.items

          // this.value = res.items ? res.items[0].id : ''
          this.total = res.totalCount
          this.listLoading = false
        })
    },
    del(row) {
      const data = {
        id: row.id
      }
      this.$api
        .delete(`${this.https}/api/logistics/appCategory`, data)
        .then((res) => {
          this.getList()
        })
    }
  }
}
</script>

<style scoped>
.el_input_g {
  display: inline-block;
  width: 160px;
}
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.jdcx {
  display: inline-block;
  margin-right: 20px;
}
</style>
<style lang="scss" scoped>
::v-deep .el-dialog__footer {
  text-align: center;
}
.jdcx {
  label {
    margin-right: 20px;
  }
}
</style>
