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
      <el-dropdown style="margin-left: 20px">
        <el-input
          v-model="deptName"
          type="primary"
          placeholder="请选择新闻类型"
          clearable
          @clear="getList(1)"
        >
          上级部门
          <i class="el-icon-arrow-down el-icon--right" />
        </el-input>
        <el-dropdown-menu slot="dropdown">
          <el-tree
            ref="tree"
            node-key="id"
            :data="treedata"
            :props="defaultProps"
            :load="loadNode"
            :check-strictly="true"
            lazy
          />
        </el-dropdown-menu>
      </el-dropdown>
      <el-input v-model="name" style="width: 200px;margin:0px 20px" placeholder="请输入查询内容" />
      <el-button @click="ops">查询</el-button>
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

      <el-table-column width="200px" label="标题">
        <template slot-scope="{ row }">
          <a class="a_active" @click="copy(row)">{{ row.title }}</a>
        </template>
      </el-table-column>
      <el-table-column align="center" label="摘要">
        <template slot-scope="scope">
          <span>{{ scope.row.intro }}</span>
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
          <router-link :to="'/example/edit/' + scope.row.id">
            <el-button type="primary" size="small" icon="el-icon-edit">
              修改
            </el-button>
          </router-link>
          <el-button
            size="small"
            style="margin-left: 20px"
            @click="del(scope.row)"
          >
            <svg-icon icon-class="dlt" />
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

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
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      name: '',
      options: [],
      value: '',
      treedata: [],
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        SkipCount: 0,
        MaxResultCount: 20
      }
    }
  },
  watch: {},
  created() {
    this.getList()
    this.getLists()
    this.op()
    this.deptName = ''
  },
  methods: {
    copy(row) {
      const y = `/pages/content/index?id=${row.id}`
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
    handleNodeClick(data) {
      this.value = data.id
      this.deptName = data.name
      this.getList()
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve(this.treedata)
      }

      if (node.level > 0) {
        this.getTree(node.data.id, resolve)
      }
    },
    getTree(val, resolves) {
      var x = {
        parentId: val
      }
      this.$api
        .get(`${this.https}/api/logistics/articleCategory/by-parentid`, x)
        .then((res) => {
          resolves(res)
        })
    },
    getLists() {
      this.listLoading = true
      var x = {
        parentId: 0
      }
      this.$api
        .get(`${this.https}/api/logistics/articleCategory/by-parentid`, x)
        .then((res) => {
          for (var i = 0; i < res.length; i++) {
            res[i].hasChildren = res[i].isLeaf
          }
          this.treedata = res
        })
    },
    ops() {
      this.getList()
    },
    op() {
      this.$api
        .get(`${this.https}/api/logistics/articleCategory`, {})
        .then((res) => {
          this.options = res.items
        })
    },
    add() {
      this.$router.push('/example/create')
    },
    getList(val) {
      if (val == 1) {
        this.value = ''
      }
      this.listLoading = true
      var x = {
        SkipCount:
          this.listQuery.SkipCount > 0
            ? (this.listQuery.SkipCount - 1) * this.listQuery.MaxResultCount
            : this.listQuery.SkipCount,
        MaxResultCount: this.listQuery.MaxResultCount,
        Title: this.name
      }
      if (this.value) {
        x.Category = this.value
      }
      this.$api.get(`${this.https}/api/logistics/article`, x).then((res) => {
        this.list = res.items
        this.total = res.totalCount
        this.listLoading = false
      })
    },
    del(row) {
      const data = {
        id: row.id
      }
      this.$api
        .delete(`${this.https}/api/logistics/article`, data)
        .then((res) => {
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
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
