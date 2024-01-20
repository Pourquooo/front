<template>
    <el-container style="border: 1px solid #eee">
        <el-container>
            <el-main>
                <div class="question-answer-list">
                    <div v-for="(items, index) in tableData.questions" :key="index" class="question-answer-item">
                    <div>
                        <div class="question-box" style="margin-bottom: 10px">
                        <span>{{ '第' + (index + 1) + '题' }}</span>
                        <div class="box-wrapper">
                            <span>{{ items.content }}</span>
                        </div>
                        </div>
                        <div class="question-box" style="margin-bottom: 10px">
                        <span>参考答案：</span>
                        <div class="box-wrapper">
                            <span v-if="!isUrl(tableData.stdAns[index].content)">{{ tableData.stdAns[index].content }}</span>
                            <img v-else :src="tableData.stdAns[index].content" alt="答案图片" class="answer-image">
                        </div>
                        </div>
                        <div class="answer-box" style="margin-bottom: 5px">
                        <span>回答：</span>
                        <div v-for="(value, subIndex) in tableData.answers[index].content" :key="subIndex" style="margin-bottom: 5px;">
                          <span v-if="!isUrl(value.content)">{{ value.content }}</span>
                          <img v-else :src="value.content" alt="答案图片" style="object-fit: contain; width: 80%; height: 200px;">
                        </div>
                        </div>
                        <div class="line" style="margin-top: 10px; margin-bottom: 10px;"></div>
                    </div>
                    </div>
                </div>
                <div class="additional-info">
                    <div class="info-item">
                        GPT 相似度：{{ tableData.gptSim !== null ? tableData.gptSim : 'null' }}
                    </div>
                    <div class="info-item">
                        其他相似度：{{ tableData.otherSim !== null ? tableData.otherSim : 'null' }}
                    </div>
                    <div class="info-item">
                        评论：{{ tableData.comments !== null ? tableData.comments : 'null' }}
                    </div>
                </div>
                <div class="gpt-result">
                    <el-button type="primary" @click="gptCheck">GPT查重</el-button>
                    <el-input v-model="gptCheckMsg" :rows="5" placeholder="GPT查重结果" style="margin-left: 10px; margin-right: 10px;"></el-input>
                </div>
                <div class="similar-result">
                    <el-button type="primary" @click="similarCheck">相似度查重</el-button>
                    <el-input v-model="similarCheckMsg" :rows="5" placeholder="相似度查重结果" style="margin-left: 10px; margin-right: 10px;"></el-input>
                </div>
                <div class="scored">
                    <el-button type="primary" @click="preScore">智能预打分</el-button>
                </div>
                <div class="content">
                    <pre>{{ this.preScoredResult }}</pre>
                </div>
            </el-main>
        </el-container>
    </el-container></template>
<style>
.el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
}

.el-aside {
    color: #333;
}

.box-wrapper {
   width: 80vw; /* 设置矩形框的宽度为屏幕宽度 */
  max-height: 80vh; /* 设置矩形框的最大高度为屏幕高度的80%，可根据需要调整 */
  overflow-y: auto; /* 当内容超过框的尺寸时显示垂直滚动条 */
  border: 1px solid #ccc; /* 边框样式，可根据需要调整 */
}
.gpt-result{
    display: flex;
    align-items: center;
    margin-top: 10px;
}
.similar-result{
    display: flex;
    align-items: center;
    margin-top: 10px;
}
.scored{
    display: flex;
    align-items: center;
    margin-top: 10px;
}
.content{
    display: flex;
    align-items: center;
    margin-top: 10px;
}
</style>


<script>
import { getAnsDetail,preScored } from '@/api/teacher';
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import Quill from 'quill';
import { setAssignment, getGptCheck, getSimilarCheck} from '@/api/assignment';
import Router from 'vue-router';
export default {
    data() {
        return {
            router: Router,
            show: false,
            score: 0,
            canCheck: true,
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
            answerId: this.$route.query.answerId,
            homeworkId: this.$route.query.homeworkId,
            //查重返回
            gptCheckMsg: '',
            similarCheckMsg: '',
            //智能预打分返回
            preScoredResult: [],
        };
    },
    computed: {
        totalScore() {
            if (this.tableData.answers) {
                this.score = this.tableData.answers.reduce((sum, answer) => Number(sum) + (Number(answer.score) || 0), 0);
                return this.score
            } else {
                return 0; // 如果 answers 不存在或不是数组，返回默认值 0
            }
        }
    },
    components: {
        quillEditor // 富文本编辑器
    },
    mounted() {
        // 监听窗口大小变化
        window.addEventListener('resize', this.setSidebarHeight);
        this.setSidebarHeight();
        this.updateInformation();
    },
    beforeDestroy() {
        // 在组件销毁前移除窗口大小变化的监听器
        window.removeEventListener('resize', this.setSidebarHeight);
    },
    methods: {
        changeShow() {
            this.show = false;
        },
        setSidebarHeight() {
            // 获取窗口的视口高度
            const windowHeight = window.innerHeight;

            // 设置侧边栏的高度
            this.sidebarHeight = windowHeight;

            this.$nextTick(() => {
                const sidebar = this.$refs.sidebar;
                if (sidebar) {
                    sidebar.style.height = `${windowHeight}px`;
                }
            });
        },
        isUrl(string) {
            try {
                new URL(string);
                return true;
            } catch (err) {
                return false;
            }
        },
        uploadInformation() {
            //上传批改信息
            if (!this.canCheck) {
                alert('已完成批改，不可重复提交')
            } else {
                // 检查是否每个题目都有分数
                const allAnswered = this.tableData.answers.every(answer => answer.score !== undefined && answer.score !== null && answer.score !== '');

                if (allAnswered) {
                    const allScores = this.tableData.answers.map(answer => answer.score.toString());
                    const scoresString = allScores.join('￥！');
                    console.log("scoreString", scoresString)
                    let promise = setAssignment({ 'grade': scoresString, 'assignmentId': this.assignmentId, 'comments': this.comments })
                    console.log({ 'grade': this.totalScore, 'assignmentId': this.assignmentId, 'comments': this.comments })
                    promise.then((res) => {
                        const { status } = res;
                        if (status) {
                            alert('提交成功')
                        } else {
                            const { description } = res;
                            alert(description)
                        }
                    })

                } else {
                    alert("请先批改完所有题目")
                }
            }
        },
        updateInformation(){
            let promise = getAnsDetail({'answerId':this.answerId});
            promise.then((res)=>{
                const {status} = res;
                if(status){
                    const { data } = res;
                    const data_1 = data[0];
                    let processData = {
                        answers : data_1['answerData']['answer'],
                        finalScore: data_1['answerData']['finalScore'],
                        gptSim: data_1['answerData']['gptSim'],
                        otherSim: data_1['answerData']['otherSim'],
                        comments: data_1['comments'],
                        questions: data_1['homeworkData']['content'],
                        stdAns: data_1['homeworkData']['stdAns'],
                    }

                    // processData['answers'] = processData['answers'].split('￥！').map((value, index) => ({ id: index, content: value, score: '' }))
                    processData["answers"] = processData['answers'].split('￥！').map((value, index) => ({ id: index, content: value.split('￥？').map((value, index) => ({ id: index, content: value })), score: '' }))
                    processData['questions'] = processData['questions'].split('￥！').map((value, index) => ({ id: index, content: value, score: '' }))
                    processData['stdAns'] = processData['stdAns'].split('￥！').map((value, index) => ({ id: index, content: value, score: '' }))
                    this.tableData = processData
                    console.log(this.tableData)
                }else{
                    const {description} = res;
                    alert(description)
                }
            })
        },
        //查看GPT查重结果
        gptCheck(){
            getGptCheck({"answerId": this.answerId})
            .then(response => {
                this.gptCheckMsg = response.description;
                console.log("查重结果：", this.gptCheckMsg);
            })
            .catch((error) => {
                console.error('Error :', error);
            });
        },
        //查看相似度查询结果
        similarCheck(){
            getSimilarCheck({"answerId": this.answerId})
            .then(response => {
                this.similarCheckMsg = response.description;
                console.log("查重结果：", this.similarCheckMsg);
            })
            .catch((error) => {
                console.error('Error :', error);
            })
        },
        //点击查看预打分结果
        preScore(){
            preScored({"homeworkId": this.homeworkId,"answerId": this.answerId})
            .then((res) => {
                const { status, data } = res;
                if (status) {
                    const scoredResult = data[0].result;
                    this.preScoredResult = scoredResult.replace(/\n+/g, '\n')
                    // const scoredResult = data[0].result.split('\n');
                    // this.preScoredResult = scoredResult.map(results => {
                    //     // 清除 HTML 标签，仅获取纯文本内容
                    //     const cleanResult = results.replace(/<\/?[^>]+(>|$)/g, '');
                    //     return cleanResult.trim(); // 去除首尾空格
                    // }).filter(results => results !== '');
                    console.log(this.preScoredResult);
                    console.log("成功获得预打分结果");
                }
                else{
                    console.log("Error");
                }
            })
            .catch((error) => {
                console.log('Error:',error);
            })
        }
        // async preScore(){
        //     try {
        //         console.log("调用接口前");
        //         // 将问题发送到后端并等待响应
        //         const response = await preScored({"homeworkId": this.homeworkId,"answerId": this.answerId});
        //         console.log("调用接口后");
        //         console.log(response);
        //         // 处理响应
        //         this.preScoredResult = response.result;
        //         console.log(this.preScoredResult);
        //     } catch (error) {
        //         console.error('无法获取预打分结果:', error);
        //         throw error;
        //     }
        // },
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


