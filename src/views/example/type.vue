<template>
  <div class="app-container">
    <div style="margin-bottom: 20px">
      <el-button
        type="primary"
        size="small"
        icon="el-icon-edit"
        style="margin-left: 20px"
        @click="add"
      >
        新增
      </el-button>
    </div>
    <el-table
      ref="table"
      v-loading="listLoading"
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      lazy
      :load="loads"
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

      <el-table-column min-width="300px" label="新闻类型">
        <template slot-scope="{ row }">
          <a class="a_active" @click="copy(row)">{{ row.name }}</a>
          <!-- <a class="a_active">{{ row.name }}</a> -->
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
    <el-dialog title="新闻类型" :visible.sync="dialogTableVisible" width="680px">
      <!-- <div style="margin-bottom:20px">
                <label style="margin-right:5px">{{from.flag?'创建子节点':' 创建根节点'}}:</label>
                <el-switch v-model="from.flag" active-color="#13ce66" inactive-color="#13ce66">
                </el-switch>
            </div> -->
      <div>
        <div class="jdcx">
          <label>上级分类:</label>
          <!-- <el-select v-model="value" placeholder="请选择">
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select> -->
          <el-dropdown>
            <el-input v-model="deptName" class="wy_disable" type="primary" :disabled="true" style="width:187px">
              上级部门
              <i slot="suffix" class="el-icon-arrow-down el-icon--right" />
            </el-input>
            <el-dropdown-menu slot="dropdown">
              <el-tree
                ref="tree"
                :default-expanded-keys="[1]"
                node-key="id"
                :data="treedata"
                :props="defaultProps"
                :load="loadNode"
                :check-strictly="true"
                lazy
                @check-change="orgCheckChange"
                @node-click="handleNodeClick"
              />
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="jdcx">
          <label><span class="bt">*</span>新闻类型:</label>
          <el-input v-model="from.sname" class="el_input_g" />
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button v-loading="addtypeloading" type="primary" @click="addtype">确 定</el-button>
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
import { constants } from 'fs'

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
      addtypeloading: false,
      deptName: '',
      treedata: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      options: [],
      list: [],
      value: '',
      editing: false,
      dialogTableVisible: false,
      total: 0,
      id: '',
      listLoading: true,
      from: {
        flag: false,
        pname: '',
        sname: ''
      },
      selectOrg: {
        orgsid: []
      },
      maps: new Map(),
      selectVa: {},
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
    copy(row) {
      debugger
      const y = `/pages/tabBar/home/list?id=${row.id}`
      var input = document.createElement('input')
      input.setAttribute('id', 'copyInput')
      input.setAttribute('value', y)
      document.getElementsByTagName('body')[0].appendChild(input)
      document.getElementById('copyInput').select()
      document.execCommand('Copy')
      document.getElementById('copyInput').remove()
      this.$message({
        message: '复制成功',
        type: 'success'
      })
    },
    // 共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点本身是否被选中、节点的子树中是否有被选中的节点
    orgCheckChange(data, checked, indeterminate) {
      // 获取当前选择的id在数组中的索引
      const indexs = this.selectOrg.orgsid.indexOf(data.id)
      // 如果不存在数组中，并且数组中已经有一个id并且checked为true的时候，代表不能再次选择。
      if (indexs < 0 && this.selectOrg.orgsid.length === 1 && checked) {
        console.log('only one')
        // 设置已选择的节点为false 很重要
        this.selectOrg.orgsid = []
        this.$refs.tree.setChecked(this.selectVa, false)
        this.selectOrg.orgsid.push(data.id)
        this.selectVa = data
        this.deptName = data.name
      } else if (this.selectOrg.orgsid.length === 0 && checked) {
        // 发现数组为空 并且是已选择
        // 防止数组有值，首先清空，再push
        this.selectVa = data
        this.selectOrg.orgsid = []
        this.selectOrg.orgsid.push(data.id)
        this.deptName = data.name
      } else if (
        indexs >= 0 &&
        this.selectOrg.orgsid.length === 1 &&
        !checked
      ) {
        // 再次直接进行赋值为空操作
        this.selectOrg.orgsid = []
        this.deptName = ''
      }
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve(this.treedata)
      }

      if (node.level > 0) {
        this.getTree(node.data.id, resolve)
      }
    },
    loads(tree, treeNode, resolve) {
      var x = {
        parentId: tree.id
      }
      this.maps.set(tree.id, { tree, treeNode, resolve })
      this.$api
        .get(`${this.https}/api/logistics/articleCategory/by-parentid`, x)
        .then((res) => {
          for (var i = 0; i < res.length; i++) {
            res[i].hasChildren = !res[i].isLeaf
          }
          resolve(res)
        })
    },
    handleNodeClick(data) {
      this.selectOrg.orgsid = []
      this.selectOrg.orgsid.push(data.id)
      this.deptName = data.name
    },
    add() {
      this.dialogTableVisible = true
      this.value = ''
      this.from = {
        flag: false,
        pname: '',
        sname: ''
      }
    },
    edit(val) {
      this.selectOrg.orgsid = []
      this.editing = true
      this.from.sname = val.name
      this.value = val.parentId ? val.parentId : ''
      this.dialogTableVisible = true
      this.id = val.id
      this.selectOrg.orgsid.push(val.id)
      this.deptName = val.name
      this.$nextTick(() => {
        if (val.parentId != 0) {
          setTimeout(() => {
            //     this.$refs.tree.setChecked(val, true)
            //          let node = this.$refs.tree.getNode(20) // 通过节点id找到对应树节点对象
            // node.loaded = false
            // node.expand()
          }, 500)
        }
      })
    },
    addtype() {
      this.addtypeloading = true
      if (!this.from.sname) {
        this.$message.error('请填写必填项')
        return
      }
      var data = {
        name: this.from.sname,
        parentId:
          this.selectOrg.orgsid.length > 0 ? this.selectOrg.orgsid[0] : 0
      }
      const types = this.editing ? 'put' : 'post'
      if (this.editing) {
        data.id = this.id
      }
      this.$api[types](
        `${this.https}/api/logistics/articleCategory`,
        data
      ).then((res) => {
        this.from = {
          flag: false,
          pname: '',
          sname: ''
        }
        this.list = []
        this.addtypeloading = false
        this.editing = false
        this.dialogTableVisible = false
        this.getList()
      })
    },
    getTree(val, resolves) {
      var x = {
        parentId: val
      }
      this.$api
        .get(`${this.https}/api/logistics/articleCategory/by-parentid`, x)
        .then((res) => {
          console.log(res, 'test')
          resolves(res)
        })
    },
    getList() {
      this.listLoading = true
      // var x = {
      //   SkipCount: this.listQuery.SkipCount > 0 ? (this.listQuery.SkipCount - 1) * this.listQuery.MaxResultCount : this.listQuery.SkipCount,
      //   MaxResultCount: this.listQuery.MaxResultCount
      // }
      var x = {
        parentId: 0
      }
      this.$api
        .get(`${this.https}/api/logistics/articleCategory/by-parentid`, x)
        .then((res) => {
          for (var i = 0; i < res.length; i++) {
            res[i].hasChildren = !res[i].isLeaf
          }

          this.list = res
          this.treedata = res

          // this.value = res.items ? res.items[0].id : ''
          this.listLoading = false
        })
    },
    del(row) {
      const data = {
        id: row.id
      }
      // const { tree, treeNode, resolve } = this.maps.get(row.id)
      // this.$set(this.$refs.table.store.states.lazyTreeNodeMap, row.id, []) //将对应节点下的数据清空，从而实现数据的重新加载
      // this.loads(tree, treeNode, resolve)
      this.$api
        .delete(`${this.https}/api/logistics/articleCategory`, data)
        .then((res) => {
          this.list = []
          this.getList()
        })
    }
  }
}
</script>

<style scoped>
.a_active {
  color: #3399ff !important;
}
.el-dropdown-menu--medium {
  width: 187px;
}
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
.el-dropdown-menu{
  width:187px
}

</style>
