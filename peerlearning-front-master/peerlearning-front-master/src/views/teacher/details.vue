<template>
    <el-container style="border: 1px solid #eee">
        <el-aside class="custom-aside" width="200px" style="background-color: rgb(238, 241, 246)" ref="sidebar">
            <el-menu :default-openeds="defaultOpeneds">
                <el-submenu v-for="item in  sidebarData" :key="item.courseId" :index="String(item.courseId)"
                    @click.native="changeShow(item)">
                    <template slot="title">{{ item.courseName }}</template>
                </el-submenu>
            </el-menu>
        </el-aside>
        <el-container>
            <el-main>
            <el-table :data="tableData">
                <el-table-column prop="homeworkId" label="任务ID" width="getColumnWidth(30)" align="center">
                </el-table-column>
                <el-table-column prop="time" label="时间范围" width="getColumnWidth(30)" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.startTime }} - {{ scope.row.endTime }}
                    </template>
                </el-table-column>
                <el-table-column prop="homeworkDes" label="任务详情" width="getColumnWidth(50)" align="center">
                </el-table-column>
                <el-table-column label="操作" width="getColumnWidth(10)" align="center">
                    <template slot-scope="scope">      
                    <el-button @click="handleClick(scope.row)" type="text" size="small">查看详情</el-button> 
                    <el-button @click="modifyHomeowrk(scope.row)" type="text" size="small">作业详情</el-button> 
                    <el-button @click="allocation(scope.row)" type="text" size="small">分配任务</el-button>
                    <el-button @click="calculateGrade(scope.row)" type="text" size="small">统计分数</el-button>           
                    </template>
                </el-table-column>
            </el-table>
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
</style>


<script>
import { getCourses,getWorks } from '@/api/teacher';
import {calcuGrade} from '@/api/assignment'
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import Quill from 'quill';
import Router from 'vue-router';
export default {
    data() {
        return {
            router: Router,
            show: false,
            canCheck: true,
            courseId:'',
            courseName:'',
            assignmentId: '',
            sidebarHeight: 0,
            defaultOpeneds: [], // 设置默认展开的项
            user: this.$store.state.user,
            editorOption: {          //对富文本编辑器的修改
                placeholder: '请输入评论',
                theme: 'snow',
                // 其他选项...
            },
            tableData: [],
            sidebarData: [],  // 数据源，根据实际情况替换为您的数据
            columns: [
                { prop: 'homeworkId', label: '任务ID', width: '10%' },
                { prop: 'time', label: '时间范围', width: '30%' },
                { prop: 'homeworkDes', label: '任务详情', width: '50' },
                { prop: 'operation', label: '操作', width: '10' },
            ]
        };
    },
    mounted() {
        // 初始化列宽度
        this.handleResize();
        // 监听窗口大小变化
        window.addEventListener('resize', this.handleResize);
        this.upgrateCourse();
    },
     beforeDestroy() {
        // 移除窗口大小变化监听器
        window.removeEventListener('resize', this.handleResize);
    },
    methods: {
        changeShow(item) {
            this.courseId = item.courseId;
            this.courseName = item.courseName;
            let promise = getWorks({'courseId':item.courseId});
            promise.then((res)=>{
                const {status} = res;
                if(status){
                    const {data} = res;
                    this.tableData = data[0];
                }
            })
        },

        handleClick(row){
             this.$router.push({
                name: 'assignmentInfo',
                query: {
                    homeworkId: row.homeworkId,
                    courseId: this.courseId,
                    teacherId: this.user.userId,
                    courseName: this.courseName
                }
            });
        },

        modifyHomeowrk(row){
            this.$router.push({
                name: 'homeworkDetails',
                query: {
                    homeworkDes: row.homeworkDes,
                    homeworkId: row.homeworkId,
                }
            })
        },

        allocation(row){
            this.$router.push({
                name: 'allocateAssign',
                query: {
                    homeworkId: row.homeworkId,
                    courseId: this.courseId,
                    courseName: this.courseName
                }
            })
        },

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
        setSidebarHeight() {
            // 获取窗口的视口高度
            const windowHeight = window.innerHeight;

            // 设置侧边栏的高度
            this.sidebarHeight = windowHeight;

            this.$nextTick(() => {
                const sidebar = this.$refs.sidebar;
                if (sidebar) {
                    // sidebar.style.height = `${windowHeight}px`;
                }
            });
        },

        calculateGrade(row){
            calcuGrade({homeworkId: row.homeworkId}).then((res)=>{
                const {status} = res
                if(status){
                    this.$message({
                        message: '计算完成',
                        type: 'success'
                    })
                }else{
                    const {description} = res
                    this.$message.error(description)
                }
            })
            
        },

        upgrateCourse() {
            let promise = getCourses({ "teacherId": this.user.userId })
            promise.then((data) => {
                const { status } = data
                if (status) {
                    const data_1 = data.data
                    // 使用 reduce 方法将数据按照 courseName 分组
                    this.sidebarData = data_1[0].courses
                    console.log("sidebarData",this.sidebarData)
                } else {
                    const { description } = data
                    alert(description)
                }
            })
        },
    },
    modules: {
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
    height: 100vh;
    /* 适应屏幕高度 */
    overflow-y: auto;
    /* 添加滚动条，以防内容过长 */
}

#editor-container {
    height: 300px;
}

.line {
    float: right;
    width: 100%;
    height: 1px;
    margin-top: -0.5em;
    background: #d4c4c4;
    position: relative;
    text-align: center;
}
</style>


