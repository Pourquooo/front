<template>
    <el-container>

        <!-- 标题 -->
        <el-header style="display: flex; justify-content: flex-start; align-items: center; text-align: left; font-size: 16px; height: 100px;">
            <div style="margin-left: 10px;">
                <h1 style="font-size: 25px;">{{ this.homeworkTitle }} - 批改情况</h1>
            </div>
        </el-header>

        <el-container>

            <!-- 边框 -->
            <el-aside width="400px" style="background-color: rgb(238, 241, 246)">

                <h2 style="margin-left: 25px;">AI询问</h2>
                <el-form ref="questionForm" :model="questionForm" label-width="80px">
                    <el-form-item label="问题" style="margin-left: 0px;margin-right: 20px;">
                        <el-input v-model="questionForm.question" placeholder="请输入您的问题"></el-input>
                        <el-button type="primary" @click="submitQuestion" style="margin-top: 10px;">提交</el-button>
                    </el-form-item>
                </el-form>

                <!-- 显示AI作答的区域 -->
                <div class="chat-container" v-if="chatMessages.length > 0">
                    <div v-for="(message, index) in chatMessages" :key="index" class="chat-message" :class="{ 'user-message': message.isUser }">
                        <p v-if="message.type === 'question'" style="font-weight: bold;">问题：{{ message.content }}</p>
                        <p v-else-if="message.type === 'answer'" style="font-weight: bold;">AI回答：{{ message.content }}</p>
                    </div>
                </div>

            </el-aside>

            <el-container>

                <!-- 主体 -->
                <!-- <el-main style="padding-left: 50px; padding-right: 50px;"> -->
                <el-main>

                    <!-- 作业部分 -->
                    <div style="padding-left: 50px; padding-right: 50px;">
                        <h2 style="margin-top: 10px; margin-bottom: 15px;">作业内容</h2>

                        <!-- 显示答案 -->
                        <el-collapse v-model="activeNames" accordion>
                            <el-collapse-item  v-for="(item, index) in questions" :title="item.content" :name="index.toString()">
                                <div>
                                    <h3>学生答案：</h3>
                                    <div v-if="Array.isArray(item.studentAnswer)">
                                        <div v-for="(answer, answerIndex) in item.studentAnswer" :key="answerIndex">
                                            <div v-if="isUrl(answer)">
                                                <img :src="answer" alt="我的答案" style="max-width: 100%; height: auto;" />
                                            </div>
                                            <p v-else>{{ answer }}</p>
                                        </div>
                                        <p v-if="item.studentAnswer.length === 0">本题暂无学生答案</p>
                                    </div>
                                    <div v-else-if="isUrl(item.studentAnswer)">
                                        <img :src="item.studentAnswer" alt="我的答案" style="max-width: 100%; height: auto;" />
                                    </div>
                                    <p v-else-if="item.studentAnswer">{{ item.studentAnswer }}</p>
                                    <p v-else>本题暂无学生答案</p>
                                </div>
                                <h3>标准答案：</h3>
                                <div v-if="isUrl(item.standardAnswer)">
                                    <img :src="item.standardAnswer" alt="standard Answer" style="max-width: 100%; height: auto;" />
                                </div>
                                <p v-else-if="item.standardAnswer">{{ item.standardAnswer }}</p>
                                <p v-else>本题暂无暂无标准答案</p>
                                <h3>分数：</h3>
                                <p v-if="item.everyScore">{{ item.everyScore }}分</p>
                                <p v-else>本题暂无分数</p>
                            </el-collapse-item>
                        </el-collapse>

                        <!-- 总成绩与评价 -->
                        <div>
                            <p>总分: {{ finalScore }}分</p>
                            <h3>评价：</h3>
                            <p v-for="(comment, index) in comments" :key="index">{{ comment }}</p>
                        </div>
                    </div>

                    <!-- 申述部分 -->
                    <div class="Qscore" style="padding-left: 50px; padding-right: 50px;">
                        <el-button type="primary" @click="openAppealDialog">申诉</el-button>
                        <!--  申诉对话框 -->
                        <el-dialog title="申诉" :visible.sync="appealDialogVisible" width="60%" :before-close="handleAppealClose">
                            <el-form ref="appealForm" :model="appealForm" label-width="80px">
                                <el-form-item label="申诉内容">
                                    <el-input type="textarea" v-model="appealForm.appealContent" placeholder="请输入您的申诉内容"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="submitAppeal">提交</el-button>
                                </el-form-item>
                            </el-form>
                        </el-dialog>
                    </div>

                    <el-divider></el-divider>

                    <!-- 评论区 -->
                    <div >
                        <h2 style="margin-left: 50px;margin-top: 30px; margin-bottom: 10px;">讨论区</h2>
                        <el-divider></el-divider>
                        <!-- 发布评论 -->
                        <div style="margin-top: 30px; margin-bottom: 20px; margin-left: 50px; margin-right: 20px;">
                            <quill-editor v-model="comment" :options="editorOption"></quill-editor>
                            <el-button @click="publishComment" style="display:block;margin:0 auto;margin-top: 10px; margin-bottom: 20px;">发布评论</el-button>
                        </div>

                        <!-- 显示评论 -->
                        <div style="margin-left: 50px; margin-right: 20px; margin-top: 20px;">
                            <div v-for="(items,index) in formData" :key="index">
                                <el-divider></el-divider>
                                <div>
                                    <p>{{ items.commentId }} 楼</p>
                                    <h3>用户号：{{ items.userId }}</h3>
                                    <h3>用户名：{{ items.userName }}</h3>
                                    <p>评论：{{ items.content }}</p>
                                    <el-button v-if="items.userId === user.userId" type="danger" class="el-icon-delete" @click="deleteComm(items.commentId)">删除评论</el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-main>

            </el-container>

        </el-container>

    </el-container>
</template>

<script>
  import {getHomeworkScore, postAppeal, postQuestion} from '@/api/record';
  import { addComment, getComment, deleteComment } from '@/api/comment';
  //富文本编辑器
  import { quillEditor } from 'vue-quill-editor';
  import 'quill/dist/quill.core.css';
  import 'quill/dist/quill.snow.css';
  import 'quill/dist/quill.bubble.css';
  import Quill from 'quill';
  
  export default {
    data() {
      return {
        user: this.$store.state.user,//用户身份
        homeworkid: null,
        answerid: null,
        homeworkTitle: null,
        //从后端获取到的数据
        finalScore: '',
        comments: '',
        questions: {},
        activeNames: [], 
        //从上一页面接受的数据
        defaultOpeneds : 0,
        //AI询问有关数据
        dialogVisible: false,
        chatMessages: [],
        questionForm: {
            question: '',
        },
        AIanswer: '',
        //申诉有关数据
        appealDialogVisible: false,
        appealForm: {
            appealContent: '',
        },
        appealResult: '',
        //评论区数据
        //发布评论
        comment: '',//输入的数据
        commentId: '',//获取到的评论号
        commentResult: '',//评论发布结果
        //对富文本编辑器的修改
        editorOption: {
            placeholder: '请输入评论',
            theme: 'snow',
            // 其他选项...
        },
        //显示评论
        formData: [],
        //删除评论结果
        deleteResult: '',
      };
    },
    components: {
        quillEditor // 富文本编辑器
    },
    mounted() {
        this.homeworkid = this.$route.query.homeworkId;
        this.answerid = this.$route.query.answerId;
        this.homeworkTitle = this.$route.query.homeworkDes;
        // console.log("接受到的作业号：");
        // console.log(this.homeworkid);
        console.log("接收到的答案号：")
        console.log(this.answerid);
        // console.log("接收到的作业名称：")
        // console.log(this.homeworkTitle);
        this.fetchAnswer(this.answerid);
        this.initializeEditor();
        //显示评论
        this.showComment();
    },
    methods: {
        initializeEditor() {
            this.editor = new Quill('#editor-container', {
                theme: 'snow' // 使用 snow 主题，即默认主题
            });
        },

        //向后端请求答案数据
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
        //判断是否是图片
        // isImage(url) {
        //     return /\.(jpeg|jpg|gif|png|svg)$/i.test(url);
        // },
        isUrl(string) {
            try {
                new URL(string);
                return true;
            } catch (err) {
                return false;
            }
        },
        //AI询问数据传输
        async submitQuestion() {
            try {
                const userQuestion = this.questionForm.question;
                this.questionForm.question = '';
                // 将用户问题添加到chatMessages
                this.chatMessages.push({ content: userQuestion, isUser: true, type: 'question' });
                // 将问题发送到后端并等待响应
                const response = await postQuestion({ "question": userQuestion }, { timeout: 10000 });
                // 处理响应
                this.AIanswer = response.data;
                console.log(this.AIanswer);
                // 将AI回答添加到chatMessages
                this.chatMessages.push({ content: this.AIanswer, isUser: false, type: 'answer' });
            } catch (error) {
                console.error('提交问题时出错:', error);
            }
            this.questionForm.question='';
        },
        //打开申诉窗口
        openAppealDialog() {
            this.appealDialogVisible = true;
            this.appealForm.appealContent=[];
        },
        handleAppealClose(done) {
            this.appealDialogVisible = false;
            this.$nextTick(() => {
                done();
            });
        },
        //提交申诉，向后端传输数据
        submitAppeal(){
            // 向后端提交申诉内容
            const appealContent = this.appealForm.appealContent;
            this.appealForm.appealContent='';
            postAppeal({ "answerId": this.answerid, "complaint": appealContent})
            .then(response => {
                this.appealResult = response.description;
                alert(this.appealResult);
            })
            .catch((error) => {
                alert("申诉未成功提交。")
                console.error('Error submitting appeal:', error);
            });
        },
        //发布评论
        publishComment(){
            //从富文本编辑器中获取 HTML 字符串
            const rawComment = this.comment;
            this.comment = '';
            //使用 DOMParser 将 HTML 字符串解析为 DOM 对象
            const parser = new DOMParser();
            const doc = parser.parseFromString(rawComment, 'text/html');
            //获取解析后的纯文本内容
            const plainTextComment = doc.body.textContent || "";
            const cleanedComment = plainTextComment.replace(/\n|\r|\s+/g, ' ').trim();

            addComment({"homeworkId": this.homeworkid, "userId": this.user.userId, "content": cleanedComment})
            .then(response => {
                this.commentResult = response.description;
                alert(this.commentResult);
            })
            .catch((error) => {
                alert("评论发布失败。")
                console.error('Error submitting comment:',error);
            })
        },
        //显示评论
        showComment(){
            getComment({"homeworkId": this.homeworkid})
            .then(response => {
                const { status, data } = response;
                if (status){
                    this.formData=data[0].comments;

                }else{
                    console.error('Failed to get comments.');
                }
            })
            .catch((error) => {
                console.error('Error getting comments:', error);
            });
        },
        deleteComm(commentid){
            deleteComment({"commentId": commentid})
            .then(response =>{
                this.deleteResult = response.description;
                alert(this.deleteResult);
            })
            .catch((error) => {
                console.error('Error deleting comments:',error);
            })
        },
    }
  };
  </script>

<style lang="scss" scoped>
::v-deep .el-collapse-item__header{
          color: rgba(46, 100, 134, 0.893);
          font-size: 20px;
          font-weight: bold;
          position: relative;
        }

</style>