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
      <div class="blog-user"><h4>课程: {{ blog.courseName }}</h4></div>
      <div class="blog-user"><h4>任课教师: {{ blog.teacher }}</h4></div>
      <div class="blog-user"><h4>任务描述：{{blog.content}}</h4></div>
      <div class="blog-content-container">
        <div class="blog-content">
          <div class="markdown-body">
            <VueMarkdown :source="value" v-highlight></VueMarkdown>
          </div>
        </div>
      </div>
    </div>
    <div class="comment-container">
      <div class="comment-input">
        <!-- <quill-editor ref="text" v-model="com.content" class="myQuillEditor" /> -->
        <!-- <vue-simplemde v-model="com.content" ref="markdownEditor" /> -->
        <mavon-editor v-model="com.content" @imgAdd="handleImageAdd"/>
      </div>
      <button class="button" @click="send">评论</button>
      <div class="comment-output">
        <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
          <el-table-column align="center" label="用户ID" width="95">
            <template slot-scope="scope">
              {{ scope.row.userId }}
            </template>
          </el-table-column>
          <el-table-column label="评论内容">
            <template slot-scope="scope">
              <VueMarkdown :source="scope.row.content" v-highlight></VueMarkdown>
            </template>
          </el-table-column>
          <el-table-column label="操作" >
              <template slot-scope="scope">
                <el-button  v-if="shouldShowButton(scope.row)" type="primary" icon="el-icon-delete" size="mini" style="margin-right: 10px;" @click="deleteRow(scope.row)"></el-button>
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
import { sendComment } from '@/api/form'
import vue from 'vue'
import 'github-markdown-css/github-markdown.css'
import {find, remove } from '@/api/form'
import store from '@/store'
import { parseTime } from '@/utils/index'
import { mapGetters } from 'vuex'



// 引入编辑器的样式
import VueMarkdown from 'vue-markdown'
import 'github-markdown-css/github-markdown.css';
import markdown from 'highlight.js/lib/languages/markdown'
const currentTime = parseTime(Date.now(), '{y}-{m}-{d} {h}:{i}:{s}')
export default {
  name: 'BlogShow',
  data() {
    return {
      value: "0",
      isClicked: false,
      isClicked1: false,
      list: [],
      listLoading: false,
      blog: {
        title: '讨论区',
        teacher: '',
        content: '',
        className: ''
      },
      homeworkId: this.$route.query.homeworkId,
      pp: {
        aid: vue.prototype.$userId,
        user_name: this.sname,
      },
      com:{
        content: '',
        userId: this.$store.state.user.userId,
        homeworkId: this.$route.query.homeworkId,
      },
      get: {
        id: this.$store.state.user.userId,
      },


    };
  },
  computed: {
    ...mapGetters([
      'sname'
    ])
  },
  components: {
    quillEditor,
    VueMarkdown, // 注入组件
    // mavonEditor
  },
  created() {
    this.fetchData()
    //console.log(vue.prototype.$articleID)
  },

  methods: {
    fetchData() {
      console.log(this.get.id)
      if (this.get.id == '0' || this.get.id == undefined) {
        this.blog.title = '作业讨论区'
        this.blog.author = ''
        this.blog.content = ''
      } else {
        find({homeworkId:this.homeworkId}).then(response => {
          const {status} = response
          if(status){
            this.value = response.description
            let data = response.data[0]
            // console.log(data)
            this.list = data.comments
            this.blog.teacher = data.teacherName
            this.blog.courseName = data.courseName
            this.blog.content = data.homeworkDes

            // this.list = data.comments.map(item => {
            //   const div = document.createElement('div');
            //   div.innerHTML = item.content;
            //   // 将换行符替换为 <br>
            //   div.innerHTML = div.innerHTML.replace(/\n/g, '<br>');
            //   item.content = div.textContent || div.innerText;
            //   return item;
            // });

            console.log(this.list)
          }else{
            const {description} = response
            this.$message.error(description);
          }
        })
      }
    },

    // handleImageAdd(pos, $file) {
    //   // 在这里处理图片文件
    //   // pos 是图片添加的位置，$file 是图片文件对象
    //   console.log('here')
    //   console.log('pos',pos)
    //   console.log('file', $file)
    // },

    send() {
      if (this.isFormComplete() && this.ishaveComplete()) {
        this.$message.error('信息不全')
        return
      }
      // const TurndownService = require('turndown');
      // const turndownService = new Turndown();
      // const markdownString = turndownService.turndown(this.com.content);
      sendComment({homeworkId:this.homeworkId, userId:this.com.userId, content:this.com.content}).then(response => {
        // 处理成功的响应
        const{status} = response
        if(status){
          this.$message({message:'评论成功!',type:'success'})
          this.fetchData()
          this.com.content = ''
        }else{
          const{description} = response
          this.$message.error(description)
        }
      }).catch(error => {
        // 处理错误的响应
        this.$message.error('评论失败')
      })
    },

    isFormComplete() {
      console.log(this.com.content != undefined)
      return this.com.content != undefined
    },
    ishaveComplete() {
      console.log('here', this.$store.state.user.userId != undefined)
      return vue.prototype.$userId != undefined
    },

    deleteRow(row){
      let promise = remove({commentId:row.commentId})
      promise.then((res)=>{
        const{status} = res
        if(status){
          this.$message({
            message:'删除成功!',
            type: 'success'
          })
          this.fetchData()
        }else{
          const{description} = res
          this.$message.error(description)
        }
      })
    },
    shouldShowButton(row){
      return row.userId == this.com.userId
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
  background-image: url(../../../../assets/background/pp.jpg);
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
  display: inline-block;
}

.clicked {
  display: inline-block;
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
  @import '~simplemde/dist/simplemde.min.css';
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