<template>
  <div>
    <div ref="vantaRef" class="background-container"></div>
    <div>
      <el-container >
          <el-header style="text-align: right; font-size: 12px display: flex;">
            <div style="float:left;">我的课程</div>
            <div>任务时间：{{ tableData.startTime }}--{{ tableData.endTime }}</div>
          </el-header>
      <el-container>

        <el-aside class="custom-aside" ref="sidebar">
          <el-menu :default-openeds="defaultOpeneds" style="background-color: rgba(255, 255, 255, 0);">
            <el-submenu v-for="(items, courseName, index) in  sidebarData" :key="courseName" :index="String(index)"
              @click="changeShow()" style="background-color: rgba(255, 255, 255, 0);">
              <template slot="title">{{ courseName }}</template>
              <el-menu-item v-for="(item, index) in items" :key="item.assignmentId" :index="String(index)"
                @click="handleMenuItemClick(item.assignmentId, item.isFinished)" style="background-color: rgba(255, 255, 255, 0);">
                任务{{ index + 1 }} ({{ isfinished(item.isFinished) }})
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>

        <el-main class="question-answer-list">
          <div >
            <div v-for="(items, index) in tableData.questions" :key="index" class="question-answer-item">
              <div>
                <div class="question-box" >
                  <div class="line" style="margin-top: 10px; margin-bottom: 5px;"/>
                  <span ><h4>{{ '第' + (index + 1) + '题' }}</h4></span>
                  <span>{{ items.content }}</span>

                  <div>
                      <span><h4>参考答案:</h4></span>
                      <div v-for="(value, subIndex) in tableData.stdans[index].content" :key="subIndex" style="margin-bottom: 5px;">
                          <span v-if="!isUrl(value.content)">{{ value.content }}</span>
                          <img v-else :src="value.content" alt="答案图片" style="object-fit: contain; width: 80%; height: 200px;">
                      </div>
                  </div>
                  <div class="answer-box" style="margin-bottom: 5px" >
                    <div>
                      <span><h4>回答:</h4></span>
                    </div>
                    <div v-for="(value, subIndex) in tableData.answers[index].content" :key="subIndex" style="margin-bottom: 5px;">
                        <span v-if="!isUrl(value.content)">{{ value.content }}</span>
                        <img v-else :src="value.content" alt="答案图片" style="object-fit: contain; width: 80%; height: 200px;">
                    </div>
                    <input v-model="tableData.answers[index].score" type="number" :max="items.greatScore" min="0"  placeholder="请输入分数" style="float: right; margin-left: auto; margin-right: auto; text-align: center; width: 100px" >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <span v-if="show" style="margin-bottom: 5px; text-align: right;">总分：{{ totalScore }}</span>
          <div v-if="this.show" style="margin-top: 10px;">
            <quill-editor v-model="comments" :options="editorOption"></quill-editor>
            <button @click="uploadInformation" style="display:block;margin:0 auto;margin-top: 5px;">批改完成</button>
          </div>
        </el-main>


      </el-container>
    </el-container>
    </div>
  </div>
</template>
<style>
.el-header {
  background-color: rgba(179, 192, 209, 0); /* 使用 rgba 表示法设置透明度，最后一个参数为透明度值，取值范围 0 到 1 */
  color: #333;
  line-height: 60px;
  text-align: center; /* 让文字居中 */
  font-weight: bold; /* 加粗文字 */
}
</style>


<script>
import { getAssignments, getAssignment } from '@/api/assignment';
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import Quill from 'quill';
import { setAssignment } from '@/api/assignment';
import Router from 'vue-router';

import * as THREE from 'three'
// import BIRDS from 'vanta/src/vanta.birds'
// import Topology from "vanta/src/vanta.topology";
import Fog from "vanta/src/vanta.fog"
export default {
  data() {
    return {
      router: Router,
      show: false,
      score: 0,
      canCheck: true,
      comments:'',
      assignmentId: '',
      sidebarHeight: 0,
      defaultOpeneds: [], // 设置默认展开的项
      user: this.$store.state.user,
       editorOption: {          //对富文本编辑器的修改
        placeholder: '请输入评论',
        theme: 'snow',
        // 其他选项...
      },
      tableData: {},
      sidebarData: []  // 数据源，根据实际情况替换为您的数据
    };
  },
  computed: {
    totalScore() {
      if (this.tableData.answers) {
        this.score = this.tableData.answers.reduce((sum, answer) => Number(sum) + (Number(answer.score) || 0), 0);
        return this.score
      } else {
        return 0; // 如果 answers 不存在或不是数组，返回默认值 0
      }
    }
  },
  components: {
    quillEditor // 富文本编辑器
  },
  mounted() {
    // 监听窗口大小变化
    window.addEventListener('resize', this.setSidebarHeight);
    // this.setSidebarHeight();
    this.upgrateAssignment();
    this.initializeEditor();
    this.vantaEffect = Fog({
      el: this.$refs.vantaRef,
      THREE: THREE
    })

     this.vantaEffect.setOptions({
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      highlightColor: 0xffffff,
      midtoneColor: 0x8b8484,
      lowlightColor: 0xa9a9a9,
      baseColor: 0xd9caca
    })
  },

  // backgroundColor: 0xbed5e7,

  beforeDestroy() {
    // 在组件销毁前移除窗口大小变化的监听器
    window.removeEventListener('resize', this.setSidebarHeight);
    if (this.vantaEffect) {
      this.vantaEffect.destroy()
    }
  },
  methods: {
    initializeEditor() {
      this.editor = new Quill('#editor-container', {
        theme: 'snow' // 使用 snow 主题，即默认主题
      });
    },
    changeShow() {
      this.show = false;
    },
    // setSidebarHeight() {
    //   // 获取窗口的视口高度
    //   const windowHeight = window.innerHeight;

    //   // 设置侧边栏的高度
    //   this.sidebarHeight = windowHeight;

    //   this.$nextTick(() => {
    //     const sidebar = this.$refs.sidebar;
    //     if (sidebar) {
    //       sidebar.style.height = `${windowHeight}px`;
    //     }
    //   });
    // },

    upgrateAssignment() {
      let promise = getAssignments({ "studentId": this.user.userId })
      promise.then((data) => {
        const { status } = data
        if (status) {
          const data_1 = data.data

          // 使用 reduce 方法将数据按照 courseName 分组
          this.sidebarData = data_1[0].reduce((result, item) => {
            const courseName = item.courseName;
            if (!result[courseName]) {
              result[courseName] = [];
            }
            result[courseName].push(item);
            return result;
          }, {});
          // console.log(this.sidebarData)
        } else {
          const {description} = data
          alert(description)
        }
      })
    },

    handleMenuItemClick(Id, isFinished) {
      this.canCheck = isFinished == 1?false:true;
      this.comments = '';
      this.assignmentId = Id
      // 发起后端请求，并将 assignmentId 作为参数传递
      let promise = getAssignment({ 'assignmentId': Id });
      promise.then((res) => {
        const { status } = res;
        if (status) {
          this.show = true;
          // console.log(res.data)
          const rawData = res.data[0];
          // 处理数据
          const processedData =
          {
            startTime: rawData[0].startTime,
            endTime: rawData[0].endTime,
            comments: rawData[0].comments,
            questions: Object.entries(rawData[0].homeworkDetails).map(([key, value]) => ({ id: key, content: value })),
            answers: Object.entries(rawData[0].answerDetails).map(([key, value]) => ({ id: key, content: value })),
            stdans: []
          };
          const str = processedData["questions"][0]['content']
          console.log(processedData["questions"])
          const str_scores = processedData["questions"][1]['content']
          const stdAns = processedData["questions"][2]['content']
          console.log('stdans',stdAns)
          const scores = str_scores.split("￥！")
          processedData["answers"] = processedData['answers'][0]['content'].split('￥！').map((value, index) => ({id: index, content: value.split('￥？').map((value, index)=>({id: index, content: value})), score:''}))
          processedData["stdans"] = stdAns.split("￥！").map((value, index) => ({ id: index, content: value.split('￥？').map((value, index) => ({ id: index, content: value }))}))
          processedData["questions"] = str.split("￥！").map((value, index) => ({ id: index, content: value , greatScore: scores[index]}))
          // 将处理后的数据赋值给tableData
          console.log("here", processedData['stdans'])
          console.log("there", processedData["answers"])
          this.tableData = processedData;
          console.log(this.tableData)
        }
      })

    },
    isUrl(string) {
      try {
        new URL(string);
        return true;
      } catch (err) {
        return false;
      }
    },
    uploadInformation(){
      //上传批改信息
      if(!this.canCheck){
        alert('已完成批改，不可重复提交')
      }else{
        // 检查是否每个题目都有分数
        const allAnswered = this.tableData.answers.every(answer => answer.score !== undefined && answer.score !== null && answer.score !== '');

        if(allAnswered){
          const allScores = this.tableData.answers.map(answer => answer.score.toString());
          const scoresString = allScores.join('￥！');
          console.log("scoreString", scoresString)
          let promise = setAssignment({ 'grade': scoresString, 'assignmentId': this.assignmentId, 'comments': this.comments })
          console.log({ 'grade': this.totalScore, 'assignmentId': this.assignmentId, 'comments': this.comments })
          promise.then((res) => {
            const { status } = res;
            if (status) {
              alert('提交成功')
            } else {
              const { description } = res;
              alert(description)
            }
          })

        }else{
          alert("请先批改完所有题目")
        }
      }
    },
    isfinished(id) {
      if (id == 1){
         return "已完成"
      }
      return "未完成"
    }
  },
  modules:{
     // 配置工具栏
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ header: 1 }, { header: 2 }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      ['image']
    ]
  },
  
};
</script>

<style scoped>
.custom-aside {
  width: 200px;
  /* 固定宽度 */
  height: 100%;
  /* 适应屏幕高度 */
  overflow-y: hidden;
  /* 添加滚动条，以防内容过长 */
  position: relative; /* 设置为相对定位 */
  background-color: rgba(238, 241, 246, 0); /* 设置背景颜色和透明度，这里透明度为 0.8 */
  margin-top: 0px; /* 下移 60px，根据需要调整下移距离 */

}
#editor-container {
  height: 300px;
}
.line{
  float:right;
  width: 100%;
  height: 1px;
  margin-top: -0.5em;
  background:#d4c4c4;
  position: relative;
  text-align: center;
}
.background-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: -1; /* 将背景置于最底层 */
  /* 如果有背景图片，可以这样设置：
  background: url('your-image-path.jpg') center center no-repeat;
  background-size: cover;
  */
}
.question-answer-list{
    height: 88vh;
    overflow-y: scroll;
}

</style>


