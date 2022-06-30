<template>
  <div v-loading="isEditorShow" class="createPost-container">
    <el-form
      ref="postForm"
      :model="postForm"
      :rules="rules"
      class="form-container"
    >
      <!-- <el-button
          v-loading="loading"
          style="margin-left: 10px"
          type="success"
          @click="submitForm"
        >
          发布
        </el-button> -->
      <!-- <sticky :z-index="10" :class-name="'sub-navbar ' + postForm.status"> -->
      <!-- <CommentDropdown v-model="postForm.comment_disabled" />
        <PlatformDropdown v-model="postForm.platforms" />
        <SourceUrlDropdown v-model="postForm.source_uri" /> -->

      <!-- <el-button v-loading="loading" type="warning" @click="draftForm">
          Draft
        </el-button> -->
      <!-- </sticky> -->

      <div class="createPost-main-container">
        <el-row>
          <!-- <Warning /> -->

          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px" prop="title">
              <label class="el-form-item__label" style="float:none;    margin-left: 3px;"><span class="bt">*</span>标&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;题:</label>
              <MDinput
                v-model="postForm.title"
                :maxlength="100"
                name="name"
                required
              />
            </el-form-item>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item
                    label-width="80px"
                    label="新闻类型:"
                    class="postInfo-container-item"
                  >
                    <el-dropdown>
                      <el-input
                        v-model="deptName"
                        type="primary"
                        :disabled="true"
                        class="wy_disable"
                      >
                        <i slot="suffix" class="el-icon-arrow-down el-icon--right" />
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
                          @check-change="orgCheckChange"
                          @node-click="handleNodeClick"
                        />
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label-width="120px"
                    label="是否显示标题:"
                    class="postInfo-container-item"
                  >
                    <el-select v-model="showTitle">
                      <el-option key="true" :value="true" label="是" />
                      <el-option key="false" :value="false" label="否" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="10">
                  <el-form-item label-width="120px" label="Publish Time:" class="postInfo-container-item">
                    <el-date-picker v-model="displayTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="Select date and time" />
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item label-width="90px" label="Importance:" class="postInfo-container-item">
                    <el-rate v-model="postForm.importance" :max="3" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :low-threshold="1" :high-threshold="3" style="display:inline-block" />
                  </el-form-item>
                </el-col> -->
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-form-item
          style="margin-bottom: 40px"
          label-width="80px"
          label=""
        >
          <label
            for=""
            style="    position: absolute;    left: -72px"
          >摘&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;要:</label>
          <el-input
            v-model="postForm.content_short"
            :rows="2"
            type="textarea"
            class="article-textarea"
            autosize
            placeholder="请输入摘要"
          />
          <span
            v-show="contentShortLength"
            class="word-counter"
          >{{ contentShortLength }}字</span>
        </el-form-item>

        <el-form-item
          v-if="!isEditorShow"
          prop="content"
          style="margin-bottom: 30px"
        >
          <label for="" style="    position: absolute;    top: 114px;    left: 5px;">内&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;容:</label>
          <Toolbar
            style="border-bottom: 1px solid #ccc;margin-left: 80px;"
            :editor-id="editorId"
            :default-config="toolbarConfig"
            :mode="mode"
          />
          <Editor
            style="height: 300px; overflow-y: hidden;margin-left: 80px;"
            :editor-id="editorId"
            :default-config="editorConfig"
            :default-html="contentWang"
            :mode="mode"
            @onChange="onChange"
          />
        </el-form-item>

        <!-- <Upload v-model="postForm.image_uri" /> -->
        <div class="jdcx" style="margin-bottom: 30px">
          <label>图片上传:</label>
          <el-upload
            style="display: inline-block;    margin-left: 20px;"
            :limit="4"
            :headers="myHeaders"
            :action="https + '/api/logistics/files/images/upload'"
            list-type="picture-card"
            :on-success="handleAvatarSuccess"
            :file-list="image_uri_list"
            :on-remove="handleRemove"
            :on-exceed="handleExceed"
          >
            <i class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </div>
      </div>
    </el-form>
    <div style="    text-align: center;">
      <el-button
        v-loading="loading"
        style="margin-left: 10px;    position: relative;    bottom: 20px;border: 1px solid rgb(64, 158, 255);;background: rgb(64, 158, 255);"
        type="success"
        @click="submitForm"
      >
        发布
      </el-button>
    </div>
  </div>
</template>

<script>
import '@wangeditor/editor/dist/css/style.css'
import {
  Editor,
  Toolbar,
  getEditor,
  removeEditor
} from '@wangeditor/editor-for-vue'
import Upload from '@/components/Upload/SingleImage3'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import { validURL } from '@/utils/validate'
import { fetchArticle } from '@/api/article'
import { searchUser } from '@/api/remote-search'
import Warning from './Warning'
import {
  CommentDropdown,
  PlatformDropdown,
  SourceUrlDropdown
} from './Dropdown'
var vue_token = sessionStorage.getItem('vue_token')
const defaultForm = {
  status: 'draft',
  title: '', // 文章题目
  content: '', // 文章内容
  content_short: '', // 文章摘要
  source_uri: '', // 文章外链
  source_uris: '',
  image_uri: '', // 文章图片

  display_time: undefined, // 前台展示时间
  id: undefined,
  platforms: ['a-platform'],
  comment_disabled: false,
  importance: 0
}

export default {
  name: 'ArticleDetail',
  components: {
    Editor,
    Toolbar,
    MDinput,
    Upload,
    Sticky,
    Warning,
    CommentDropdown,
    PlatformDropdown,
    SourceUrlDropdown
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        // this.$message({
        //   message: rule.field == 'title' ? '标题' : rule.field + '为必传项',
        //   type: 'error'
        // })
        callback(new Error((rule.field == 'title' ? '标题' : rule.field) + '为必传项'))
      } else {
        callback()
      }
    }
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validURL(value)) {
          callback()
        } else {
          this.$message({
            message: '外链url填写不正确',
            type: 'error'
          })
          callback(new Error('外链url填写不正确'))
        }
      } else {
        callback()
      }
    }
    return {
      isEditorShow: false,
      content: '',
      editorId: `w-e-${Math.random().toString().slice(-5)}`, // 【注意】编辑器 id ，要全局唯一
      toolbarConfig: {},
      editorConfig: {
        placeholder: '请输入内容...',
        MENU_CONF: {
          uploadImage: {
            server: this.https + '/api/logistics/files/images/upload',
            base64LimitSize: 500 * 1024
          }
        }
      },
      mode: 'default', // or 'simple'
      // defaultContent （JSON 格式） 和 defaultHtml（HTML 格式）二选一
      // defaultContent: [{ type: "paragraph", children: [{ text: "一行文字" }] }],
      defaultHtml: '',
      image_uri_list1: [],
      image_uri_list: [],
      myHeaders: { Authorization: 'Bearer ' + vue_token },
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      rules: {
        title: [{ validator: validateRequire }]
      },
      showTitle: true,
      contentWang: '',
      tempRoute: {},
      deptName: '',
      deptId: '',
      treedata: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      infos: {},
      selectOrg: {
        orgsid: []
      }
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.content_short.length
    },
    displayTime: {
      // set and get is useful when the data
      // returned by the back end api is different from the front end
      // back end return => "2013-06-25 06:59:25"
      // front end need timestamp => 1372114765000
      get() {
        return +new Date(this.postForm.display_time)
      },
      set(val) {
        this.postForm.display_time = new Date(val)
      }
    }
  },
  created() {
    // this.myHeaders.Authorization = 'Bearer ' + this.$store.state.vuex_token || localStorage.getItem('vue_token')
    if (this.isEdit) {
      this.isEditorShow = true
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    }
    this.getList()
    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    handleExceed(files, fileList) {
      this.$message.warning('最多上传9张图片，请删除其他图片后上传！')
    },
    onChange(editor) {
      this.contentWang = editor.getHtml()
    },
    handleRemove(file, fileList) {
      this.image_uri_list1 = this.image_uri_list1.filter((e) => {
        return file.name !== e.name
      })
    },
    handleAvatarSuccess(res, file, list) {
      console.log(file, list)
      this.image_uri_list1.push({ name: file.response.name, url: file.url })
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
    handleNodeClick(data) {
      this.deptName = data.name
      this.selectOrg.orgsid = []
      this.selectOrg.orgsid.push(data.id)
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
            res[i].hasChildren = res[i].isLeaf
          }

          this.treedata = res

          // this.value = res.items ? res.items[0].id : ''
          this.listLoading = false
        })
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
    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve(this.treedata)
      }

      if (node.level > 0) {
        this.getTree(node.data.id, resolve)
      }
    },
    fetchData(id) {
      this.$api
        .get(`${this.https}/api/logistics/article/${id}`, {})
        .then((response) => {
          this.infos = response
          this.postForm = {
            title: response.title,
            content: response.content.content,
            image_uri: response.coverImage, // 文章外链
            image_uris: this.urlhttp + response.coverImage,
            content_short: response.intro
          }
          this.showTitle = response.showTitle
          this.contentWang = response.content.content
          const imgs1 = response.coverImage.split(',')
          for (let i = 0; i < imgs1.length; i++) {
            if (!imgs1[i]) {
              break
            }
            this.image_uri_list1.push({
              name: imgs1[i],
              url: this.urlhttp + imgs1[i]
            })
            this.image_uri_list.push({
              name: imgs1[i],
              url: this.urlhttp + imgs1[i]
            })
          }
          setInterval(() => {
            this.isEditorShow = false
          }, 1000)
          this.$api
            .get(
              `${this.https}/api/logistics/articleCategory/${response.category}`,
              {}
            )
            .then((res) => {
              this.deptName = res.name
              this.deptId = res.id
            })
          // just for test
          // this.postForm.title += ` ${this.postForm.id}`
          // this.postForm.content_short += `   Article Id:${this.postForm.id}`

          // set tagsview title
          // this.setTagsViewTitle()

          // set page title
          // this.setPageTitle()
        })
        .catch((err) => {
          console.log(err)
        })
    },
    setTagsViewTitle() {
      const title = 'Edit Article'
      const route = Object.assign({}, this.tempRoute, {
        title: `${title}-${this.postForm.id}`
      })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = 'Edit Article'
      document.title = `${title} - ${this.postForm.id}`
    },
    submitForm() {
      this.$refs.postForm.validate((valid) => {
        let image_url = ''
        for (let i = 0; i < this.image_uri_list1.length; i++) {
          image_url += this.image_uri_list1[i].name + ','
        }

        if (valid) {
          const data = {
            title: this.postForm.title,
            coverImage: image_url,
            category: this.selectOrg.orgsid[0] || this.deptId,
            intro: this.postForm.content_short,
            content: {
              content: this.contentWang
            },
            showTitle: this.showTitle
          }
          this.loading = true
          if (!this.isEdit) {
            this.$api
              .post(`${this.https}/api/logistics/article`, data)
              .then((res) => {
                this.$notify({
                  title: '成功',
                  message: '发布文章成功',
                  type: 'success',
                  duration: 2000
                })
                this.postForm.status = 'published'
                this.loading = false
              })
          } else {
            const data = this.infos
            data.coverImage = image_url
            data.title = this.postForm.title
            data.intro = this.postForm.content_short
            data.category = this.selectOrg.orgsid[0] || this.deptId
            data.content.content = this.contentWang
            data.id = this.$route.params && this.$route.params.id
            data.showTitle = this.showTitle
            // console.log(this.$route.params && this.$route.params.id)
            this.$api
              .put(`${this.https}/api/logistics/article`, data)
              .then((res) => {
                this.$notify({
                  title: '成功',
                  message: '更改文章成功',
                  type: 'success',
                  duration: 2000
                })
                this.postForm.status = 'published'
                this.loading = false
              })
          }
        } else {
          return false
        }
      })
    },
    draftForm() {
      if (
        this.postForm.content.length === 0 ||
        this.postForm.title.length === 0
      ) {
        this.$message({
          message: '请填写必要的标题和内容',
          type: 'warning'
        })
        return
      }
      this.$message({
        message: '保存成功',
        type: 'success',
        showClose: true,
        duration: 1000
      })
      this.postForm.status = 'draft'
    },
    getRemoteUserList(query) {
      searchUser(query).then((response) => {
        if (!response.data.items) return
        this.userListOptions = response.data.items.map((v) => v.name)
      })
    }
  }
}
</script>
<style>.el-form-item__error{
    left: 53px !important;
}</style>
<style lang="scss" scoped>
::v-deep .w-e-text-container {
  border: 1px solid #3333334a;
  border-top: 1px solid transparent;
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
  width: 180px;
}
.avatar-uploader:hover {
  border-color: #409eff;
}
// .avatar-uploader-icon {
//   font-size: 28px;
//   color: #8c939d;
//   width: 178px;
//   height: 178px;
//   line-height: 178px;
//   text-align: center;
// }
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
.el-dropdown-menu--medium {
  width: 187px;
}
@import '~@/styles/mixin.scss';

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea ::v-deep {
  textarea {
    padding-right: 40px;
    resize: none;
    // border: none;
    // border-radius: 0px;
    height: 40px !important;
    line-height: 28px;
    border: 1px solid #bfcbd9;
  }
}
.jdcx{
  label{
        font-size: 14px;
    color: #606266;
        height: 147px;
    display: inline-block;
    position: relative;
    top: 61px;
  }
}

</style>
