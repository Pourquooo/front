<template>
  <el-container style="height: 500px; border: 1px solid #eee">
      <el-aside class="custom-aside" style="background-color: rgb(238, 241, 246);" ref="sidebar" width="170px">
            <el-menu>
                <el-menu-item v-for="course in courses" :key="course.courseId" @click="handlegetHomeworks(course.courseId)">
                    {{ course.courseName }}
                </el-menu-item>
            </el-menu>
        </el-aside>
        <el-container>
          <el-header style="text-align: right; font-size: 12px"></el-header>
          <el-main>
            <el-table :data="tableData">
              <el-table-column prop="homeworkId" label="作业号" width="90"></el-table-column>
              <!-- <el-table-column prop="answerId" label="答案号" width="100"></el-table-column> -->
              <el-table-column prop="homeworkDes" label="作业" width="230"></el-table-column>
              <el-table-column prop="nowStatus" label="状态" width="120"></el-table-column>
              <el-table-column prop="startTime" label="提交时间" width="200"></el-table-column>
              <el-table-column prop="endTime" label="截止时间" width="200"></el-table-column>
              <el-table-column label="操作" :show-overflow-tooltip="false">
              <template slot-scope="scope">
                <router-link v-if="scope.row.answerId" :to="'/details?homeworkId=' + scope.row.homeworkId + '&answerId=' + scope.row.answerId + '&homeworkDes=' + scope.row.homeworkDes">
                  <el-button type="text" size="small" style="margin-right: 10px;">查看详情</el-button>
                </router-link>
                  <el-button v-if="scope.row.answerId" type="text" size="small" @click="details(scope.row)" style="margin-right: 10px;">互评详情</el-button>
                  <el-button v-else disabled type="text" size="small" style="margin-right: 10px;">查看详情</el-button>
                  <el-button v-else disabled type="text" size="small" style="margin-right: 10px;">互评详情</el-button>
              </template>
            </el-table-column>
            </el-table>
          </el-main>

          <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="50%"
            :before-close="handleClose">

           <el-table :data="tableData" style="width: 100%" border>
              <el-table-column
              v-for="(column, index) in dynamicColumns"
              :key="index"
              :prop="column.prop"
              :label="column.label"
              :width="column.width">
            </el-table-column>
          </el-table>

            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
      </el-dialog>
        </el-container>
        </el-container>
        
</template>

<script>
import {getCourses, getHomeworksByCourse} from '@/api/record';
import {details} from '@/api/homework';
export default {
  data() {
    return {
      tableRowClassName : '',
      dialogVisible: false,
      user: this.$store.state.user,//用户身份
      tableData:[],//储存从后端获取的作业信息
      courses: [],//储存从后端获取的课程列表
      defaultOpeneds : 0,
      dynamicColumns: []
    };
  },
  mounted() {
    this.fetchCourses();
  },
  methods: {
    fetchCourses() {
      // 从后端获取课程信息
      console.log(this.user.userId)
      getCourses({"studentId":this.user.userId})
        .then(response => {
          this.courses = response.data[0].courses;
          // console.log("以下是·获取·到的·data")
          console.log("以下是获取到的课程")
          console.log(this.courses)
          // console.log("以下是·获取·到的1")
          // console.log(this.courses[1])
          // console.log(this.courses[1].courseName)
        })
        .catch(error => {
          console.error('Error fetching courses:', error);
        });
    },
    
    handlegetHomeworks(courseId){
      this.getHomeworks(courseId);
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
    //查看作业批改详情的函数，进行页面跳转
    viewHomework(row) {
      // 通过 $router.push() 进行页面导航
      this.$router.push({ 
        name: 'details', 
        query: {
          homeworkId: row.homeworkId,
          answerId: row.answerId,
          homeworkDes: row.homeworkDes
        } 
      });
    },

    details(row){
      // console.log(row)
      let promise = details({answerId:row.answerId})
      promise.then((res)=>{
        const {status} = res
        console.log('here',status)
        if(status){
          let data = res.data[0];
          this.dynamicColumns.push({ prop: 'index', label: '序号', width: '50', fixed:true })
          this.dynamicColumns.push({ prop: 'weight', label: '权重', width: '180', fixed:false })
          console.log(data)
          let str = data[0].grade.split('￥！').map((value, index) => ({id: index, content: value.split('￥？').map((value, index) => ({ id: index, content: value }))}))
          for(let i=0; i<str.length; i++)
          {
            this.dynamicColumns.push({ prop: '第'+(i+1)+'题', label: '第'+(i+1)+'题', width: '180', fixed:false})
          }
          
          // 使用 map 函数遍历老数组，生成新的数组
          let newArray = data.map((item, index) => {
            // 将 grade 属性的字符串拆分成数组
            let gradesArray = item.grade.split("￥！").map(Number);

            // 构建一个对象，其中键是题目的编号，值是对应的成绩
            let gradedByQuestion = gradesArray.reduce((result, grade, index) => {
              let questionNumber = "第" + (index + 1) + "题";
              result[questionNumber] = grade;
              return result;
            }, {});

            // 返回新的对象，包含 grades 属性
            return {
              ...gradedByQuestion, // 将 gradedByQuestion 放入数组中
              index: index+1,
              assignment_id: item.assignment_id,
              reviewer_id: item.reviewer_id,
              weight: item.weight
            };
          });

          console.log('ok',newArray)
          this.tableData = newArray

        }
      })
      this.dialogVisible = true
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => { });
    }
  }
};
</script>

<style>
.el-header {
background-color: #B3C0D1;
color: #333;
line-height: 60px;
}

.el-aside {
color: #333;
}
.search-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.custom-table {
  width: 100%;
}
</style>

