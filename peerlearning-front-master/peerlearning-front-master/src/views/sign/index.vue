<template>
    <div class="register-container">
        <div class="lizi">
            <vue-particles color="#eee" :particleOpacity="0.5" :particlesNumber="75" shapeType="circle" :particleSize="4"
                linesColor="#eee" :linesWidth="2" :lineLinked="true" :lineOpacity="0.4" :linesDistance="150" :moveSpeed="2"
                :hoverEffect="true" hoverMode="grab" :clickEffect="true" clickMode="push">
            </vue-particles>
        </div>
        <article class="header">
            <header>
                <el-avatar icon="el-icon-user-solid" shape="circle" />
                <span class="login">
                    <em class="bold">已有账号？</em>
                    <a href="/login">
                        <el-button type="primary" size="mini">登录</el-button>
                    </a>
                </span>
            </header>
        </article>
        <section class="'form'">
            <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" autocomplete="off"
                :hide-required-asterisk="true" size="medium" class="form">
                <div style="padding-top: 10px">
                    <el-form-item label="学号" prop="userId">
                        <el-col :span="18">
                            <el-input v-model="ruleForm.userId" placeholder="请输入您的学号" />
                        </el-col>
                    </el-form-item>

                    <el-form-item label="姓名" prop="userName">
                        <el-col :span="18">
                            <el-input v-model="ruleForm.userName" placeholder="请输入您的姓名" />
                        </el-col>
                    </el-form-item>

                    <el-form-item label="邮箱" prop="email">
                        <el-col :span="18">
                            <el-input v-model="ruleForm.email" placeholder="请输入您的邮箱" />
                        </el-col>
                    </el-form-item>
                    <el-form-item label="验证码" prop="code">
                        <el-col :span="18">
                            <el-input v-model="ruleForm.code" maxlength="4" placeholder="请输入验证码" />
                        </el-col>
                        <el-col :span="5">
                            <div class="login-code" width="100%" @click="refreshCode">
                                <!--验证码组件-->
                                <s-identify :identifyCode="identifyCode" style="margin-top: 4px"></s-identify>
                            </div>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="密码" prop="pwd">
                        <el-col :span="18">
                            <el-input v-model="ruleForm.pwd" type="password" />
                        </el-col>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="cpwd">
                        <el-col :span="18">
                            <el-input v-model="ruleForm.cpwd" type="password" />
                        </el-col>
                    </el-form-item>
                    <el-form-item style="margin-left: 50px">
                        <el-button type="primary"
                            style="width:50%; margin-left: -10px;background-color: rgba(0, 0, 0, 0.5); border-color: #d9bfa1; color: #d9bfa1;"
                            @click="register">
                            注册
                        </el-button>
                    </el-form-item>
                </div>
            </el-form>
        </section>

        <div class="error">{{ error }}</div>
    </div>
</template>

<script>
import Vue from 'vue'
import VueParticles from 'vue-particles'
Vue.use(VueParticles)
import SIdentify from './verify.vue';
import { register } from '@/api/register'
// import { encrypt } from '@/utils/rsaEncrypt'
// import identify from '@/views/verifyCode/index.vue'
export default {
    name: 'register',
    components: { SIdentify },
    data() {
        return {
            statusMsg: '',
            error: '',
            isDisable: false,
            codeLoading: false,
            ruleForm: {
                userName: '',
                userId: '',
                email: '',
                code: '',
                pwd: '',
                cpwd: ''
            },

            identifyCodes: '1234567890abcdefjhijklinopqrsduvwxyz',//随机串内容
            identifyCode: '',

            rules: {
                email: [{
                    required: true,
                    type: 'email',
                    message: '请输入正确的邮箱',
                    trigger: 'blur'
                }],
                userName: [{
                    required: true,
                    type: 'string',
                    message: '请输入姓名',
                    trigger: 'blur'
                }],
                userId: [{
                    required: true,
                    type: 'string',
                    message: '请输入学号',
                    trigger: 'blur'
                }],
                code: [{
                    required: true,
                    type: 'string',
                    message: '请输入验证码',
                    trigger: 'blur'
                }],
                pwd: [{
                    required: true,
                    message: '创建密码',
                    trigger: 'blur'
                }, { pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/, message: '密码必须同时包含数字与字母,且长度为 6-20位' }],
                cpwd: [{
                    required: true,
                    message: '确认密码',
                    trigger: 'blur'
                }, {
                    validator: (rule, value, callback) => {
                        if (value === '') {
                            callback(new Error('请再次输入密码'))
                        } else if (value !== this.ruleForm.pwd) {
                            callback(new Error('两次输入密码不一致'))
                        } else {
                            callback()
                        }
                    },
                    trigger: 'blur'
                }]
            },
        }
    },

    mounted() {
        // 初始化验证码
        this.identifyCode = ''
        this.makeCode(this.identifyCodes, 4)
    },

    methods: {
        // 重置验证码
        refreshCode() {
            this.identifyCode = ''
            this.makeCode(this.identifyCodes, 4)
        },
        makeCode(o, l) {
            for (let i = 0; i < l; i++) {
                this.identifyCode += this.identifyCodes[this.randomNum(0, this.identifyCodes.length)]
            }
        },
        randomNum(min, max) {
            return Math.floor(Math.random() * (max - min) + min)
        },


        // 用户注册
        register: function () {

            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                     //验证码验证
                    if (this.ruleForm.code.toLowerCase() !== this.identifyCode.toLowerCase()) {
                        this.$message.error('请填写正确验证码')
                        this.refreshCode()
                        return
                    }
                    let aData = new Date();
                    var month = 1 + aData.getMonth();
                    if (month.toString().length == 1) {
                        month = "0" + month;
                    }
                    console.log(month);
                    const user = {
                        userName: this.ruleForm.userName,
                        userId: this.ruleForm.userId,
                        email: this.ruleForm.email,
                        password: this.ruleForm.pwd,
                        session_id: ''
                        // regtime: aData.getFullYear() + "-" + month + "-" + aData.getDate() + " " + aData.getHours() + ":" + aData.getMinutes() + ":" + aData.getSeconds()
                    }
                    register(user).then(res => {
                        const {status} = res
                        console.log(res)
                        if(status){
                            this.$message({
                                showClose: true,
                                message: '注册成功，正在跳转到登录界面...',
                                type: 'success'
                            })
                            setTimeout(() => {
                                this.$router.push('/')
                            }, 2000)
                        }else{
                            this.$message({
                                message: '注册失败',
                            })
                        }
                    }).catch(err => {
                        this.$message.error(err.response.data.message)
                        console.log(err.response.data.message)
                    })
                }
            })
        },

        videoCut() {

            $('video').on('loadedmetadata', function (event) {

                var duration = Math.ceil(this.duration)

                this.currentTime = Math.round(Math.random() * duration)

            })
        }
    }

}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .register-container .el-input input {
        color: $cursor;
    }
}

.form {
    background: #111111;
    height: 495px;
    width: 500px;
    opacity: 0.75;
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 10px;
}

/* reset element-ui css */
.register-container {
    .el-input {
        display: inline-block;
        height: 47px;
        width: 95%;

        input {
            background: rgba(0, 0, 0, 0.1);
            border-radius: 5px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            -webkit-appearance: none;
            padding: 12px 5px 12px 15px;
            color: $light_gray;
            height: 47px;
            caret-color: $cursor;

            &:-webkit-autofill {
                box-shadow: 0 0 0px 1000px $bg inset !important;
                -webkit-text-fill-color: $cursor !important;
            }
        }
    }

    .el-form-item {
        label {
            font-style: normal;
            font-size: 12px;
            color: $light_gray;
        }
    }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.register-container {
    background-image: url(../../assets/background/1501683013732_.pic_hd.jpg);
    background-size: 100% 100%;
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;
    bottom: 0%;

    .header {
        border-bottom: 2px solid rgb(235, 232, 232);
        opacity: 75%;
        min-width: 980px;
        color: #666;

        header {
            margin: 0 auto;
            padding: 10px 0;
            width: 980px;

            .login {
                float: right;
            }

            .bold {
                font-style: normal;
                color: $light_gray;
            }
        }
    }

    >section {
        margin: 0 auto 30px;
        padding-top: 30px;
        width: 980px;
        min-height: 300px;
        padding-right: 100px;
        box-sizing: border-box;

        .status {
            font-size: 12px;
            margin-left: 20px;
            color: #e6a23c;
        }

        .error {
            color: red;
        }
    }

    .tips {
        float: right;
        font-size: 14px;
        color: #fff;
        margin-bottom: 10px;

        span {
            &:first-of-type {
                margin-right: 16px;
            }
        }
    }

    .form {
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>

<style scoped>
/* 修改验证器样式 */
::v-deep .el-form-item.is-error .el-input__inner {
    border-color: #889aa4;
}

.lizi {
    position: absolute;
    left: 0%;
    right: 0%;
    top: 0%;
    bottom: 0%;
}


::v-deep .el-form-item.is-error .el-input__validateIcon {
    color: #889aa4;
}

::v-deep .el-form-item__error {
    color: #e6a23c;
}

#v_container {

    width: auto;

    height: auto;

    display: inline-flex;

    position: relative;

    top: 1rem;

    margin-top: -2rem;

}
</style>
