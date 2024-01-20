<template>
    <!-- 边栏课程目录 -->
    <el-container style="border: 1px solid #eee">
        <el-aside class="custom-aside" style="background-color: rgb(238, 241, 246);" ref="sidebar" width="170px">
            <el-menu>
                <el-menu-item v-for="course in courseData" :key="course.courseId" @click="showCourseWork(course.courseId)">
                    {{ course.courseName }}
                </el-menu-item>
            </el-menu>
        </el-aside>
        <!-- 该课程下的作业信息 -->
        <el-container>
            <el-main>
                <el-table :data="tableData">
                    <el-table-column prop="homeworkId" label="任务ID" width="getColumnWidth(5)">
                    </el-table-column>
                    <el-table-column prop="time" label="时间范围" width="getColumnWidth(60)">
                        <template slot-scope="scope">
                            {{ scope.row.startTime }} - {{ scope.row.endTime }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="homeworkDes" label="任务详情" width="getColumnWidth(50)">
                    </el-table-column>
                    <el-table-column label="操作" width="getColumnWidth(10)">
                        <template slot-scope="scope">
                            <el-button @click="showCheck(scope.row)" type="text" size="small">查重情况</el-button> 
                            <el-button @click="showAppeal(scope.row)" type="text" size="small">申诉情况</el-button> 
                        </template>
                    </el-table-column>
                </el-table>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
//获得教师教授的课程getTeaching以及该课程下布置的作业getWorks
import { getTeaching, getWorks } from '@/api/teacher';
import Router from 'vue-router';

export default{
    data(){
        return {
            router: Router,
            user:this.$store.state.user,
            courseData: [],
            tableData: [],//表单中的信息
        }
    },
    mounted(){
        //显示课程目录
        this.showCourse();
        //初始化宽度
        this.handleResize();
        // 监听窗口大小变化
        window.addEventListener('resize', this.handleResize);
    },
    beforeDestroy() {
        // 移除窗口大小变化监听器
        window.removeEventListener('resize', this.handleResize);
    },
    computed:{

    },
    methods:{
        //获得边栏课程目录
        showCourse(){
            let promise = getTeaching({ 'teacherId': this.user.userId });
            promise.then((response) => {
                const { status, description, data } = response;
                if (status) {
                    this.courseData = data.reduce((result, item) => {
                        return result.concat(item.courses);
                        console.log("已获取到信息");
                    }, []);
                } else {
                    alert(description);
                }
            });
        },
        //点击课程，获得该课程的作业信息
        showCourseWork(courseId){
            this.getCourse(courseId);
        },
        //从后端获取作业信息
        getCourse(courseId){
            let promise = getWorks({'courseId':courseId});
            promise.then((res)=>{
                const {status} = res;
                if(status){
                    const {data} = res;
                    this.tableData = data[0];
                }
            })
        },
        //跳转到查看查重页面
        showCheck(row){
            this.$router.push({
                name: 'check',
                query: {
                    homeworkId: row.homeworkId,
                    homeworkDes: row.homeworkDes,
                }
            });
        },
        //跳转到查看申诉页面
        showAppeal(row){
            this.$router.push({
                name: 'appeal',
                query: {
                    homeworkId: row.homeworkId,
                    homeworkDes: row.homeworkDes,
                }
            })
        },
        //设置窗口大小
        handleResize() {
            // 窗口大小变化时重新计算列宽度
            this.columns.forEach((column) => {
                column.width = this.getColumnWidth(column.initialWidthPercentage);
            });
        },
        getColumnWidth(percentage) {
            console.log("")
            const tableWidth = this.$el.clientWidth; // 获取表格父元素的宽度
            return `${(tableWidth * percentage) / 100}px`;
        },
    },
}
</script>