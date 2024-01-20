<template>
    <el-container>
        <el-header style="display: flex; justify-content: center; align-items: center; text-align: center; font-size: 12px;" >
            <div class="course-info">
                <h3 class="course-name">作业：{{ homeworkTitle }}</h3>
                <!-- <h3>总人数/提交人数：{{ studentCount }}/{{ submission }}</h3> -->
            </div>
          </el-header>
          <el-main>

            <!-- <el-dialog :visible.sync="dialogVisible" title="查看答案">
                <div v-for="(item, index) in studentAns" :key="index">
                    <el-divider></el-divider>
                    <h3>学生姓名: {{ item.studentName }}</h3>
                    <p>学号: {{ item.studentNumber }}</p>
                    <p v-for="(answer, ansIndex) in item.answerText.split('￥!')" :key="ansIndex">
                        <img v-if="answer.startsWith('http')" :src="answer" style="max-width: 100%;" />
                        <span v-else>{{ answer }}</span>
                    </p>
                    <el-button @click="dialogVisible = false">关闭</el-button>
                </div>
            </el-dialog> -->
            <!-- <el-dialog :visible.sync="dialogVisible" title="查看答案">
                <span>学生答案：</span>
                <div style="margin-top: 2px, margin-bottom: 10px" v-for="(item, index) in studentAns" :key="index">
                    <p style="margin-bottom: 20px">题目{{ index + 1 }}</p>
                    <p>{{ item.answerText }}</p>
                    <el-button @click="dialogVisible = false">关闭</el-button>
                </div>
            </el-dialog> -->

            <el-table :data="tableData" style="width: 100%" :row-class-name="tableRowClassName">
                <el-table-column prop="answerId" label="作业号" >
                </el-table-column>
                <el-table-column prop="studentName" label="学生姓名" >
                </el-table-column>
                <el-table-column prop="studentNumber" label="学号" >
                </el-table-column>
                <el-table-column prop="gptSim" label="GPT查重" >
                </el-table-column>
                <el-table-column prop="otherSim" label="作业相似度查重" >
                </el-table-column>
                <el-table-column prop="answerText" label="作业答案" >
                </el-table-column>
                <!-- <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button @click="checkAnswer(scope.row)" type="text" size="small" >查看答案</el-button>
                    </template>
                </el-table-column> -->
            </el-table>
        </el-main>
    </el-container>
</template>
<script>
import { getCheckInfo } from '@/api/assignment';
export default{
    data(){
        return{
            //从上一页面获取到的数据
            homeworkid: null,
            homeworkTitle: null,

            //表单数据
            tableData: [],
            //学生答案
            studentAns:[],
            //对话框初始看不见
            dialogVisible: false,
        }
    },
    mounted(){
        //从上一页面获取数据
        this.homeworkid = this.$route.query.homeworkId;
        this.homeworkTitle=this.$route.query.homeworkDes;
        console.log("接收到的作业号为：")
        console.log(this.homeworkid);
        //渲染表单
        this.showCheckInfo();
    },
    methods:{
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex === 1) {
                return 'warning-row';
            } else if (rowIndex === 3) {
                return 'success-row';
            }
            return '';
        },

        //查看被查重的作业的答案
        checkAnswer(){
            this.dialogVisible=true;
        },
        //从后端获取查重结果
        showCheckInfo(){
            let promise=getCheckInfo({'homeworkId': this.homeworkid});
            promise.then((res)=>{
                const {status} = res;
                if(status){
                    const {data} = res;
                    this.tableData=data[0].answers;
                    //const stuAns = (data[0].answers.answerText || '').split('￥！');

                    // this.studentAns = data[0].answers.map(answer => ({
                    //     studentName: answer.studentName,
                    //     studentNumber: answer.studentNumber,
                    //     answerText: answer.answerText.split('￥!'),
                    // }));
                }else{
                    const {description} = res;
                    alert(description)
                }
            })
            .catch(error => {
                console.error('Error fetching homeworks:', error);
            });
        },
    },
}
</script>

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