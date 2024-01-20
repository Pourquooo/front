<template>
  <el-container style="border: 1px solid #eee">
    <el-aside class="custom-aside" style="background-color: rgb(238, 241, 246)" ref="sidebar" width="170px">
      <el-menu>
        <el-menu-item v-for="course in sidebarData" :key="course.courseId" @click="showCoursePage(course)" :class="{ 'active': course.isActive }">
          {{ course.courseName }}
        </el-menu-item>
      </el-menu>
    </el-aside>

 <el-container>
  <el-header style="text-align: left; font-size: 12px;">
    <div style="display: flex; justify-content: space-between;">
      <h1 style="margin: 5px; font-weight: bold;">{{ selectedCourse.courseName }}</h1>
      <p style="text-align: right; margin: 0;">课程ID: {{ selectedCourse.courseId }}</p>
    </div>
  </el-header>

  <el-main>
      <el-divider></el-divider>

      <div style="margin: 20px; font-size: 15px;" >
        标题
        <el-input v-model="input1" placeholder="请输入内容" style="margin-top: 10px"></el-input>
      </div>

      <div style="margin: 20px; font-size: 15px;" >
      <p>作业提交时间</p>
        <el-date-picker
          v-model="value1"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
          </el-date-picker>     
      </div>

      <!-- 输入作业内容和答案 -->
      <div>
        <div style="margin: 20px; font-size: 15px;">
          <p style="margin-bottom: 20px">上传作业</p>
          <!-- 在 v-for 循环中为每个题目添加删除按钮 -->
          <div v-for="(item, index) in inputList" :key="index" class="input-container">
              <p style="margin-bottom: 20px">题目{{ index + 1 }}</p>
              <div class="input-row">
                  <el-input v-model="item.score" placeholder="请输入题目分数" class="input-item"></el-input>
                  <el-input v-model="item.content" placeholder="请输入题目内容" class="input-item"></el-input>
                  <el-input v-model="item.answer" placeholder="请输入题目答案" class="input-item"></el-input>
                  <!-- 添加删除按钮 -->
                  <el-button icon="el-icon-delete" @click="removeInput(index)" class="delete-button">删除题目</el-button>
              </div>
          </div>
          <el-button type="primary" icon="el-icon-plus" @click="addInput">新增题目</el-button>
        </div>
      </div>
      
      <el-divider></el-divider>


      <div style="margin: 20px; font-size: 15px;" >
        <el-button type="primary" @click="publishHomework">提交</el-button>  
      </div>

    </el-main>

</el-container>
</el-container>


</template>

<script>
import { getTeaching } from '@/api/teacher';
import { addHomework } from '@/api/homework';

export default {
data() {
  return {
    user:this.$store.state.user,
    inputList: [], // 存储题目输入框的列表
    radio: 3,
    value1: [new Date(2023, 10, 10, 0, 0), new Date(2023, 10, 11, 0, 0)],
    value2: '',
    input1: '',//标题
    input3: '',//答案
    activeNames: ['1'],
    sidebarHeight: 0,
    defaultOpeneds: [], // 设置默认展开的项
    sidebarData: [  // 数据源，根据实际情况替换为您的数据
    ],
    dialogImageUrl: '',
    dialogVisible: false,
    disabled: false,

    formData: {
    teacherId : '123',
    content: '',
    courseId: '123',
    startTime: '',
    endTime: '',
    standAns: '',
    gradeScope: '',
    homeworkDes : '',
    },

    user: {
      userId: this.$store.state.user.userId // 设置用户ID，替换为实际的用户ID
    },
    sidebarData: [],
    selectedCourse: {}
  };
},

computed: {
    content() {
    return this.inputList.map(item => item.content).join('￥！');
    },

    standAns() {
    return this.inputList.map(item => item.answer).join('￥！');
    },

    gradeScope() {
    return this.inputList.map(item => item.score).join('￥！');
    }

},

methods: {
    removeInput(index) {
      this.inputList.splice(index, 1); // 从 inputList 数组中移除指定索引的题目
    },
    
    addInput() {
    const index = this.inputList.length + 1; // 计算题目序号
    this.inputList.push({ content: '', answer: '', score: '' }); // 添加题目和答案的输入框
    console.log(`第${index}题`);
    },

    handleRemove(file) {
        console.log(file);
    },
    handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
    },
    handleDownload(file) {
        console.log(file);
    },

    handleChange(val) {
        console.log(val);
        },

    setSidebarHeight() {
        // 获取窗口的视口高度
        const windowHeight = window.innerHeight;

        // 设置侧边栏的高度
        this.sidebarHeight = windowHeight;
        // this.$refs.sidebar.style.height = `${windowHeight}px`;
    },

    showCoursePage(course) {
        // 处理点击事件，更新isActive属性
        course.isActive = true;
        // 其他处理逻辑
    },

    publishHomework() {
      if (
            this.inputList.some(item => item.score === '' || item.content === '' || item.answer === '') ||
            this.input1 === ''
        ) {
            this.$message.warning('请输入完整的作业信息');
            return;
        }
        
        this.formData.startTime = this.value1[0] || '';
        this.formData.endTime = this.value1[1] || '';
        this.formData.content = this.content ;
        this.formData.homeworkDes = this.input1 ;
        this.formData.standAns = this.standAns ;
        this.formData.gradeScope = this.gradeScope ;
        this.formData.courseId = this.selectedCourse.courseId;
        this.formData.teacherId = this.$store.state.user.userId ;

        // if (this.formData.gradeScope == '' || this.formData.standAns == '' || this.formData.content == '') {
        //     console.error('请输入完整的作业及答案信息');
        //     this.$message.warning('请输入完整的作业及答案信息');
        //     return; 
        // };

        console.log(this.formData)
        let promise = addHomework(this.formData);
        promise.then((res)=>{
            const {status} = res;
            if(status){
                    this.$confirm('发布成功', '提示', {
                    confirmButtonText: '确定',
                        callback: () => {
                        this.inputList = []; // 存储题目输入框的列表
                        this.value2 = '';
                        this.input1 = ''; 
                        this.value1 = [];
                }
                });
            }else{
            this.alert('发布失败', '提示', {
            confirmButtonText: '确定',
            callback: () => {
            }
            });
            }
        })
    },

  upgrateCourse() {
    let promise = getTeaching({ teacherId: this.user.userId });
    promise.then((response) => {
      const { status, description, data } = response;
      if (status) {
        this.sidebarData = data.reduce((result, item) => {
          return result.concat(item.courses);
        }, []);
      } else {
        alert(description);
      }
    });
  },
  showCoursePage(course) {
    this.selectedCourse = course;
  }
},
mounted() {
  this.upgrateCourse();
  this.setSidebarHeight();

      // 监听窗口大小变化
      window.addEventListener('resize', this.setSidebarHeight);
    },
  beforeDestroy() {
  // 在组件销毁前移除窗口大小变化的监听器
  window.removeEventListener('resize', this.setSidebarHeight);
},
};
</script>

<style scoped>
.input-container {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
}

.input-row {
    display: flex;
    justify-content: space-between;
}

.input-item {
    margin: 5px;
    flex: 1;
}

.delete-button {
    margin: 5px;
}
</style>
<style scoped>
.container {
display: flex;
}

.content {
flex: 3;
padding: 20px;
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

.custom-aside {
width: 150px;
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