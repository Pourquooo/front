<template>
  <!--下载依赖 npm install --save vue-markdown
    npm install highlight.js
    npm install github-markdown-css
  -->
  <div class="container">
    <div class="container1">
      <vue-particles color="#eee" :particleOpacity="0.7" :particlesNumber="80" shapeType="circle" :particleSize="4"
        linesColor="#eee" :linesWidth="2" :lineLinked="true" :lineOpacity="0.4" :linesDistance="150" :moveSpeed="2"
        :hoverEffect="true" hoverMode="grab" :clickEffect="true" clickMode="push">
      </vue-particles>
    </div>
    <div class="blog-container">
      <div class="blog-title">{{ blog.title }}</div>
      <div class="blog-user">Author: {{ blog.author }}</div>
      <div class="blog-user">publish-time: {{ blog.time }}</div>
      <div class="blog-content-container">
        <div class="blog-content">
          <div class="markdown-body">
            <VueMarkdown :source="value" v-highlight></VueMarkdown>
          </div>
        </div>
      </div>
      <div class="button-container">
        <button class="button" @click="changeA" :class="{ clicked: isClicked }" :disabled="!ishaveComplete">{{
          this.change.xihuan }}</button>
        <button class="button" @click="changeB" :class="{ clicked: isClicked1 }" :disabled="!ishaveComplete">{{
          this.change.shoucang }}</button>
      </div>
    </div>
    <div class="comment-container">
      <div class="comment-input">
        <quill-editor ref="text" v-model="com.content" class="myQuillEditor" />
      </div>
      <button class="button" @click="send" :disabled="!isFormComplete || !ishaveComplete">评论</button>
      <div class="comment-output">
        <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
          <el-table-column align="center" label="ID" width="95">
            <template slot-scope="scope">
              {{ scope.row.user_name }}
            </template>
          </el-table-column>
          <el-table-column label="评论内容">
            <template slot-scope="scope">
              <VueMarkdown :source="scope.row.content" v-highlight></VueMarkdown>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { sendcomment } from '@/api/form'
import vue from 'vue'
import 'github-markdown-css/github-markdown.css'
import { add1, add2, remove1, remove2, find, findcom, add3,add4,remove5 } from '@/api/form'
import store from '@/store'
import { parseTime } from '@/utils/index'
import { mapGetters } from 'vuex'
import VueMarkdown from 'vue-markdown'
import { get } from 'js-cookie'

const currentTime = parseTime(Date.now(), '{y}-{m}-{d} {h}:{i}:{s}')
export default {
  name: 'BlogShow',
  data () {
    return {
      isClicked: false,
      isClicked1: false,
      list: [],
      listLoading: false,
      blog: {
        title: '博客标题',
        author: '博客作者',
        content: '',
        time: ''
      },
      pp:{
         aid:vue.prototype.$articleID,
         user_name: this.sname,
      },
      form: {
        xihuan: 0,
        shoucang: 0,
      },
      com: {
        aid: vue.prototype.$articleID,
        content: '',
        publish_date: currentTime,
        user_name: this.sname,
        parent_id: ''
      },
      get: {
        id: vue.prototype.$articleID
      },
      change: {
        xihuan: '点赞',
        shoucang: '收藏',
      },

    };
  },
  computed: {
    isFormComplete () {
      return this.com.content
    },
    ishaveComplete () {
      console.log(vue.prototype.$articleID)
      return vue.prototype.$articleID != undefined
    },
    ...mapGetters([
      'sname'
    ])
  },
  components: {
    quillEditor,
    VueMarkdown // 注入组件
  },
  created () {
    this.fetchData()
    //console.log(vue.prototype.$articleID)
  },

  methods: {
    fetchData () {
      if (this.get.id == '0' || this.get.id == undefined)
      {
        this.blog.title = '暂无博客内容'
        this.blog.author = ''
        this.blog.content = ''
      } else
      {
        find(this.get.id).then(response => {
          add3(this.get).then(response => { }).catch(error => { })
          this.blog.title = response.data["title"]
          //console.log(response.data["title"])
          if (response.data["whetherNiming"] == 1)
          {
            this.blog.author = '匿名作者'
          } else
          {
            this.blog.author = response.data["user_name"]
          }
          this.value = response.data["md_content"]
          this.blog.content = response.data["md_content"]
          this.blog.time = response.data["publish_date"]
          //评论区的布局估计需要处理
        })
        findcom(this.get.id).then(response => {
          console.log(response.data)
          this.list = Array.from(response.data)
          this.listLoading = false
        })
      }
    },
    changeA () {
      if (this.change.xihuan == '点赞')
      {
        // this.change.xihuan = '已点赞'
        // this.isClicked = true;
        this.form.xihuan = 1;
        add1(this.get).then(response => {
          // 处理成功的响应
          this.change.xihuan = '已点赞'
          this.isClicked = true;
          this.$message('点赞成功!')
          this.form.xihuan = 0;
        }).catch(error => {
          // 处理错误的响应
          this.$message.error('点赞失败')
          this.form.xihuan = 0;
        })
      }
      else if (this.change.xihuan == '已点赞')
      {
        // this.change.xihuan = '点赞'
        // this.isClicked = false;
        this.form.xihuan = -1;
        remove1(this.get).then(response => {
          // 处理成功的响应
          this.change.xihuan = '点赞'
          this.isClicked = false;
          this.$message('取消点赞成功!')
          this.form.xihuan = 0;
        }).catch(error => {
          // 处理错误的响应
          this.$message.error('取消点赞失败')
          this.form.xihuan = 0;
        })
      }

    },
    changeB () {
      if(store.getters.enable==3){
        this.$message.error('揽客无法收藏')
        return;
      }
      if (this.change.shoucang == '收藏')
      {
        // this.change.xihuan = '已点赞'
        // this.isClicked = true;
        this.form.shoucang = 1;
        add2(this.get).then(response => {
          // 处理成功的响应
          this.change.shoucang = '已收藏'
          this.isClicked1 = true;
          this.$message('收藏成功!')
          add4(this.pp).then(response => { }).catch(error => { })
          this.form.shoucang = 0;
        }).catch(error => {
          // 处理错误的响应
          this.$message.error('收藏失败')
          this.form.shoucang = 0;
        })
      }
      else if (this.change.shoucang == '已收藏')
      {
        // this.change.xihuan = '点赞'
        // this.isClicked = false;
        this.form.shoucang = -1;
        remove2(this.get).then(response => {
          // 处理成功的响应
          this.change.shoucang = '收藏'
          this.isClicked1 = false;
          this.$message('取消收藏成功!')
          remove5(this.pp).then(response => { }).catch(error => { })
          this.form.shoucang = 0;
        }).catch(error => {
          // 处理错误的响应
          this.$message.error('取消收藏失败')
          this.form.shoucang = 0;
        })
      }
    },
    send () {
     
      if (this.com.aid == '0')
      {
        this.$message.error('评论失败')
        return
      }
      this.com.user_name = this.sname
      this.com.user_name = this.sname
      console.log(this.com.user_name)
      sendcomment(this.com).then(response => {
        // 处理成功的响应
        this.$message('评论成功!')
        this.fetchData()
        this.com.content = ''
      }).catch(error => {
        // 处理错误的响应
        this.$message.error('评论失败')
      })
    }

  }
}

</script>

<style lang="scss" scoped>
.container {
  display: flex;
  // justify-content: center;
  flex-direction: column;
  /* 设置垂直方向布局 */
  height: auto;
  background-size: 100% 100%;
  background-image: url(../../assets/background/pp.jpg);
  // background-color: #000;
}

.container1 {
  height: 100px;
}


.blog-container {
  padding: 20px;
  background-color: rgb(255, 255, 255);
  width: 80%;
  //max-height: 700px;
  /* 设置最大高度 */
  height: auto;
  /* 自适应高度 */
  /* 设置固定宽度 */
  margin: 0px auto 0;
  position: relative;
  /* 居中显示 */
  border-radius: 10px;
}

.blog-container div {
  width: 100%;
  /* 内部<div>元素宽度为容器宽度 */
  word-wrap: break-word;
  /* 溢出时自动换行 */
}

.blog-content-container {
  //max-height: 500px;
  /* 设置最大高度 */
  height: auto;
  /* 自适应高度 */
  background-attachment: scroll;
  background-blend-mode: normal;
  background-clip: border-box;
  // background-color: rgb(255, 255, 255, 0.5);
  background-image: none;
  background-origin: padding-box;
  background-position: 0% 0%;
  background-repeat: repeat;
  background-size: auto;
  overflow: auto;
  margin: 0 auto 60px;
}

.blog-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.blog-user {
  font-size: 16px;
  color: #888;
  margin-bottom: 10px;
}

.blog-content {
  font-size: 18px;
  line-height: 1.5;
}

.button-container {
  position: absolute;
  width: 100%;
  bottom: 20px;
  right: 0;
  margin-bottom: 0px;
  border-top: 2px solid #888;
  padding-top: 10px;
  display: flex;
  justify-content: flex-end;
}

.button {
  play: inline-block;
  margin-right: 10px;
  padding: 8px 16px;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  width: 70px;
  height: 30px;
  background-color: lightgray;
  border: none;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;

}

.clicked {
  play: inline-block;
  margin-right: 10px;
  padding: 8px 16px;
  font-size: 10px;
  font-weight: bold;
  cursor: pointer;
  color: white;
  width: 70px;
  height: 30px;
  background-color: #555555;
  border: none;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
}

.comment-container {
  padding: 20px;
  // justify-content: center;
  flex-direction: column;
  display: flex;
  width: 80%;
  height: auto;
  background-color: rgb(255, 255, 255, 0.9);
  margin-top: 20px;
  margin: 10px auto 0;
  border-radius: 10px;

}

.comment-input {
  width: 100%;
  height: auto;
  margin-bottom: 10px;
  padding: 8px;
  font-size: 14px;
  border: 1px solid #000;
  border-radius: 4px;
}

.comment-output {
  width: 100%;
  height: 500px;
  margin-bottom: 10px;
  padding: 8px;
  font-size: 14px;
  border: 1px solid #000;
  margin: 10px auto 0;
  overflow: auto;
}

.particles {
  transform: scale(0.5);
}
</style>
