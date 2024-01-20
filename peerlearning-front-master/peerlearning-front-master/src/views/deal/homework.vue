<template>
    <el-container>
        <el-header style="display: flex; justify-content: left; align-items: left; text-align: left; font-size: 20px; height: 100px;">
            <div style="margin-left: 10px;">
                <h1 style="font-size: 20px; margin-bottom: 0;">{{ this.homeworkTitle }} - 作业详情</h1>
            </div>
        </el-header>
        <el-container>
        <el-main>
            <div style="display: flex; justify-content: flex-end; align-items: center;">
                <el-button type="primary" @click="toggleEditMode">{{ editing ? '保存' : '修改分数' }}</el-button>
                <el-button v-if="editing" @click="toggleEditModeCancle">取消</el-button>
            </div>
            <!-- <div> -->
                <div style="margin-left: 20px;">
                    <div v-for="(item, index) in questions" :key="index">
                        <el-divider></el-divider>
                        <div>
                            <h3>第{{ index + 1 }}题</h3>
                            <p>{{ item.content }}</p>
                        </div>

                        <div>
                            <h3>第{{ index + 1 }}题 - 学生答案：</h3>
                            <template v-if="Array.isArray(item.studentAnswer)">
                                <div v-for="(answer, answerIndex) in item.studentAnswer" :key="answerIndex">
                                    <div v-if="isUrl(answer)">
                                        <img :src="answer" alt="我的答案" style="max-width: 100%; height: auto;" />
                                    </div>
                                    <p v-else>{{ answer }}</p>
                                </div>
                                <p v-if="item.studentAnswer.length === 0">本题暂无学生答案</p>
                            </template>
                            <template v-else-if="isUrl(item.studentAnswer)">
                                <img :src="item.studentAnswer" alt="我的答案" style="max-width: 100%; height: auto;" />
                            </template>
                            <template v-else>
                                <p v-if="item.studentAnswer">{{ item.studentAnswer }}</p>
                                <p v-else>本题暂无学生答案</p>
                            </template>
                        </div>

                        <div>
                            <h3>第{{ index + 1 }}题 - 标准答案</h3>
                            <p>{{ item.standardAnswer }}</p>
                        </div>
                        
                        <div>
                            <h3>第{{ index + 1 }}题 - 学生得分</h3>
                            <div v-if="!editing">
                                <p>{{ item.everyScore }}分</p>
                            </div>
                            <div v-else>
                                <el-input-number v-model="chScore[index]" :min="0" :max="100" style="margin: 5px"></el-input-number>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="!editing" style="margin-left: 20px;">
                    <h3>总分: {{ finalScore }}分</h3>
                    <h3>评价：</h3>
                    <p v-for="(comment, index) in comments" :key="index">{{ comment }}</p>
                </div>
            <!-- </div> -->
        </el-main>
        </el-container>
    </el-container>
</template>
<script>
import {dealAppealInfo} from '@/api/assignment';
import {getHomeworkScore} from '@/api/record';
export default{
    data(){
        return{
            user: this.$store.state.user,
            answerId: null,
            homeworkTitle: null,
            //判断当前是否是编辑状态
            editing: false,
            //后端获取到的数据
            finalScore: '',
            comments: '',
            questions: [],
            // activeNames: [],
            //修改后的成绩
            chScore:[],
            //向后端传输的数据
            formData:{
                answerId: '',
                ChangedScore: '',
                isAppealed: 0,
            },
        }
    },
    mounted(){
        this.answerId = this.$route.query.answerId;
        this.homeworkTitle = this.$route.query.homeworkTitle;
        this.fetchAnswer(this.answerId);
        console.log(this.questions.studentAnswer);
    },
    computed:{
        scoreList(){
            const chScore = this.chScore.join('￥！');
            console.log(chScore);
            return chScore;
        }
    },
    methods:{
        isUrl(string) {
            try {
                new URL(string);
                return true;
            } catch (err) {
                return false;
            }
        },
        //从后端读取数据并处理
        fetchAnswer(answerid){
            getHomeworkScore({"answerId": answerid})
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
                    const studentAnswers = (data[0].answerData.answer || '').split('￥！');

                    const totalScore = finalScores.reduce((acc, score) => {
                        // Convert score to number and add to accumulator if not empty
                        if (score !== '') {
                            return acc + parseFloat(score);
                        }
                        return acc;
                    }, 0);
                    this.finalScore = totalScore.toString();

                    this.questions = contents.map((content, index) => {
                        const studentAnswersForQuestion = studentAnswers[index].split('￥！').map(answerPart => answerPart.split('￥？').map(part => String(part)));
                        return {
                            content,
                            studentAnswer: studentAnswersForQuestion.length > 1 ? studentAnswersForQuestion : studentAnswersForQuestion[0],
                            standardAnswer: stdAnswers[index] || '暂无',
                            everyScore: finalScores[index] || '暂无',
                        };
                    });
                } else {
                    console.error('Failed to fetch homework score');
                }
            })
            .catch((error) => {
                console.error('Error fetching homework score:', error);
            });
        },
        //提交修改后的信息
        toggleEditMode(){
            if(this.editing==true){
                if (this.chScore.some(score => score === null || score === undefined || score === '')) {
                    this.$message.error('有题目未完成打分，请检查并完成打分！');
                    return;
                }
                this.editing=!this.editing;
                this.formData.answerId = this.answerId;
                this.formData.ChangedScore = this.scoreList;
                this.formData.isAppealed = 2;
                
                let promise=dealAppealInfo({ "answerId": this.formData.answerId, "finalScore": this.formData.ChangedScore, "isAppealed": this.formData.isAppealed});
                promise.then((res)=>{
                    const {status} = res;
                    if(status){
                        this.$confirm('修改成绩成功，申诉已处理完成。', '提示', {
                            confirmButtonText: '确定',
                            callback: () => {
                                this.chScore = []; // 存储题目输入框的列表
                                this.questions = [];
                            }
                        });
                    }
                    else{
                        alert('修改成绩失败！', '提示', {
                            confirmButtonText: '确定',
                            callback: () => {
                                this.chScore = []; // 存储题目输入框的列表
                                this.questions = [];
                            }
                        });
                    }
                })
            }
            this.editing=!this.editing;
        },
        //取消修改
        toggleEditModeCancle(){
            this.editing = false;
            this.chScore = [];
        },
    }
}
</script>