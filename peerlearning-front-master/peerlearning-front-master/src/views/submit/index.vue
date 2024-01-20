<template>
  <el-container style="border: 1px solid #eee">
    <el-aside class="custom-aside" style="background-color: rgb(238, 241, 246)" ref="sidebar" width="170px">
      <el-menu>
        <el-menu-item v-for="course in sidebarData" :key="course.courseId" @click="showCoursePage(course) ; courseId = course.courseId; getHomeworks(courseId); showHomeworks();" :class="{ 'active': course.isActive }">
          {{ course.courseName }}
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header style="text-align: left; font-size: 12px;">
        <div style="display: flex; justify-content: space-between;">
          <h1 style="margin: 5px; font-weight: bold;">{{ courseName }}</h1>
          <p style="text-align: right; margin: 0;">课程ID: {{ courseId }}</p>
        </div>
      </el-header>

      <el-main>
        <el-divider></el-divider>
        <div style="margin: 20px; font-size: 15px;">
          <el-table :data="tableData">
          <el-table-column prop="homeworkId" label="作业号" width="100"></el-table-column>
          <!-- <el-table-column prop="answerId" label="答案号" width="100"></el-table-column> -->
          <el-table-column prop="homeworkDes" label="作业" width="180"></el-table-column>
          <el-table-column prop="nowStatus" label="状态" width="100"></el-table-column>
          <el-table-column prop="startTime" label="提交时间" width="200"></el-table-column>
          <el-table-column prop="endTime" label="截止时间" width="200"></el-table-column>
          <el-table-column
                  label="操作"
                  width="180">
                  <template slot-scope="scope">
                    <el-button @click="handleClickSubmit(scope.row.homeworkId,scope.row.nowStatus,scope.row.canSubmit)" 
                    type="text" size="small" >提交</el-button>
                    <el-button @click="handleClickCheck(selectedCourse.courseId,scope.row.homeworkId,scope.row.nowStatus,scope.row.answerId)" 
                    type="text" size="small" >查看</el-button>
                    <el-button @click="handleClickComment(scope.row.homeworkId)" type="text" size="small" >讨论区</el-button>
                  </template>
          </el-table-column>
        </el-table>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getStuHomework } from '@/api/student';
import { getStuCourses } from '@/api/student';
import { getHomeworksByCourse } from '@/api/record';

export default {
data() {
  return {
    tableData:[],//储存从后端获取的作业信息
    courseId: '',
    courseName:'',
    homeworks: [],
    activeNames: ['1'],
    sidebarHeight: 0,
    defaultOpeneds: [], // 设置默认展开的项
    sidebarData: [  // 数据源，根据实际情况替换为您的数据
    ],
    dialogImageUrl: '',
    dialogVisible: false,
    disabled: false,

    user: {
      userId: this.$store.state.user.userId // 设置用户ID，替换为实际的用户ID
    },
    sidebarData: [],
    selectedCourse: {},
  };
},

methods: {
  disableSubmitButton(row) {
      // 根据作业状态和答案号判断是否禁用提交按钮
      return row.nowStatus === '已结束'||'超时未提交' ;
  },
  disableCheckButton(row) {
      // 根据作业状态和答案号判断是否禁用查看按钮
      return !row.answerId;
  },

  //处理评论区
  handleClickComment(HomeworkId){
    this.$router.push({
        name: 'comment',
        query: {
          homeworkId: HomeworkId
        }
      });
  },

  setSidebarHeight() {
      // 获取窗口的视口高度
      const windowHeight = window.innerHeight;

      // 设置侧边栏的高度
      this.sidebarHeight = windowHeight;
      // this.$refs.sidebar.style.height = `${windowHeight}px`;
  },

  showCoursePage(course) {
  this.selectedCourse = course;
  this.courseId = course.courseId; // 更新课程ID
  this.courseName = course.courseName;
  this.showHomeworks(); 
  },

  upgrateCourse() {
    let promise = getStuCourses({ studentId: this.user.userId });
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

  showHomeworks() {
    let promise = getStuHomework({ courseId: this.courseId });
    promise.then((response) => {
      const { status, description, data } = response;
      if (status) {
        this.homeworks = data;
      } else {
        alert(description);
      }
    });
  },

  getHomeworks(courseId) {
      // 根据课程 ID 获取对应课程的作业信息
      getHomeworksByCourse({"courseId": courseId,"studentId": this.user.userId})
      .then((res)=>{
        const {status} = res;
        if(status){
          const {data} = res;
          this.tableData = data[0];//处理数据，是一个列表数据
        }
      })
      .catch(error => {
        console.error('Error fetching homeworks:', error);
      });
    },

    handleClickSubmit(homeworkId, nowStatus ,canSubmit) {
      // 使用路由跳转到/submit页面，并传递homeworkId作为查询参数
      if (nowStatus === '已结束'|| nowStatus === '超时未提交' || canSubmit === false || nowStatus === '已分配') {
        this.$message.warning('该作业已截止');
      } else {
        // 执行提交操作
        // 使用路由跳转到/submit页面，并传递homeworkId作为查询参数
        this.$router.push({ path: '/submit', query: { homeworkId, nowStatus } });
      }  
    },

  handleClickCheck(courseId, homeworkId, nowStatus, answerId) {
      // 使用路由跳转到/check页面，并传递查询参数
      if (answerId != null) {
        // 执行查看操作
        // 使用路由跳转到/check页面，并传递查询参数
        this.$router.push({ path: '/check', query: { courseId, homeworkId, nowStatus, answerId } });
      } else {
        this.$message.warning('还未提交作业，请先提交作业');
      }  
  },

},
mounted() {
  this.upgrateCourse();
  //this.getHomeworks(this.courseId);
  this.setSidebarHeight();
  this.homeworkId = this.$route.params.homeworkId;

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