<template>
    <el-container>
          <el-header style="display: flex; justify-content: center; align-items: center; text-align: center; font-size: 12px;" >
            <div class="course-info">
                <h3 class="course-name">课程名称：{{ courseName }}</h3>
                <h3>总人数/提交人数：{{ studentCount }}/{{ submission }}</h3>
            </div>
          </el-header>
       <el-main>
         <el-table :data="tableData" style="width: 100%" :row-class-name="tableRowClassName">
                <el-table-column prop="studentNumber" label="学号" >
                </el-table-column>
                <el-table-column prop="studentName" label="姓名" >
                </el-table-column>
                <el-table-column prop="totalScore" label="总分" >
                </el-table-column>
                <el-table-column prop="operation" label="操作" style="text-align: right;">
                   <template slot-scope="scope">      
                        <el-button @click="handleClick(scope.row)" type="text" size="small">查看详情</el-button>
                        <el-button @click="handleClickAssignment(scope.row)" type="text" size="small">分配情况</el-button>            
                    </template>
            </el-table-column>
         </el-table>
       </el-main>
       <el-dialog
                title="提示"
                :visible.sync="dialogVisible"
                width="50%"
                :before-close="handleClose">

               <el-table :data="new_tableData" style="width: 100%" border>
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
</template>

<style>
.el-table .warning-row {
    background: oldlace;
}

.el-table .success-row {
    background: #f0f9eb;
}

 .course-info {
    display: flex;
    align-items: center;
    justify-content: center; /* 水平方向上居中 */
  }

  .course-name {
    margin-right: 20px; /* 调整右边距，根据实际情况调整数值 */
  }
</style>

<script>
import {getStudentInfo} from '@/api/teacher'
import { getDetailGrade } from '@/api/teacher'
export default {
    methods: {
         tableRowClassName({ row, rowIndex }) {
            if (rowIndex === 1) {
                return 'warning-row';
            } else if (rowIndex === 3) {
                return 'success-row';
            }
            return '';
        },

        handleClick(row){
             this.$router.push({
                name: 'DetailsforStu',
                query: {
                    answerId: row.answerId,
                    homeworkId: this.homeworkId,
                }
            });
        },
        updateInfo(){            
            let promise = getStudentInfo({'homeworkId':this.homeworkId,'teacherId':this.teacherId,'courseId':this.courseId});
            promise.then((res)=>{
                const {status} = res;
                if(status){
                    const {data} = res;
                    const data_1 = data[0];
                    console.log(data_1)
                    this.submission = data_1['totalSubmissions']
                    this.studentCount = data_1['studentCount']
                    this.tableData = data_1['answersInfo']
                    console.log(this.tableData)
                }else{
                    const {description} = res;
                    alert(description)
                }
            })
        },
        handleClickAssignment(row){
            getDetailGrade({answerId:row.answerId}).then((res)=>{
                const {status} = res;
                if(status){
                    
                    let data = res.data[0];
                    this.dynamicColumns.push({ prop: 'index', label: '序号', width: '50', fixed: true })
                    this.dynamicColumns.push({ prop: 'weight', label: '权重', width: '180', fixed: false })
                    this.dynamicColumns.push({ prop: 'reviewer_id', label: '学号', width: '100', fixed: false })
                    this.dynamicColumns.push({ prop: 'reviewer_name', label: '姓名', width: '100', fixed: false })
                    console.log(data)
                    
                    // 使用 map 函数遍历老数组，生成新的数组
                    let jud = false
                    let count = 0
                    let newArray = data.map((item, index) => {

                        if(item.grade){
                            jud = true
                        }

                        if (item.grade && jud && count==0) {
                            let str = data[0].grade.split('￥！').map((value, index) => ({ id: index, content: value.split('￥？').map((value, index) => ({ id: index, content: value })) }))
                            for (let i = 0; i < str.length; i++) {
                                this.dynamicColumns.push({ prop: '第' + (i + 1) + '题', label: '第' + (i + 1) + '题', width: '100', fixed: false })
                            }
                            jud = false
                            count++
                        }

                        // 将 grade 属性的字符串拆分成数组
                        let gradedByQuestion = [];
                        if(item.grade){
                            let gradesArray = item.grade.split("￥！").map(Number);

                            // 构建一个对象，其中键是题目的编号，值是对应的成绩
                            gradedByQuestion = gradesArray.reduce((result, grade, index) => {
                                let questionNumber = "第" + (index + 1) + "题";
                                result[questionNumber] = grade;
                                return result;
                            }, {});
                        }

                        // 返回新的对象，包含 grades 属性
                        return {
                            ...gradedByQuestion, // 将 gradedByQuestion 放入数组中
                            index: index + 1,
                            assignment_id: item.assignment_id,
                            reviewer_id: item.reviewer_id,
                            weight: item.weight,
                            reviewer_name: item.reviewer_name
                        };
                    });
                    this.new_tableData = newArray
                    this.dialogVisible = true

                }else{
                    const {description} = res;
                    this.$message.error(description)
                }
            })
        },
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    done();
                })
                .catch(_ => { });
        }
    },
    data() {
        return {
            new_tableData : [],
            homeworkId: this.$route.query.homeworkId,
            courseId: this.$route.query.courseId,
            teacherId: this.$route.query.teacherId,
            courseName: this.$route.query.courseName,
            tableData: [],
            submission: '',
            studentCount: '',
            dialogVisible: false,
            dynamicColumns: []
        }
    },
    mounted(){
        this.updateInfo();
    }
}
</script>