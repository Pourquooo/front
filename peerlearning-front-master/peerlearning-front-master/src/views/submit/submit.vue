<template>
  <el-container style="border: 1px solid #eee">
        <el-submenu v-for="(item, index) in  sidebarData" :key="index">
          <template slot="title">{{ item.title }}</template>
        </el-submenu>
    <el-container>

      <el-header style="text-align: left; font-size: 30px">
      </el-header>

      <el-main style="margin-left: 20px;">
        <div>
          <!-- <p>作业内容: {{ content }}</p> -->
          <!-- <p>答案预览：{{ PAnswer }}</p> -->
        <div>

        <el-card class="box-card">
          <h1>{{ homeworkDes }}</h1>
          <p>作业号: {{ homeworkId }}</p>
          <p>学生号: {{ studentId }}</p> 
          <p>当前状态: {{ nowStatus }}</p>
        </el-card>

        <div style="margin-left: 20px;">
          <div v-for="(question, index) in questions" :key="index">
            <el-divider></el-divider>
            <h3>第{{ index + 1 }}题</h3>
            <p>{{ question.content }} ({{ question.gradeScope }}分)</p>

            <div>
            <el-input v-model="txtAns[index]" placeholder="请输入题目答案" ></el-input>
            <!-- 文件输入框 -->
            <br><br><input type="file" :ref="`fileInput_${index}`" @change="handleFileChange($event, index)" />
            <!-- 上传按钮 -->
            <el-button @click="submitAnswer(index)">保存答案</el-button>
            <!-- 显示上传成功的 URL -->
            <div v-if="eachAns[index]">
              <p>保存成功！答案: {{txtAns[index]}} {{ uploadedUrls[index] }}</p>
            </div>
          </div>

          </div>
        </div>

        <el-divider></el-divider>


        <div style="margin-left: 20px;">
          <div v-if="stuAnswer.length > 0">
            <p>答案预览：</p>
            <ul>
              <div v-for="(question, index) in questions" :key="index">
                <p>第{{ index + 1 }}题: {{txtAns[index]}} {{ uploadedUrls[index] }}</p>
              </div>
            </ul>
          </div>
        </div> 

        </div>

          <div style="margin: 20px; font-size: 15px;" >
            <el-button type="primary" @click="handleSubmit(nowStatus)">提交</el-button>  
          </div>

        </div>
      </el-main>

    </el-container>
          
  </el-container>


  
</template>

<style>
.el-header {
  background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}

.input-style {
  background: transparent;
  color: white;
  width: 600px;
  height: 40px;
  transition: border-color 0.3s;
  border: 1px solid white;
  border-radius: 8px;
}

.text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 480px;
  }
</style>

<script>
  import { getHomeworkInfo } from '@/api/student';
  import { submitHomework } from '@/api/student';
  import { uploadImage } from '@/utils/uploadImage.js';

  export default {
    data() {
        return {
          txtAns: [],
          questions: [],
          gradeScope: '',
          answerForCurrentQuestion: '',
          eachAns: [],// 用于存储每一题连接好的数组
          prevIndex: null, // 用于存储上一个 index
          answer: [], // 存储每个题目的图片 URL 的数组
          fileNames: [], // 每题文件名数组
          uploadedUrls: [], // 每题上传成功的 URL 数组
          stuAnswer: [],
          uploadedUrl: '', // 上传成功后的 URL
          fileName: '',   // 文件名
          blobData: null,  // Blob 数据
          imageUrls: [],
          PAnswer: '' ,
          dialogImageUrl: '',
          dialogVisible: false,
          disabled: false,
          user:this.$store.state.user,
          studentId:'',
          homeworkId: null,
          nowStatus: null,
          homeworkDes: null,
          content: '111',
          answerId: '',
          answer: '',
          input: '',
          activeNames: ['1'],
          sidebarHeight: 0,
          defaultOpeneds: [], // 设置默认展开的项
        };
      },

      mounted() {
        this.showHomework();
        this.homeworkId = this.$route.query.homeworkId;
        this.nowStatus = this.$route.query.nowStatus;
        this.studentId = this.$store.state.user.userId;
        console.log(this.questions);
        this.setSidebarHeight();
        // 监听窗口大小变化
        window.addEventListener('resize', this.setSidebarHeight);
      },
    beforeDestroy() {
    // 在组件销毁前移除窗口大小变化的监听器
    window.removeEventListener('resize', this.setSidebarHeight);
  },

  methods: {
    
    showHomework() {
      let promise = getHomeworkInfo({ homeworkId: this.$route.query.homeworkId });
      promise.then((response) => {
        const { status, description, data } = response;
        console.log(response)
        if (status) {
          this.homeworkId = data[0].homeworkId;
          this.homeworkDes = data[0].homeworkDes;
          const contents = (data[0].content || '').split('￥！');
          const gradeScope = (data[0].gradeScope || '').split('￥！');
          this.questions = contents.map((content, index) => ({
                        content,
                        gradeScope: gradeScope[index]
                    }));
        } else {
          alert(description);
        }
      });
    },

    handleFileChange(event, index) {
      // 文件输入框的变化事件处理函数
      const fileInput = this.$refs[`fileInput_${index}`][0];
      const file = fileInput.files[0]; // 获取文件对象

      // 设置文件名和 Blob 数据到组件的 data 中
      this.fileName = file.name;
      this.blobData = file;
    },

    submitAnswer(index) {
       // 检查当前 index 是否与上一个 index 相同
      if (index !== this.prevIndex) {
        // 如果不同，初始化 stuAnswer 为一个新的空数组
        this.stuAnswer = [];
      }

      const textAnswer = this.txtAns[index]; // 获取文本答案
      console.log(`txtAns[${index}]: ${this.txtAns[index]}`);

      // 如果stuAnswer为空，txtAns[index]不为空，则直接使用txtAns[index]
      if (!this.blobData || !this.blobData.name) {
        this.$set(this.eachAns, index, this.txtAns[index]);
        console.log(`eachAns[${index}]: ${this.eachAns[index]}`);
      }else{
          // 调用上传方法
      uploadImage({ fileName: this.blobData.name, blob: this.blobData })
        .then(url => {
          console.log(`上传成功，题目${index + 1}，文件: ${url}`);
          // 将上传成功的 URL 存储在对应的数组中
          this.stuAnswer.push(url);
          this.uploadedUrls[index]=this.stuAnswer;
          console.log("stuAnswer:", this.stuAnswer);
          console.log(`uploadedUrls[${index}]: ${this.uploadedUrls[index]}` );
          const answerForCurrentQuestion = this.stuAnswer.join('￥？');
          //将拼接的结果存储在 eachAns 数组中
          this.$set(this.eachAns, index, answerForCurrentQuestion);
          console.log(`eachAns[${index}]: ${this.eachAns[index]}`);

          if (this.stuAnswer.length > 0 && textAnswer) {
              const combinedAnswer = `${textAnswer}￥？${answerForCurrentQuestion}`;
              this.$set(this.eachAns, index, combinedAnswer);
            }
          // } else if (this.txtAns[index] == 'undefined'||txtAns[index] == '') {
          //     this.$set(this.eachAns, index, answerForCurrentQuestion);
          // } else if (answerForCurrentQuestion == 'undefined'||stuAnswer == '') {
          //     this.$set(this.eachAns, index, textAnswer);
          // }

          console.log(`eachAns[${index}]: ${this.eachAns[index]}`);

          this.prevIndex = index;
        })
        .catch(error => {
          // 上传失败，处理错误
          console.error(`上传失败123456，题目${index + 1}，错误: ${error}`);
        });

        console.log(`eachAns[${index}]: ${this.eachAns[index]}`);

      }
    },

    setSidebarHeight() {
      // 获取窗口的视口高度
      const windowHeight = window.innerHeight;

      // 设置侧边栏的高度
      this.sidebarHeight = windowHeight;
      this.$refs.sidebar.style.height = `${windowHeight}px`;
    },
  
    handleSubmit(nowStatus){
      if (nowStatus === '已结束') {
        this.$message.warning('该作业已截止');
      } else {
        this.submitHomework();
      }  
    },

    submitHomework() {
      // 使用￥！将不同题目的答案连接起来
      this.PAnswer = this.eachAns.join('￥！');
      console.log(`PAnswer:${this.PAnswer}`);

      const data = {
            studentId: this.studentId,
            homeworkId: this.homeworkId,
            answer: this.PAnswer,
            answerId : this.answerId
          };

      let promise = submitHomework(data);
      promise.then((res) => {
        const { status } = res;
        if (status) {
          this.$confirm('提交成功', '提示', {
                    confirmButtonText: '确定',
                    callback: () => {
                        this.PAnswer = ''; 
                        this.answer = '';
                        this.imageUrls = [];
                        this.uploadedUrl= ''; // 上传成功后的 URL
                        // this.$router.push('submit/index');
                        this.$router.push({ path: 'submit/index', query: { homeworkId: this.homeworkId, nowStatus: '已提交' } });
                }
                });
                
        } else {
          
          this.$alert('提交失败', '提示', {
            confirmButtonText: '确定',
            callback: () => {
                        this.PAnswer = ''; 
                        this.answer = '';
                        this.imageUrls = [];
                }
          });
        }
      });
    },

  }
  };
</script>


<style scoped>
.custom-aside {
  width: 200px;
  /* 固定宽度 */
  height: 100vh;
  /* 适应屏幕高度 */
  overflow-y: auto;
  /* 添加滚动条，以防内容过长 */
}

  .headBold .ant-table-header-column {
  font-weight: bold;   
}


</style>