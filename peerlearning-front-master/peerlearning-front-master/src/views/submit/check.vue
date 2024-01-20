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

          <div>
  
          <el-card class="box-card">
            <h1>{{ homeworkDes }}</h1>
            <p>学生号: {{ studentId }}</p> 
            <p>课程号: {{ courseId }}</p> 
            <p>作业号: {{ homeworkId }}</p>
            <p>答案号：{{ answerId }}</p>

          </el-card>

          <div v-for="(question, index) in questions" :key="index">
            <el-divider></el-divider>
            <h3>第{{ index + 1 }}题</h3>
            <p>题目：{{ question.content }} ({{ question.gradeScope }}分)</p>
            <p>我的答案:</p>

            <div class="answer-container">
                <!-- 判断答案类型 -->
              <div v-if="isText(question.studentAnswer)">
                {{question.studentAnswer}}
                <!-- 显示学生的文字答案 -->
              </div>
              <div v-else>
                <!-- 显示学生的图片答案 -->
                <div v-for="(part, i) in question.studentAnswer.split('￥？')" :key="i">
                  <!-- 判断每个部分是文本还是图片 -->
                  <div v-if="isText(part)">
                    <p>{{ part }}</p>
                  </div>
                  <div v-else>
                    <img :src="part" alt="我的答案">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <el-divider></el-divider>
  
          </div>
  
            <div style="margin: 20px; font-size: 15px;" >
                <el-button @click="handleClickSubmit(homeworkId, nowStatus)" type="text">修改</el-button>
            </div>
  
          </div>
        </el-main>
  
      </el-container>
            
    </el-container>
  
  </template>
  
  
  <script>
    import { getHomeworkInfo } from '@/api/student';
    import { getHomeworksByCourse } from '@/api/record';
    import { getHomeworkScore } from '@/api/record';
  
    export default {
      data() {
          return {
            user: {
              userId: this.$store.state.user.userId
            },
            nowStatus :'',
            answerId : null,
            selectedAnswerId: null,
            homework: [],
            stuAnswer: [],
            studentId: '',
            homeworkId: null,
            homeworkDes: null,
            gradeScope: '',
            content: '111',
            activeNames: ['1'],
            sidebarHeight: 0,
            defaultOpeneds: [],
            questions: [],
        };
        },
  
        mounted() {
            this.courseId = this.$route.query.courseId;
            this.studentId = this.$store.state.user.userId;
            this.nowStatus = this.$route.query.nowStatus;
            this.answerId = this.$route.query.answerId;
            this.homeworkId = this.$route.query.homeworkId; 
            this.showHomework();
            this.fetchAnswer(this.answerId)
            this.getHomeworks(this.courseId, this.homeworkId);
            this.setSidebarHeight();
            window.addEventListener('resize', this.setSidebarHeight);
            },

    beforeDestroy() {
    // 在组件销毁前移除窗口大小变化的监听器
    window.removeEventListener('resize', this.setSidebarHeight);
    },
  
    methods: {
      handleFileChange(event) {
        // 文件输入框的变化事件处理函数
        const fileInput = this.$refs.fileInput;
        const file = fileInput.files[0]; // 获取文件对象
  
        // 设置文件名和 Blob 数据到组件的 data 中
        this.fileName = file.name;
        this.blobData = file;
      },

      getHomeworks(courseId, selectedHomeworkId) {
        // 根据课程 ID 获取对应课程的作业信息
        getHomeworksByCourse({ "courseId": courseId, "studentId": this.user.userId })
            .then((res) => {
            const { status } = res;
            if (status) {
                const { data } = res;
                const selectedHomework = data[0].homeworks.find(homework => homework.homeworkId === selectedHomeworkId);
                if (selectedHomework) {
                this.selectedAnswerId = selectedHomework.answerId;
                this.answerId = this.selectedAnswerId;
                this.fetchAnswer(this.answerId);
                } else {
                console.error(`Homework with ID ${selectedHomeworkId} not found.`);
                }
            }
            })
            .catch(error => {
            console.error('Error fetching homeworks:', error);
            });
        },


      handleClickSubmit(homeworkId, nowStatus) {
        if (nowStatus === '已结束') {
            this.$message.warning('该作业已截止');
        } else {
            this.$router.push({ path: '/submit', query: { homeworkId, nowStatus } });
        }  
    },
  
      setSidebarHeight() {
        // 获取窗口的视口高度
        const windowHeight = window.innerHeight;
  
        // 设置侧边栏的高度
        this.sidebarHeight = windowHeight;
        this.$refs.sidebar.style.height = `${windowHeight}px`;
      },
  
      handleRemove(file) {
          console.log(file);
      },
  
        handleDownload(file) {
          console.log(file);
      },
     
      showHomework() {
        let promise = getHomeworkInfo({ homeworkId: this.$route.query.homeworkId });
        promise.then((response) => {
          const { status, description, data } = response;
          console.log(response)
          if (status) {
            this.homeworkId = data[0].homeworkId;
            this.homeworkDes = data[0].homeworkDes;
            const contents = (data[0].homeworkData.content || '').split('￥！');
            const gradeScope = (data[0].homeworkData.gradeScope || '').split('￥！');
            this.questions = contents.map((content, index) => ({
                        content,
                        gradeScope: gradeScope[index]
                    }));
          } else {
            alert(description);
          }
        });
      },

      fetchAnswer(answerId){
            getHomeworkScore({"answerId": answerId})
            .then((res) => {
                const { status, data } = res;
                if (status) {
                    const commentsData = data[0].comments.split('\n');
                    this.comments = commentsData.map(comment => {
                        // 清除 HTML 标签，仅获取纯文本内容
                        const cleanComment = comment.replace(/<\/?[^>]+(>|$)/g, '');
                        return cleanComment.trim(); // 去除首尾空格
                    }).filter(comment => comment !== '');

                    const stdAnswers = (data[0].homeworkData.stdAns || '').split('￥！');
                    const finalScores = (data[0].answerData.finalScore[0] || '').split('￥！');
                    const contents = (data[0].homeworkData.content || '').split('￥！');
                    const gradeScope = (data[0].homeworkData.gradeScope || '').split('￥！');
                    const studentAnswers = (data[0].answerData.answer || '').split('￥！');


                    this.questions = contents.map((content, index) => ({
                        content,
                        gradeScope: gradeScope[index],
                        studentAnswer: studentAnswers[index] || '暂无', 
                        standardAnswer: stdAnswers[index] || '暂无', 
                        everyScore: finalScores[index] || '暂无', 
                        
                    }));

                    console.log('stdAnswers:', stdAnswers);
                    console.log('finalScores:', finalScores);
                    console.log('contents:', contents);
                    console.log('studentAnswers:', studentAnswers);

                } else {
                    console.error('Failed to fetch homework score');
                }
            })
            .catch((error) => {
                console.error('Error fetching homework score:', error);
            });
        },

        isText(answer) {
            // 在实际应用中，你可能需要根据答案的特征来判断是文字还是图片
            // 这里只是一个简单的示例，你可能需要根据实际情况进行调整
            return !answer.includes('http://qn.gxc111.top');
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
  
  <style>
  .answer-container {
    border: 2px solid rgba(178, 191, 199, 0.599);
    padding: 10px; /* 添加一些内边距，使边框更美观 */
    margin-bottom: 10px; /* 添加一些外边距，使每个答案之间有间距 */
  }

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
  