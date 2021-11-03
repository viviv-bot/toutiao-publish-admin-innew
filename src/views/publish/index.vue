<template>
  <div class="publish-container">
    <el-card class="box-card">
      <!-- 注意这里的v-slot要用冒号 -->
      <template v-slot:header>
        <div class="clearfix">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <!-- 面包屑导航 -->
            <el-breadcrumb-item to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{
              $route.query.id ? "修改文章" : "发布文章"
            }}</el-breadcrumb-item>
            <!-- 面包屑导航结束 -->
          </el-breadcrumb>
        </div>
      </template>

      <el-form
        ref="publish-form"
        :model="article"
        :rules="formRules"
        label-width="60px"
        size="mini"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="article.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <!-- <el-input type="textarea" v-model="article.content"></el-input> -->
          <!-- <el-tiptap
              v-model="article.content"
              :extensions="extensions"
              /> -->
          <div class="editor_wrap">
            <quill-editor
              ref="QuillEditor"
              theme="snow"
              :content="article.content"
              v-model="article.content"
              :options="editorOption"
              contentType="html"
            />
            <!-- <div v-html="str" class="ql-editor">
                 {{str}}
                </div> -->
          </div>
        </el-form-item>
        <!-- <div v-html="article.content" class="ql-editor">
                        {{article.content}}
                        </div> -->
        <div class="nothing"></div>
        <el-form-item label="封面">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
            <div class="img-content">
            <template v-if="article.cover.type>0">
              <div class="cover-select">              
                <uploader-cover
               :key="cover"
               v-for="(cover, index) in article.cover.type"
               v-model="article.cover.images[index]"/>
              </div>
              <!-- <uploader-cover 
              v-for="(cover,index) in article.cover.type" 
              :key="cover" 
              :cover-image="article.cover.images[index]" 
              @update-cover="onUpdateCover(index, $event)">
              </uploader-cover> -->
            </template>
            </div>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道" prop="channel_id">
          <el-select v-model="article.channel_id" placeholder="请选择频道">
            <el-option
              :label="channel.name"
              :value="channel.id"
              v-for="(channel, index) in channels"
              :key="index"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onPublish(false)">发表</el-button>
          <el-button @click="onPublish(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import {
  getArticlesChannels,
  addArticle,
  getArticle,
  updateArticle
} from '@/api/article'
// import {
//   ElementTiptap,
//   Doc,
//   Text,
//   Paragraph,
//   Heading,
//   Bold,
//   Underline,
//   Italic,
//   Strike,
//   ListItem,
//   BulletList,
//   OrderedList
// } from 'element-tiptap'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import UploaderCover from './components/upload-cover'
export default {
  name: 'PublishIndex',
  //   props: ['value'],
  //   watch: {
  //     value: function () {
  //       this.content = this.value
  //     }
  //   },
  //   components: { 'el-tiptap': ElementTiptap },
  components: { 'quill-editor': QuillEditor, UploaderCover },
  props: {},
  data () {
    return {
      channels: [],
      article: {
        title: '', // 文章标题
        content: '<h1>123</h1>',
        cover: {
          type: 1, // 封面类型： -1 自动； 0-无图；1-1张；3-3张
          images: [] // 封面图片的地址
        },
        channel_id: null
      },
      editorOption: {
        placeholder: '请在这里输入',
        readOnly: false,
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // 加粗，斜体，下划线，删除线
            ['blockquote', 'code-block'], // 引用，代码块
            [{ header: 1 }, { header: 2 }], // 标题，键值对的形式；1、2表示字体大小
            [{ list: 'ordered' }, { list: 'bullet' }], // 列表
            [{ script: 'sub' }, { script: 'super' }], // 上下标
            [{ indent: '-1' }, { indent: '+1' }], // 缩进
            [{ direction: 'rtl' }], // 文本方向
            [{ size: ['small', false, 'large', 'huge'] }], // 字体大小
            [{ header: [1, 2, 3, 4, 5, 6, false] }], // 几级标题
            [{ color: [] }, { background: [] }], // 字体颜色，字体背景颜色
            [{ font: [] }], // 字体
            [{ align: [] }], // 对齐方式
            ['clean'], // 清除字体样式
            ['image', 'video'] // 上传图片、上传视频
          ]
        }
      },
      formRules: {
        // 校验标题 点击发表时触发校验
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          {
            min: 5,
            max: 30,
            message: '长度在 5 到 30 个字符',
            trigger: 'blur'
          }
        ],
        // 校验文章内容
        content: [
          // { required: true, message: '请输入文章内容', trigger: 'change' }
          {
            validator (rule, value, callback) {
              console.log('content validator')
              if (value === '<p></p>') {
                // 验证失败
                callback(new Error('请输入文章内容'))
              } else {
                // 验证通过
                callback()
              }
            }
          },
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ],
        channel_id: [{ required: true, message: '请选择文章频道' }]
      }
      // 编辑器的 extensions
      // 它们将会按照你声明的顺序被添加到菜单栏和气泡菜单中
      //   extensions: [
      //     new Doc(),
      //     new Text(),
      //     new Paragraph(),
      //     new Heading({ level: 5 }),
      //     new Bold({ bubble: true }), // 在气泡菜单中渲染菜单按钮
      //     new Underline({ bubble: true, menubar: false }), // 在气泡菜单而不在菜单栏中渲染菜单按钮
      //     new Italic(),
      //     new Strike(),
      //     new ListItem(),
      //     new BulletList(),
      //     new OrderedList()
      //   ]
    }
  },
    // computed: {
    //   editor () {
    //     return this.$refs.myQuillEditor.quill
    //   }
    // },
  created () {
    // 由于我们发布文章和编辑文章是同一个组件，所以要提前判断
    // 判断逻辑：如果请求参数中有id,则显示文章内容进行编辑文章页面展示
    this.loadChannels()
    if (this.$route.query.id) {
      this.loadArticle()
    }
  },
  mounted () {
    // this.str = this.escapeStringHTML(this.article.content)
    
  },
  methods: {
    onSubmit () {
      console.log('submit!')
    },
    // 解构
    // const obj={
    //     a:{
    //         b:{
    //             c:123
    //         }
    //     }
    // }
    // const {a:{b:{c}}}=obj
    // console.log(c)
    loadChannels () {
      getArticlesChannels().then(({ data }) => {
        this.channels = data.data.channels
      })
    },
    // 如果是修改文章，则执行修改操作；否则，执行发布文章操作
    onPublish (draft = false) {
      this.$refs['publish-form'].validate((valid) => {
        if (!valid) {
          return
        }
        // 验证通过则提交表单
        // 提交表单过程：找到数据接口，封装请求方法，请求提交表单
        const articleId = this.$route.query.id
        if (articleId) {
          //   执行修改操作
          updateArticle(articleId, this.article, draft).then((res) => {
            console.log(res)
            this.$message({
              message: `${draft ? '存入草稿' : '发布'}成功`,
              type: 'success'
            })
          })
        } else {
          // this.article.content = this.escapeStringHTML(this.article.content)
          addArticle(this.article, draft).then((res) => {
            // console.log(res)
            this.$message({
              message: `${draft ? '存入草稿' : '发布'}成功`,
              type: 'success'
            })
            this.$router.push('/article')
          })
        }
      })
    },
    loadArticle () {
      console.log('loadArticle')
      getArticle(this.$route.query.id).then((res) => {
        // console.log(res)
        this.article = res.data.data
        this.article.content = res.data.data.content
        // this.article.content = this.escapeStringHTML(res.data.data.content)
      })
    },
    // 转码 把实体格式字符串转义成HTML格式的字符串
    // escapeStringHTML (str) {
    //   str = str.replace(/&lt;/g, '<')
    //   str = str.replace(/&gt;/g, '>')
    //   return str
    // },
    // 如果仅传了index作为参数，事件参数url就没了 已经通过v-model进行重写
    // onUpdateCover (index, url) {
    //   this.article.cover.images[index] = url
    // }
  }
}
</script>

<style scoped lang="less">
// .img-content{
// display: flex;
// justify-content: start;
// }
.editor_wrap {
  height: 200px;
}

.nothing {
  height: 70px;
}
.cover-select{
  display:flex;
  justify-content: flex-start;
}
</style>
