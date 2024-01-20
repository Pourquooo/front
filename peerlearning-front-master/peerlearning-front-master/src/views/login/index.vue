<template>
  <div class="login-container">
    <vue-particles color="#eee" :particleOpacity="0.5" :particlesNumber="75" shapeType="circle" :particleSize="4"
      linesColor="#eee" :linesWidth="2" :lineLinked="true" :lineOpacity="0.4" :linesDistance="150" :moveSpeed="2"
      :hoverEffect="true" hoverMode="grab" :clickEffect="true" clickMode="push">
    </vue-particles>
    <div class="form">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on"
        label-position="left">
        <div class="title-container">
          <h3 class="title">胶SDN 登录系统</h3>
        </div>
        <el-form-item prop="userId" :style="{ paddingLeft: '10px', paddingRight: '10px' }">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input ref="userId" v-model="loginForm.userId" placeholder="学号" name="userId" type="text" tabindex="1"
            auto-complete="on" @input="handleInput"/>
        </el-form-item>
        <el-form-item prop="password" :style="{ paddingLeft: '10px', paddingRight: '10px' }">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType" placeholder="密码"
            name="password" tabindex="2" auto-complete="on" @keyup.enter.native="handleLogin" />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>

        <el-button type="text" style="width:5%;margin-bottom:5px;margin-top: -40px;margin-left: 40px;color: #d9bfa1;"
          @click.native.prevent="handleSign">sign in</el-button>
        <!-- <router-link to= '/sign'>
          <el-button type="text" style="width:5%;margin-bottom:5px;margin-top: -40px;" @click="$router.push('/sign')">sign in</el-button>
        </router-link > -->

        <el-button :loading="loading" type="primary"
          style="width:50%; margin-left: 65px;background-color: rgba(0, 0, 0, 0.5); border-color: #d9bfa1; color: #d9bfa1;"
          @click.native.prevent="handleLogin">Link
          Start!</el-button>
          <!-- <el-button type="text" style="width:5%;margin-bottom:5px;margin-top: -40px;margin-left: 40px;color: #d9bfa1;"
          @click.native.prevent="lanke">览客登录</el-button> -->
      </el-form>
    </div>
    
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import axios from "axios"
import Vue from 'vue'
import { useRouter } from 'vue-router'
import VueMarkdown from 'vue-markdown'

export default {
  name: 'Login',
  data () {
    const validateUserId = (rule, value, callback) => {
      if (!value)
      {
        callback(new Error('Please enter the correct user ID'))
      } else
      {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6)
      {
        callback(new Error('The password can not be less than 6 digits'))
      } else
      {
        callback()
      }
    }
    return {
      loginForm: {
        userId: '21301111',
        password: ''
      },
      loginRules: {
        userId: [{ required: true, trigger: 'blur' }, { validator: this.checkInteger, trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    checkInteger(rule, value, callback) {
      if (!value) {
        return callback();
      }
      if (!/^\d+$/.test(value)) {
        callback(new Error('学号只能是整数'));
      } else {
        callback();
      }
    },

    showPwd () {
      if (this.passwordType === 'password')
      {
        this.passwordType = ''
      } else
      {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    lanke(){
      this.loginForm.userId = 'lanke'
      this.loginForm.password = '123456'
      this.$refs.loginForm.validate(valid => {
        Vue.prototype.$userId = this.loginForm.userId;
        if (valid)
        {
          //在这里使用axio与后端对接,获得账号密码键值对,然后匹配,查看是否能够登录
          if (this.loginForm.password == '111111')
          {
            console.log("here")
            this.loading = true
            Vue.prototype.$userId = this.loginForm.userId;
            this.$store.dispatch('user/login', this.loginForm).then(() => {
              alert("登录成功")
              this.$router.push({ path: this.redirect || '/' })
              console.log('跳转后的路由地址:', this.$route.fullPath)
              this.loading = false
            }).catch((Error) => {
              this.loading = false
              alert(Error.message)
            })
          }
          else
          {
            this.loading = true
            this.$store.dispatch('user/login', this.loginForm).then(() => {
              alert("登录成功!")
              this.$router.push({ path: this.redirect || '/' })
              console.log('跳转后的路由地址:', this.$route.fullPath)
              this.loading = false
            }).catch((Error) => {
              this.loading = false
              alert(Error.message)
            })
          }
        } else
        {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleLogin () {
      this.$refs.loginForm.validate(valid => {
        Vue.prototype.$userId = this.loginForm.userId;
        if (valid)
        {
          //在这里使用axio与后端对接,获得账号密码键值对,然后匹配,查看是否能够登录
          if (this.loginForm.password == '111111')
          {
            this.loading = true
            Vue.prototype.$userId = this.loginForm.userId;
            this.$store.dispatch('user/login', this.loginForm).then((res) => {
              const { status, roleType } = res
              if (status){
                if (roleType == 0) {   //管理员登录
                  console.log("管理员")
                } else if (roleType == 1) {    //老师登录
                  console.log("老师")
                } else if (roleType == 2) {    //学生登录
                  console.log("学生")
                }
              }
              alert("登录成功")
              console.log(this.redirect)
              this.$router.push({ path: '/' })
              console.log('跳转后的路由地址:', this.$route.fullPath)
              this.loading = false
            }).catch((Error) => {
              this.loading = false
              alert(Error.message)
            })
          }
          else
          {
            this.loading = true
            this.$store.dispatch('user/login', this.loginForm).then((res) => {
              const { status, roleType } = res
             if (status) {
              alert("登录成功!")
                if (roleType == 0) {   //管理员登录
                  console.log("管理员")
                } else if (roleType == 1) {    //老师登录
                  console.log("老师")
                } else if (roleType == 2) {    //学生登录
                  console.log("学生")
                }
              }
              this.$router.push({ path: this.redirect || '/' })
              console.log(this.redirect)
              console.log('跳转后的路由地址:', this.$route.fullPath)
              this.loading = false
            }).catch((Error) => {
              this.loading = false
              alert(Error.message)
            })
          }
        } else
        {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleSign () {
      this.$router.push({ path: '/sign' })
      // console.log('跳转后的路由地址:', this.$route.fullPath)
    },
    show(){
      function clickEffect() {
        let balls = [];
        let longPressed = false;
        let longPress;
        let multiplier = 0;
        let width, height;
        let origin;
        let normal;
        let ctx;
        // const colours = ["#F73859", "#14FFEC", "#00E0FF", "#FF99FE", "#FAF15D"];
        const colours = ["#000", "#ffffff"];
        const canvas = document.createElement("canvas");
        document.body.appendChild(canvas);//创建画布
        canvas.setAttribute("style", "width: 100%; height: 100%; top: 0; left: 0; z-index: 99999; position: fixed; pointer-events: none;");
        const pointer = document.createElement("span");
        pointer.classList.add("pointer");
        document.body.appendChild(pointer);

        if (canvas.getContext && window.addEventListener) {
          ctx = canvas.getContext("2d");
          updateSize();
          window.addEventListener('resize', updateSize, false);
          loop();
          window.addEventListener("mousedown", function(e) {
            pushBalls(randBetween(10, 20), e.clientX, e.clientY);//球的个数和位置
            document.body.classList.add("is-pressed");
            longPress = setTimeout(function(){
              document.body.classList.add("is-longpress");
              longPressed = true;
            }, 500);
          }, false);
          window.addEventListener("mouseup", function(e) {
            clearInterval(longPress);
            if (longPressed == true) {
              document.body.classList.remove("is-longpress");
              pushBalls(randBetween(50 + Math.ceil(multiplier), 100 + Math.ceil(multiplier)), e.clientX, e.clientY);
              longPressed = false;
            }
            document.body.classList.remove("is-pressed");
          }, false);
          window.addEventListener("mousemove", function(e) {
            let x = e.clientX;
            let y = e.clientY;
            pointer.style.top = y + "px";
            pointer.style.left = x + "px";
          }, false);
        } else {
          console.log("canvas or addEventListener is unsupported!");
        }

        function updateSize() {
          canvas.width = window.innerWidth * 2;
          canvas.height = window.innerHeight * 2;
          canvas.style.width = window.innerWidth + 'px';
          canvas.style.height = window.innerHeight + 'px';
          ctx.scale(2, 2);
          width = (canvas.width = window.innerWidth);
          height = (canvas.height = window.innerHeight);
          origin = {
            x: width / 2,
            y: height / 2
          };
          normal = {
            x: width / 2,
            y: height / 2
          };
        }
        class Ball {
          constructor(x = origin.x, y = origin.y) {
            this.x = x;
            this.y = y;
            this.angle = Math.PI * 2 * Math.random();
            if (longPressed == true) {
              this.multiplier = randBetween(14 + multiplier, 15 + multiplier);
            } else {
              this.multiplier = randBetween(6, 12);
            }
            this.vx = (this.multiplier + Math.random() * 0.5) * Math.cos(this.angle);
            this.vy = (this.multiplier + Math.random() * 0.5) * Math.sin(this.angle);
            this.r = randBetween(2, 5) + 3 * Math.random();
            this.color = colours[Math.floor(Math.random() * colours.length)];
          }
          update() {
            this.x += this.vx - normal.x;
            this.y += this.vy - normal.y;
            normal.x = -2 / window.innerWidth * Math.sin(this.angle);
            normal.y = -2 / window.innerHeight * Math.cos(this.angle);
            this.r -= 0.3;
            this.vx *= 0.9;
            this.vy *= 0.9;
          }
        }

        function pushBalls(count = 1, x = origin.x, y = origin.y) {
          for (let i = 0; i < count; i++) {
            balls.push(new Ball(x, y));
          }
        }

        function randBetween(min, max) {
          return Math.floor(Math.random() * max) + min;
        }

        function loop() {
          ctx.fillStyle = "rgba(255, 255, 255, 0)";
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          for (let i = 0; i < balls.length; i++) {
            let b = balls[i];
            if (b.r < 0) continue;
            ctx.fillStyle = b.color;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2, false);
            ctx.fill();
            b.update();
          }
          if (longPressed == true) {
            multiplier += 0.2;
          } else if (!longPressed && multiplier >= 0) {
            multiplier -= 0.4;
          }
          removeBall();
          requestAnimationFrame(loop);
        }

        function removeBall() {
          for (let i = 0; i < balls.length; i++) {
            let b = balls[i];
            if (b.x + b.r < 0 || b.x - b.r > width || b.y + b.r < 0 || b.y - b.r > height || b.r < 0) {
              balls.splice(i, 1);
            }
          }
        }
      }
      clickEffect();//调用特效函数
    }
  },
  mounted() {
    this.show()
  },
  components:{
    VueMarkdown // 注入组件
  }
}
</script>

<style lang="scss">
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
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
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #eee;
$dark_gray: #889aa4;
$light_gray: #eee;


.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  background-size: 100% 100%;
  background-image: url(../../assets/background/1501683013732_.pic_hd.jpg);

  改背景在这里改 .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 25px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .form {
    background: #111111;
    height: 300px;
    width: 500px;
    opacity: 0.75;
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 10px;
  }
}
</style>
