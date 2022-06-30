<template>
  <div class="app-container">
    <div style="margin-bottom: 20px">
      <!-- <el-select v-model="value" placeholder="请选择" style="margin-left:20px" clearable @change="ops">
        <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select> -->
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column align="center" label="预约时间">
        <template slot-scope="scope">
          <span>{{ scope.row.schedule.day }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="场馆">
        <template slot-scope="scope">
          <span>{{ scope.row.schedule.space.name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="地址">
        <template slot-scope="scope">
          <span>{{ scope.row.schedule.space.address }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="预约场次">
        <template slot-scope="scope">
          <span>{{ scope.row.schedule.site.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="240">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.flag == 1"
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="edit(scope.row)"
          >
            取消预约
          </el-button>
          <span v-else>预约已取消</span>
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
var vue_token = sessionStorage.getItem('vue_token')
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
      myHeaders: { Authorization: 'Bearer ' + vue_token },
      list: [],
      listLoading: true,
      total: 0,
      listQuery: {
        SkipCount: 0,
        MaxResultCount: 20
      }
    }
  },
  created() {
    this.getList()
    // this.op()
  },
  mounted() {},
  methods: {
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
        .get(`${this.https}/api/logistics/reservations/reservation`, x)
        .then((res) => {
          this.list = res.items
          this.total = res.totalCount
          this.listLoading = false
        })
    },
    del(val) {
      const data = {
        flag: 0,
        userId: val.userId,
        scheduleId: val.scheduleId
      }
      this.$api
        .put(
          `${this.https}/api/logistics/reservations/reservation?id=${val.id}`,
          data
        )
        .then((res) => {
          this.getList()
        })
    }
  }
}
</script>

<style scoped>
.demo-block .avatar-uploader {
  margin-top: 20px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader {
  margin-top: 20px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
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
  margin-right: 20px;
  margin-top: 20px;
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
