<template>
    <el-container>
        <el-header style="display: flex; justify-content: center; align-items: center; text-align: center; font-size: 12px;" >
            <div class="course-info">
                <h3 class="course-name">作业：{{ homeworkTitle }}</h3>
            </div>
          </el-header>
          <el-main>

            <el-table :data="tableData" style="width: 100%" :row-class-name="tableRowClassName">
                <el-table-column prop="answerId" label="作业号" >
                </el-table-column>
                <el-table-column prop="studentName" label="学生姓名" >
                </el-table-column>
                <el-table-column prop="studentNumber" label="学号" >
                </el-table-column>
                <el-table-column prop="appealContent" label="申诉内容">
                </el-table-column>
                <el-table-column prop="appealStatus" label="是否受理" >
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <div v-if="scope.row.appealStatus=='未受理'">
                            <el-button @click="dealAppeal(scope.row)" type="text" size="small" >查看详情</el-button>            
                        </div>
                        <el-button v-else disabled type="text" size="small">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
    </el-container>
</template>

<script>
//获取申诉信息的接口
import {getAppealInfo} from '@/api/assignment';
import Router from 'vue-router';
export default {
    data(){
        return{
            router: Router,
            //对话框显示
            dialogVisible: false,
            //从前一页面接受到的数据
            homeworkid: null,
            homeworkTitle: null,
            //表单数据
            tableData: [],
            //设置申诉状态
            isAppealed: 0,
            //设置最终分数
            finalScore: null,
            //传输的答案号
            selectedAnswerId: null,
        }
    },
    mounted(){
        this.homeworkid = this.$route.query.homeworkId;
        this.homeworkTitle = this.$route.query.homeworkDes;
        console.log("接收到的作业号:");
        console.log(this.homeworkid);
        this.showAppealInfo();
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
        //从后端获取数据
        showAppealInfo(){
            let promise=getAppealInfo({'homeworkId': this.homeworkid});
            promise.then((res)=>{
                const {status} = res;
                if(status){
                    const {data} = res;
                    this.tableData=data[0].answers;
                }else{
                    const {description} = res;
                    alert(description)
                }
            })
            .catch(error => {
                console.error('Error fetching homeworks:', error);
            });
        },
        //跳转页面处理申诉
        dealAppeal(row){
             this.$router.push({
                name: 'homework',
                query: {
                    answerId: row.answerId,
                    homeworkTitle: this.homeworkTitle,
                }
            });
        },
    },
}
</script>