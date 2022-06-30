<template>
  <div class="app-container">
    <div style="margin-bottom: 20px">
      <!-- <el-select v-model="value" placeholder="请选择" style="margin-left:20px" clearable @change="ops">
        <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
      </el-select> -->
      <el-button
        type="primary"
        size="small"
        style="margin-left: 20px"
        @click="edits()"
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
      <el-table-column label="运动项目">
        <template slot-scope="scope">
          <span class="a-active" @click="edit(scope.row)">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目图片">
        <template slot-scope="scope">
          <img :src="urlhttp + scope.row.banner" style="height: 60px" alt="">
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="300">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="edits(scope.row)"
          >
            修改
          </el-button>
          <el-popover
            :ref="`popover${scope.row.id}`"
            placement="top"
            width="160"
          >
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="cancel">取消</el-button>
              <el-button
                size="small"
                style="margin-left: 20px"
                @click="dels1(scope.row)"
              >
                <svg-icon icon-class="dlt" />
                删除
              </el-button>
            </div>
            <el-button slot="reference" style="margin-left: 13px;" @click="visible1=true">
              <svg-icon icon-class="dlt" />
              删除
            </el-button>

          </el-popover>

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
    <el-drawer
      :with-header="false"
      title="我是标题"
      :visible.sync="drawer"
      direction="rtl"
      size="70%"
    >
      <div class="drawers">
        <div class="drawers_info">
          <!-- <img :src="row.banner" alt="" width="200"> -->
          <div>{{ row.name }}</div>
        </div>
        <div class="drawers_info">
          <p>
            场地 <span @click="fieldsAdd()">新增</span><span v-if="fields.length > 0" @click="fieldsAdd(1)">编辑</span><span v-if="fields.length > 0" @click="delField()">删除</span>
          </p>
          <div>
            <ul>
              <li
                v-for="(item, index) in fields"
                :key="index"
                :class="index == field ? 'active' : ''"
                @click="sitesList(item.id, index, item)"
              >
                <span>{{ item.name }}</span>
              </li>
            </ul>
            <span
              v-if="fields.length == 0"
              style="    color: #666;    display: block;text-align: center;
}"
            >
              请添加场地
            </span>
          </div>
        </div>
        <div class="drawers_info">
          <p>
            场次 <span v-if="fields.length > 0" @click="sitesHe()">新增</span><span v-if="sites.length > 0" @click="sitesHe(1)">编辑</span><span v-if="sites.length > 0" @click="sitesHe(2)">删除</span>
          </p>
          <div>
            <ul>
              <li
                v-for="(item, index) in sites"
                :key="index"
                :class="index == site ? 'active' : ''"
                @click="schedule(item, index)"
              >
                <span>{{ item.name }}({{ item.startOn }}-{{ item.endOn }})</span>
              </li>
            </ul>
            <span
              v-if="sites.length == 0"
              style="color: #666; display: block; text-align: center"
            >
              请添加场次
            </span>
          </div>
        </div>
        <div class="drawers_info">
          <div>
            <el-calendar v-model="currentDate">
              <template slot="dateCell" slot-scope="{ date, data }">
                <div
                  class="date-cell"
                  :class="data.isSelected ? 'is-selected' : ''"
                  @click.stop="openTable(data)"
                >
                  <div class="calendar-day">
                    {{ data.day.split('-').slice(2).join('-') }}
                  </div>
                  <div
                    v-for="(item, index) in formatSchedule(data)"
                    :key="index"
                    class="subject_info"
                    style="text-align: center"
                    v-html="item"
                  />
                  <!-- <div>{{ formatSchedule(data) }}</div> -->
                </div>
              </template>
            </el-calendar>
          </div>
        </div>
      </div>
    </el-drawer>
    <el-dialog :visible.sync="fielding">
      <div>
        <div class="dialog_nam">
          <div>
            <label for=""><span class="bt">*</span>场馆名称:</label>
            <el-input v-model="sitesListVal.name" style="width: 200px" />
          </div>
          <div>
            <label for=""><span class="bt">*</span>场馆地址:</label>
            <el-input v-model="sitesListVal.address" style="width: 200px" />
          </div>
          <div>
            <label for=""><span class="bt">*</span>场馆容量:</label>
            <el-input v-model="sitesListVal.total" style="width: 200px" />
          </div>
          <div>
            <label for=""><span class="bt">*</span>场馆排序:</label>
            <el-input v-model="sitesListVal.sortIndex" style="width: 200px" />
          </div>
          <div>
            <label for=""><span class="bt">*</span>是否启用:</label>
            <el-select
              v-model="sitesListVal.flag"
              style="width: 200px"
              placeholder="请选择"
            >
              <el-option
                v-for="item in flags"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="fielding = false">取 消</el-button>
          <el-button type="primary" @click="addGround">确 定</el-button>
        </span>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="sitesing">
      <div>
        <div class="dialog_nam">
          <div>
            <label for=""><span class="bt">*</span>场次名称:</label>
            <el-input v-model="sitesItem.name" style="width: 200px" />
          </div>
          <div>
            <label for=""><span class="bt">*</span>场次排序:</label>
            <el-input v-model="sitesItem.sortIndex" style="width: 200px" />
          </div>
          <div>
            <label for=""><span class="bt">*</span>是否启用:</label>
            <el-select
              v-model="sitesItem.flag"
              style="width: 200px"
              placeholder="请选择"
            >
              <el-option
                v-for="item in flags"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div>
            <label for=""><span class="bt">*</span>场次时间:</label>
            <el-time-select
              v-model="sitesItem.startOn"
              placeholder="起始时间"
              :picker-options="{
                start: '08:00',
                step: '00:30:00',
                end: '22:30:00'
              }"
            />
            -
            <el-time-select
              v-model="sitesItem.endOn"
              placeholder="结束时间"
              :picker-options="{
                start: '08:30',
                step: '00:30:00',
                end: '23:00:00',
                minTime: sitesItem.startOn
              }"
            />
          </div>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button @click="sitesing = false">取 消</el-button>
          <el-button type="primary" @click="addsite">确 定</el-button>
        </span>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="tableing">
      <div>
        <el-table
          :data="lists"
          border
          fit
          highlight-current-row
          style="width: 100%"
        >
          <el-table-column align="center" label="预约时间">
            <template slot-scope="scope">
              <span>{{
                scope.row.creationTime | parseTime('{y}-{m}-{d}')
              }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="工号">
            <template slot-scope="scope">
              <span>{{ scope.row.userNo }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="预约人">
            <template slot-scope="scope">
              <span>{{ scope.row.userName }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态">
            <template slot-scope="scope">
              <span>{{ scope.row.flag ? '已预约' : '取消预约' }}</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total1 > 0"
          :total="total1"
          :page.sync="listQuery1.SkipCount"
          :limit.sync="listQuery1.MaxResultCount"
          @pagination="openTable"
        />
      </div>
    </el-dialog>
    <el-dialog :visible.sync="sparting" :title="ritem.id?'修改运动项目':'新增运动项目'" width="600px">
      <div>
        <div>
          <div>
            <label for=""><span class="bt">*</span>运动项目：</label>
            <el-input v-model="ritem.name" style="width: 250px" />
          </div>
          <!-- <div>
            <label for="">项目排序</label>
            <el-input v-model="ritem.name" style="width: 200px" />
          </div> -->
          <div style="text-align: left;">
            <label for="" style="display: inline-block;    margin-left: 112px;">banner图：</label>
            <el-upload
              style="margin-left: 7px;    margin-top: 74px;    vertical-align: middle;    display: inline-block;"
              :headers="myHeaders"
              class="avatar-uploader"
              :action="https + '/api/logistics/files/images/upload'"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img
                v-if="ritem.banner"
                :src="urlhttp + ritem.banner"
                class="avatar"
              >
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editsq">取 消</el-button>
          <el-button type="primary" @click="editsADD">确 定</el-button>
        </span>

      </div>
    </el-dialog>
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

      sparting: false,
      ritem: {},
      lists: [],
      total1: 0,
      tableing: false,
      currentDate: new Date(),
      flags: [
        { value: 1, label: '启用' },
        { value: 0, label: '禁用' }
      ],
      sitesListVal: {
        name: '',
        address: '',
        flag: 1
      },
      sitesListVals: {},
      fielding: false,
      field: '',
      fields: [],
      drawer: false,
      myHeaders: { Authorization: 'Bearer ' + vue_token },
      list: [],
      listLoading: true,
      total: 0,
      listQuery: {
        SkipCount: 0,
        MaxResultCount: 20
      },
      listQuery1: {
        SkipCount: 0,
        MaxResultCount: 20
      },
      sitesItem: {},
      sitesItems: {},
      sites: [],
      site: '',
      addsiteing: 0,
      sitesing: false,
      addsitesId: 0,
      row: {},
      days: [],
      valPage: {}
    }
  },
  computed: {
    formatSchedule() {
      return (data) => {
        let obj = {}
        for (let i = 0; i < this.days.length; i++) {
          const ele = this.days[i]
          const days = new Date(ele.day)
          ele.times =
            days.getFullYear() +
            '-' +
            (days.getMonth() > 9
              ? days.getMonth() + 1
              : '0' + (days.getMonth() + 1)) +
            '-' +
            days.getDate()
          if (data.day == ele.times) {
            obj = {
              num: `总数:${ele.total} </br> 预约:${
                ele.total - ele.surplus
              }</br>   剩余:${ele.surplus}`
            }
          }
        }
        return obj
      }
    }
  },
  watch: {
    drawer() {
      this.fields = []
      this.sites = []
      this.days = []
    },
    currentDate(nVal) {
      console.log(nVal)
      this.schedule(null, 0, nVal)
    }
  },
  created() {
    this.myHeaders = {
      Authorization:
        'Bearer ' + this.$store.state.vuex_token ||
        sessionStorage.getItem('vue_token')
    }
    this.getList()
    // this.op()
  },
  mounted() {},
  methods: {
    cancel() {
      document.body.click()
    },
    editsq() {
      this.ritem = {
        name: '',
        banner: ''
      }

      this.sparting = false
    },
    dels1(item) {
      this.$api
        .delete(
          `${this.https}/api/logistics/reservations/spaceCategory?id=${item.id}`,
          {}
        )
        .then((res) => {
          this.getList()
        })
    },
    editsADD() {
      if (!this.ritem.name) {
        this.$message.error('请填写必填项')
        return
      }
      if (this.ritem.id) {
        this.$api
          .put(
            `${this.https}/api/logistics/reservations/spaceCategory`,
            this.ritem
          )
          .then((res) => {
            this.getList()
            this.sparting = false
          })
      } else {
        this.$api
          .post(
            `${this.https}/api/logistics/reservations/spaceCategory`,
            this.ritem
          )
          .then((res) => {
            this.getList()
            this.sparting = false
          })
      }
    },
    edits(row) {
      if (row) {
        this.ritem = row
      } else {
        this.ritem = {
          name: '',
          banner: ''
        }
      }
      this.sparting = true
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 10

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 、png格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 10MB!')
      }
      return isJPG && isLt2M
    },
    handleAvatarSuccess(res, file) {
      this.ritem.banner = file.response.name
    },
    openTable(val) {
      if (val) {
        this.valPage = val
      }
      val = this.valPage
      var x = {
        flag: 1,
        StartDay: val.day,
        EndDay: val.day,
        SiteId: this.sitesItems.id,
        SkipCount:
          this.listQuery1.SkipCount > 0
            ? (this.listQuery1.SkipCount - 1) * this.listQuery1.MaxResultCount
            : this.listQuery1.SkipCount,
        MaxResultCount: this.listQuery1.MaxResultCount
      }
      this.$api
        .get(`${this.https}/api/logistics/reservations/reservation`, x)
        .then((res) => {
          this.lists = res.items
          this.total1 = res.totalCount
          this.tableing = true
        })
    },
    addGround() {
      debugger
      if (!(this.sitesListVal.name && this.sitesListVal.address && this.sitesListVal.total && this.sitesListVal.sortIndex)) {
        this.$message.error('请填写必填项')
        return
      }
      if (this.fieldsAdding === 1) {
        this.$api
          .post(
            `${this.https}/api/logistics/reservations/space`,
            this.sitesListVal
          )
          .then((res) => {
            this.fielding = false
            this.fieldsList()
          })
      } else {
        this.$api
          .put(
            `${this.https}/api/logistics/reservations/space`,
            this.sitesListVal
          )
          .then((res) => {
            this.fielding = false
            this.fieldsList()
          })
      }
    },
    delField() {
      this.$api
        .delete(
          `${this.https}/api/logistics/reservations/space?id=${this.sitesListValss.id}`
        )
        .then((res) => {
          this.fielding = false
          this.fieldsList()
        })
    },
    fieldsAdd(val) {
      this.fielding = true
      this.fieldsAdding = 0
      if (val !== 1) {
        this.fieldsAdding = 1
        this.sitesListVal = {
          name: '',
          address: '',
          flag: 1,
          categoryId: this.row.id
        }
      } else {
        this.sitesListVal = this.sitesListValss
      }
    },
    edit(row) {
      this.row = row
      this.fieldsList()
      this.drawer = true
    },
    addsite() {
      debugger
      if (!(this.sitesItem.endOn && this.sitesItem.name && this.sitesItem.sortIndex && this.sitesItem.startOn)) {
        this.$message.error('请填写必填项')
        return
      }
      if (this.addsiteing === 1) {
        this.$api
          .post(`${this.https}/api/logistics/reservations/site`, this.sitesItem)
          .then((res) => {
            this.sitesing = false
            this.sitesList(this.fields[0].id, 0, this.fields[0])
          })
      } else {
        this.$api
          .put(`${this.https}/api/logistics/reservations/site`, this.sitesItem)
          .then((res) => {
            this.sitesing = false
            this.sitesList(this.fields[0].id, 0, this.fields[0])
          })
      }
    },
    sitesHe(val) {
      if (val == 1) {
        this.addsiteing = 0
        this.sitesing = true
        this.sitesItem = this.sitesItems
      } else if (val == 2) {
        this.$api
          .delete(
            `${this.https}/api/logistics/reservations/site?id=${this.sitesItems.id}`
          )
          .then((res) => {
            this.fielding = false
            this.sitesList(this.fields[0].id, 0, this.fields[0])
          })
      } else {
        this.sitesing = true
        this.addsiteing = 1
        this.sitesItem = {
          name: '',
          endOn: '',
          startOn: '',
          flag: 1,
          spaceId: this.addsitesId,
          sortIndex: ''
        }
      }
    },
    sitesList(id, index, item) {
      this.field = index
      this.addsitesId = id
      this.sitesListValss = JSON.parse(JSON.stringify(item))
      this.$api
        .get(`${this.https}/api/logistics/reservations/site`, {
          SpaceId: id
        })
        .then((res) => {
          this.sites = res.items
          this.schedule(res.items[0], 0)
        })
    },
    getLastDay(year, month) {
      var new_year = year // 取当前的年份
      var new_month = month + 1 // 取下一个月的第一天，方便计算（最后一天不固定）
      if (month > 12) {
        new_month -= 12 // 月份减
        new_year++ // 年份增
      }
      var new_date = new Date(new_year, new_month, 1) // 取当年当月中的第一天
      console.log(new Date(new_date.getTime() - 1000 * 60 * 60 * 24).getDate())
      return new Date(new_date.getTime() - 1000 * 60 * 60 * 24).getDate() // 获取当月最后一天日期
    },

    schedule(item, index, times) {
      this.site = index
      if (item) {
        this.sitesItems = JSON.parse(JSON.stringify(item))
      }

      const time = times || new Date()

      const startDay =
        time.getFullYear() +
        '-' +
        (time.getMonth() + 1 > 9
          ? time.getMonth() + 1
          : '0' + (time.getMonth() + 1)) +
        '-01'
      const EndDay =
        time.getFullYear() +
        '-' +
        (time.getMonth() + 1 > 9
          ? time.getMonth() + 1
          : '0' + (time.getMonth() + 1)) +
        '-' +
        this.getLastDay(time.getFullYear(), time.getMonth())
      const data = {
        startDay: startDay,
        EndDay: EndDay,
        siteId: this.sitesItems.id
      }
      this.$api
        .get(`${this.https}/api/logistics/reservations/schedule`, data)
        .then((res) => {
          this.days = res.items
          this.$forceUpdate()
        })
    },
    fieldsList() {
      this.$api
        .get(`${this.https}/api/logistics/reservations/space`, {
          CategoryId: this.row.id
        })
        .then((res) => {
          this.fields = res.items
          this.field = 0
          if (res.items.length > 0) {
            this.sitesList(res.items[0].id, 0, res.items[0])
          }
        })
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
        .get(`${this.https}/api/logistics/reservations/spaceCategory`, x)
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
::v-deep .el-drawer.rtl {
  overflow-y: auto;
}
.demo-block .avatar-uploader {
  margin-top: 0px;
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
  width: 180px;
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
.dialog_nam_footer {
  text-align: center;
  margin-top: 59px;
  button {
    width: 120px;
    margin-right: 30px;
  }
}
.dialog_nam {
  display: flex;
  flex-wrap: wrap;
  > div {
    margin-right: 20px;
    margin-bottom: 20px;
  }
  label {
    margin-right: 5px;
  }
}
.drawers {
  padding: 20px;
  .drawers_info {
    border-bottom: 1px solid #e6e6e6;
    padding-bottom: 20px;
    p {
      color: #333;
      margin-bottom: 23px;

      span {
        margin-left: 10px;
        font-size: 12px;
        margin-right: 5px;
        color: #4f81fc;
        cursor: pointer;
      }
    }
  }
  ul {
    display: flex;

    li {
      margin-right: 20px;
      span {
        border: 1px solid#c4cde3;
        padding: 10px;
        border-radius: 8px;
        color: #666;
        font-size: 12px;
        cursor: pointer;
      }
    }
    li.active {
      span {
        color: #fff;
        background-color: #2362fb;
        border-color: #2362fb;
      }
    }
  }
}
::v-deep .el-dialog__footer {
  text-align: center;
}
.jdcx {
  label {
    margin-right: 20px;
  }
}
ul,
li {
  padding: 0;
  margin: 0;
  list-style: none;
}
.a-active {
  color: #3399ff !important;
}
</style>
