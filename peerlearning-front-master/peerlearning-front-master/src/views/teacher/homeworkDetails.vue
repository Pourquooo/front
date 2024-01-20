<template>
    <div>
        <div ref="vantaRef" class="background-container">
        </div>
        <!-- <div> -->
            <el-container>
                <!-- 作业标题模块 -->
                <el-header style="display: flex; justify-content: left; align-items: left; text-align: left; font-size: 20px; height: 100px;">
                    <div style="margin-left: 10px;">
                        <div v-if="!editing">
                            <h1 style="font-size: 20px;">{{ this.homeworkTitle }} - 作业详情</h1>
                        </div>
                        <div v-else>
                            <h1 style="font-size: 20px;">作业标题</h1>
                            <el-input v-model="chHomeworkTitle" placeholder="请输入内容"></el-input>
                        </div>
                    </div>
                    <!-- 提交时间模块 -->
                    <div style="margin-left: 20px;">
                        <!-- 展示模式 提交时间 -->
                        <div v-if="!editing">
                            <p style="font-size: 15px;">提交时间: {{ this.startTime }} - {{ this.endTime }}</p>
                        </div>
                        <!-- 修改模式 提交时间 -->
                        <div v-else>
                            <p style="font-size: 15px;">作业提交时间</p>
                            <el-date-picker v-model="chTime" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                        </div>
                    </div>
                </el-header>
            </el-container>
            <el-container>
                <el-main>
                    <!-- 按钮 -->
                    <div style="display: flex; justify-content: flex-end; align-items: center; margin-top: 20px; margin-bottom: 10px;">
                        <el-button type="primary" @click="toggleEditMode">{{ editing ? '保存' : '修改作业' }}</el-button>
                        <el-button type="danger" @click="deleteHomeworkInfo">{{ editing ? '退出' : '删除作业' }}</el-button>
                    </div>
                    <div>
                        <!-- 作业详情 -->
                        <div style="margin-left: 20px;">
                            <div v-for="(question, index) in questions" :key="index">
                                <el-divider></el-divider>
                                <!-- 题目内容 -->
                                <h3>第{{ index + 1 }}题 - 问题</h3>
                                <p v-if="!editing">{{ question.content }}</p>
                                <el-input v-else v-model="chQuestion[index]" placeholder="请输入问题" style="margin: 5px"></el-input>
                                <!-- 标准答案 -->
                                <h3>第{{ index + 1 }}题 - 标准答案</h3>
                                <p v-if="!editing">{{ question.standardAnswer }}</p>
                                <el-input v-else v-model="chStandAns[index]" placeholder="请输入答案" style="margin: 5px"></el-input>
                                <!-- 本题分数 -->
                                <h3>第{{ index+1 }}题 - 分数</h3>
                                <p v-if="!editing">{{ question.score }}</p>
                                <el-input-number v-else v-model="chScore[index]" :min="0" :max="100" style="margin: 5px"></el-input-number>
                            </div>
                        </div>
                        <!-- 新增作业 -->
                        <el-divider></el-divider>

                        <div v-if="editing" style="margin: 20px; font-size: 15px;">
                            <p style="margin-bottom: 20px">新增题目</p>
                            <div v-for="(item, index) in inputList" :key="index" style="margin-bottom: 10px">
                                <el-divider></el-divider>
                                <h3 style="margin-bottom: 20px">新增题目{{ index + 1 }}</h3>
                                <h3>问题</h3>
                                <el-input v-model="item.content" placeholder="请输入问题" style="margin: 5px"></el-input>
                                <h3>标准答案</h3>
                                <el-input v-model="item.answer" placeholder="请输入本题答案" style="margin: 5px"></el-input>
                                <h3>分数</h3>
                                <el-input-number v-model="item.score" :min="0" :max="100" style="margin: 5px"></el-input-number>
                            </div>
                            <el-button type="primary" icon="el-icon-plus" @click="addInput">新增题目</el-button>
                        </div>

                    </div>
                </el-main>
            </el-container>
        <!-- </div> -->
    </div>
</template>

<script>
//修改和删除作业接口
import {getHomeworkByHomeworkId, updateHomework, TeachDeleteHomework,} from "@/api/homework"
import { title } from "@/settings";
import * as THREE from 'three'
// import BIRDS from 'vanta/src/vanta.birds'
// import Topology from "vanta/src/vanta.topology";
import Fog from "vanta/src/vanta.fog"

 export default{
    data(){
        return{
            editing: false,//判断是否是编辑模式
            user: this.$store.state.user,//用户身份
            homeworkid: null,
            homeworkTitle: null,
            //用于从后端接收作业详情
            startTime: null,
            endTime: null,
            questions: [],
            content: null,
            //修改后的作业信息
            chHomeworkTitle: null,//修改后的作业标题
            chTime: [new Date(2023, 10, 10, 10, 10), new Date(2023, 10, 11, 10, 10)],//修改后的提交时间
            chQuestion: [],//修改后的作业问题
            chStandAns: [],//修改后的标准答案
            chScore: [],//修改后的作业分数
            inputList: [],//新增加的题目列表
            //向后端传输的数据
            formData:{
                homeworkId: '',
                content: '',
                startTime: '',
                endTime: '',
                gradeScope: '',
                standAns: '',
                homeworkDes: '',
            }
        };
    },
    mounted(){
        this.homeworkid = this.$route.query.homeworkId;
        this.homeworkTitle = this.$route.query.homeworkDes;
        console.log("接收到的信息:",this.homeworkTitle);
        console.log("接收到的作业号:",this.homeworkid);
        this.showHomworkInfo();
        this.vantaEffect = Fog({
            el: this.$refs.vantaRef,
            THREE: THREE
        })

        this.vantaEffect.setOptions({
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            highlightColor: 0xffffff,
            midtoneColor: 0x8b8484,
            lowlightColor: 0xa9a9a9,
            baseColor: 0xd9caca
        })
    },
    //将修改内容转化为规定格式
    computed: {
        contents() {
            if(this.inputList.map(item => item.content).length == 0){
                const addQuestion = this.chQuestion.join('￥！');
                return addQuestion;
            }
            const addQuestion = this.chQuestion.join('￥！');
            const addQuestions = this.inputList.map(item => item.content).join('￥！');
            const combineQuestion = `${addQuestion}￥！${addQuestions}`;
            console.log(combineQuestion);
            return combineQuestion;
        },
        standAns() {
            if(this.inputList.map(item => item.answer).length == 0){
                const addAnswer = this.chStandAns.join('￥！');
                return addAnswer;
            }
            const addAnswer = this.chStandAns.join('￥！');
            const addAnswers = this.inputList.map(item => item.answer).join('￥！');
            const combineAnswer = `${addAnswer}￥！${addAnswers}`;
            return combineAnswer;
        },
        score(){
            if(this.inputList.map(item => item.score).length == 0){
                const addScore = this.chScore.join('￥！');
                return addScore;
            }
            const addScore = this.chScore.join('￥！');
            const addScores = this.inputList.map(item => item.score).join('￥！');
            const combineScore = `${addScore}￥！${addScores}`;
            return combineScore;
        },
    },
    methods:{
        //从后端获取作业信息函数
        showHomworkInfo(){
            let promise = getHomeworkByHomeworkId({ 'homeworkId': this.homeworkid });
            promise.then((response) => {
                const { status, description, data } = response;
                console.log(response)
                if (status) {
                    this.startTime = data[0].startTime;
                    this.endTime = data[0].endTime;
                    const contents = (data[0].content || '').split('￥！');
                    const stdAnswers = (data[0].stdAns || '').split('￥！');
                    const scores = (data[0].gradeScope || '').split('￥！');
                    
                    this.questions = contents.map((content, index) => ({
                        content,
                        standardAnswer: stdAnswers[index] || '暂无', 
                        score: scores[index] || '暂无',
                    }));
                } else {
                    alert(description);
                }
            });
        },
        //修改作业信息函数
        toggleEditMode(){
            if(this.editing==true){
                const currentTime = new Date();
                if (!this.chHomeworkTitle ||
                !this.chTime[0] ||
                !this.chTime[1] ||
                this.chTime[1] < currentTime ||
                this.chQuestion.some(question => !question) ||
                this.chStandAns.some(answer => !answer) ||
                this.chScore.some(score => score === null || score === undefined || score === '')
                ) {
                    this.$message.error('请填写完整正确的作业信息！');
                    return;
                }
            
                this.editing=!this.editing;
                this.formData.homeworkId = this.homeworkid
                this.formData.startTime = this.chTime[0] || '';
                this.formData.endTime = this.chTime[1] || '';
                this.formData.content = this.contents;
                this.formData.standAns = this.standAns;
                this.formData.homeworkDes = this.chHomeworkTitle;
                this.formData.gradeScope = this.score;
                console.log(this.formData.gradeScope);
                
                let promise=updateHomework(this.formData);
                promise.then((res)=>{
                    const {status} = res;
                    if(status){
                        this.$confirm('发布成功', '提示', {
                            confirmButtonText: '确定',
                            callback: () => {
                                //发布成功后置空
                                this.chQuestion = [];
                                this.chStandAns = [];
                                this.chTime = '';
                                this.chHomeworkTitle = ''; 
                                this.chScore = [];
                                this.questions = [];
                                this.inputList = [];
                            }
                        });
                    }
                    else{
                        this.alert('发布失败', '提示', {
                            confirmButtonText: '确定',
                            callback: () => {
                                //发布失败只置空修改的内容
                                this.chQuestion = [];
                                this.chStandAns = [];
                                this.chTime = '';
                                this.chHomeworkTitle = '';
                                this.chScore = [];
                                this.inputList = [];
                            }
                        });
                    }
                })
                .catch((error) => {
                    alert("发布失败");
                })
            }
            this.editing=!this.editing;
        },
        //新增作业
        addInput(){
            this.isAdd = 1;
            const index = this.inputList.length + 1; // 计算题目序号
            this.inputList.push({ content: '', answer: '', score: '' }); // 添加题目和答案的输入框
            console.log(`第${index}题`);
        },
        //删除作业函数
        deleteHomeworkInfo(){
            if(this.editing==false){
                const confirmDelete = window.confirm("确定要删除此作业吗？");
                if (confirmDelete) {
                    TeachDeleteHomework({'homeworkId': this.homeworkid})
                    .then(() => {
                        // 处理成功，显示成功消息或导航到另一个页面
                        console.log("作业删除成功");
                        // 你也可以使用通知库或对话框显示成功消息
                        // 例如，使用 Element UI 的 MessageBox：
                        this.$message.success("作业删除成功");
                    })
                    .catch((error) => {
                        // 处理错误，显示错误消息
                        console.error("删除作业时发生错误：", error);
                        this.$message.error("删除作业时发生错误");
                    });
                }
            }
            else{
                //退出以后修改编辑状态
                this.editing=!this.editing;
                //并将修改框中的内容删除
                this.chQuestion = [];
                this.chStandAns = [];
                this.chTime = '';
                this.chHomeworkTitle = '';
                this.chScore = [];
                this.inputList = [];
            }
        },
        //判断是否是图片
        isUrl(string) {
            try {
                new URL(string);
                return true;
            } catch (err) {
                return false;
            }
        },
    },
 }
</script>

<style scoped>
.background-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1; /* 将背景置于最底层 */
  /* 如果有背景图片，可以这样设置：
  background: url('your-image-path.jpg') center center no-repeat;
  background-size: cover;
  */
}
</style>