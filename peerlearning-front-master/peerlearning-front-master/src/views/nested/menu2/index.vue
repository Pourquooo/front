<template>
  <div class="changePassword">
    <div class="lizi">
      <vue-particles color="#eee" :particleOpacity="0.5" :particlesNumber="75" shapeType="circle" :particleSize="4"
        linesColor="#eee" :linesWidth="2" :lineLinked="true" :lineOpacity="0.4" :linesDistance="150" :moveSpeed="2"
        :hoverEffect="true" hoverMode="grab" :clickEffect="true" clickMode="push">
      </vue-particles>
    </div>
    <section class="form">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" autocomplete="off"
        :hide-required-asterisk="true" size="medium" class="form">
        <div style="padding-top:50px">
          <el-form-item label="密码" prop="pwd">
            <el-col :span="parseInt(20)">
              <el-input v-model.trim="ruleForm.pwd" type="password" />
            </el-col>
          </el-form-item>
          <el-form-item label="确认密码" prop="cpwd">
            <el-col :span="parseInt(20)">
              <el-input v-model.trim="ruleForm.cpwd" type="password" />
            </el-col>
          </el-form-item>
          <el-form-item style="margin-left:50px">
            <el-button type="primary"
              style="width:50%; margin-left: 30px;background-color: rgba(0, 0, 0, 0.5); border-color: #d9bfa1; color: #d9bfa1;"
              @click.prevent.native="change">
              修改密码
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </section>
  </div>
</template>

<script>
import { altInform } from '@/api/user'
import store from '@/store'
export default {
  name: 'changePassword',
  data () {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6)
      {
        callback(new Error('密码长度不能小于6位'))
      } else
      {
        callback()
      }
    }
    return {
      user: this.$store.state.user,
      ruleForm: {
        pwd: '',
        cpwd: '',
      },
      rules: {
        pwd: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { validator: validatePassword, trigger: 'blur' }
        ],
        cpwd: [
          { required: true, message: '请确认新密码', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value !== this.ruleForm.pwd)
              {
                callback(new Error('两次输入的密码不一致'))
              } else
              {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    change () {
      if(store.getters.enable == 3){
        this.$message({
          message: '无法修改览客密码',
          type: 'error'
        })
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid)
        {
          const { pwd } = this.ruleForm
          const userId = this.user.userId;
          const userName = this.user.userName;
          const email = this.user.email;
          const userFace = this.user.avatar;
          const roleType = this.user.roleType;
          const banji = this.user.class;
          console.log(userName, userId, email, roleType, userFace, banji)
          altInform({ password: pwd , userId, userFace, userName, email, roleType, "class":banji }).then(res => {
            // 成功修改密码后的处理逻辑
            const {status} = res;
            if(status){
              alert('密码修改成功')
              console.log('password changed successfully')
            }else{
              const{description} = res;
              alert(description)
            }
            
          }).catch(err => {
            // 修改密码失败的处理逻辑
            alert('密码修改失败')
            console.error(err)
          })
        } else
        {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
.lizi {
  position: absolute;
  /* height: 900; */
  left: 0%;
  right: 0%;
  bottom: 0%;
  top: 0%;
}

.form {
  background: #111111;
  height: 200px;
  width: 600px;
  opacity: 0.75;
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 10px;
}

.changePassword {
  background-image: url(../../../assets/background/pp.jpg);
  background-size: 100%;
  height: 800px;
  overflow: hidden;
  bottom: 0%;
}
</style>
