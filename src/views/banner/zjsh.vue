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

      <el-table-column min-width="300px" label="名称">
        <template slot-scope="{ row }">
          <span>{{ row.title }}</span>
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
    <el-dialog
      :title="id?'修改之江生活':'新增之江生活'"
      :visible.sync="dialogTableVisible"
      width="600px"
    >
      <!-- <div style="margin-bottom:20px">
                <label style="margin-right:5px">{{from.flag?'创建子节点':' 创建根节点'}}:</label>
                <el-switch v-model="from.flag" active-color="#13ce66" inactive-color="#13ce66">
                </el-switch>
            </div> -->
      <div>
        <!-- <div class="jdcx" style="margin-top: 0px">
          <label>类型选择:</label>
          <el-select v-model="value1" placeholder="请选择" style="width: 350px">
            <el-option
              v-for="item in options1"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </div> -->
        <!-- <div class="jdcx" v-if="!from.flag">
                    <label>根节点:</label>
                    <el-input class="el_input_g" v-model="from.sname" />
                </div> -->
        <div class="jdcx" style="margin-top: 0px">
          <label><span class="bt">*</span>名&nbsp;&nbsp;称:</label>
          <el-input
            v-model="from.title"
            class="el_input_g"
            style="width: 350px"
          />
        </div>
      </div>
      <div>
        <div class="jdcx">
          <label style="    line-height: 54px;    height: 54px;    display: inline-block;">内容简介:</label>
          <el-input
            v-model="from.intro"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入内容"
            class="el_input_g"
            style="width: 350px"
          />
        </div>
        <div class="jdcx">
          <label><span class="bt">*</span>地址链接:</label>
          <el-input
            v-model="from.url"
            class="el_input_g"
            style="width: 350px"
          />
        </div>
        <div class="jdcx">
          <label><span class="bt">*</span>列表排序:</label>
          <el-input
            v-model="from.sortIndex"
            class="el_input_g"
            style="width: 350px"
          />
        </div>
        <div class="jdcx">
          <label><span class="bt">*</span>是否大图:</label>
          <el-select
            v-model="from.fill"
            placeholder="请选择"
            style="width: 350px"
          >
            <el-option
              v-for="item in files"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </div>
        <div class="jdcx" style="    text-align: left;    margin-left: 48px;">
          <label style="    margin-right: 7px;"><span class="bt">*</span>背景颜色:</label>
          <div style="display: inline-block" @click="colorInputClick">
            <el-input
              class="wy_disable"
              disabled
              :value="from.bgColor"
              style="width: 220px"
              @click="colorInputClick"
            />
          </div>
          <div
            v-show="isShowColors"
            class="color-select-layer"
            style="position: absolute"
          >
            <sketch v-model="from.bgColor" @input="colorValueChange" />
          </div>
        </div>
      </div>
      <div>
        <div class="jdcx" style="width: 191px">
          <label><span class="bt">*</span>图片上传:</label>
          <el-upload
            style="margin-left: 155px;"
            :on-remove="handleRemove"
            :headers="myHeaders"
            class="avatar-uploader"
            :action="https + '/api/logistics/files/images/upload'"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="from.coverImages"
              :src="from.coverImages"
              class="avatar"
            >
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addtypes">取 消</el-button>
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
import { Sketch } from 'vue-color'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
var vue_token = sessionStorage.getItem('vue_token')
export default {
  name: 'ArticleList',
  components: { Pagination, Sketch },
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
      editing: false,
      isShowColors: false,
      color: '#3f3f3f',
      dialogTableVisible: false,
      id: '',
      options: [
        {
          name: 'banner',
          id: 0
        },
        {
          name: '之江生活',
          id: 1
        },
        {
          name: '全部',
          id: 2
        }
      ],
      files: [
        { name: '是', id: 1 },
        { name: '否', id: 0 }
      ],
      file: '0',
      value: 2,
      options1: [
        {
          name: 'banner',
          id: 0
        },
        {
          name: '之江生活',
          id: 1
        }
      ],
      value1: 1,
      list: null,
      total: 0,
      from: {
        title: '',
        bgColor: '',
        url: '',
        Category: '',
        coverImage: '',
        coverImages: '',
        fill: 1,
        sortIndex: '',
        intro: ''
      },
      listLoading: true,
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
  mounted() {
    this.myHeaders = {
      Authorization:
        'Bearer ' + (this.$store.state.vuex_token ||
        sessionStorage.getItem('vue_token'))
    }
  },
  methods: {
    cancel() {
      document.body.click()
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    edit(val) {
      this.editing = true
      this.from = {
        title: val.title,
        bgColor: val.bgColor || '',
        url: val.url,
        Category: val.Category,
        coverImage: val.coverImage,
        coverImages: this.urlhttp + val.coverImage,
        fill: val.fill,
        intro: val.intro,
        sortIndex: val.sortIndex
      }
      this.value1 = val.category
      this.dialogTableVisible = true
      this.id = val.id
    },
    addtypes() {
      this.dialogTableVisible = false
      this.from = {
        title: '',
        bgColor: '',
        url: '',
        Category: '',
        coverImage: '',
        sortIndex: '',
        intro: '',
        fill: 1
      }
    },
    addtype() {
      var data = this.from
      data.Category = this.value1
      if (!(data.title && data.bgColor && data.url && data.coverImage && data.sortIndex)) {
        this.$message.error('必填项不能为空')
      }
      delete data.coverImages
      const types = this.editing ? 'put' : 'post'
      if (this.editing) {
        data.id = this.id
      }
      this.$api[types](`${this.https}/api/logistics/banner`, data).then(
        (res) => {
          this.from = {
            title: '',
            bgColor: '',
            url: '',
            Category: '',
            coverImage: '',
            sortIndex: '',
            intro: ''
          }
          this.editing = false
          this.dialogTableVisible = false
          this.getList()
        }
      )
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type.indexOf('image') != -1
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('只能上传图片！')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    handleAvatarSuccess(res, file) {
      this.from.coverImage = file.response.name
      this.from.coverImages = URL.createObjectURL(file.raw)
    },
    // 颜色输入框点击事件处理
    colorInputClick() {
      this.isShowColors = !this.isShowColors
    },
    // 颜色值改变事件处理
    colorValueChange(val) {
      console.log(val)

      // 取颜色对象的十六进制值
      this.from.bgColor = val.hex
    },
    ops() {
      this.getList()
    },
    // op() {
    //   this.$api.get(`${this.https}/api/logistics/banner`, {}).then(res => {
    //     this.options = res.items
    //   })
    // },
    add() {
      this.from = {
        title: '',
        bgColor: '',
        url: '',
        Category: '',
        coverImage: '',
        sortIndex: '',
        intro: '',
        fill: 1
      }
      this.editing = false
      this.dialogTableVisible = true
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
      if (this.value != 2) {
      }
      x.Category = 1
      this.$api.get(`${this.https}/api/logistics/banner`, x).then((res) => {
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
        .delete(`${this.https}/api/logistics/banner`, data)
        .then((res) => {
          this.getList()
        })
    }
  }
}
</script>

<style scoped>
.color-select-layer {
  z-index: 9;
  margin-left: 65px;
}
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
  /* display: inline-block; */
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
