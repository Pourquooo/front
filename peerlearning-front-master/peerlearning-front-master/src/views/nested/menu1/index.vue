<template>
  <div :gutter="20" class="app-container" type="flex" align="middle">
    <div :xs="24" :sm="24" :md="10" :lg="9" :xl="8" style="margin-bottom: 10px" align="middle">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>
            <h3>个人信息</h3>
          </span>
        </div>
        <div>
          <div style="text-align: center">
            <div class="el-upload">
              <myUpload v-model="showDialog" :modelValue.sync="imagecropperShow" @crop-success="cropSuccess" />
              <img :src="currentAvatar || Avatar" title="点击上传头像" class="avater" @click="toggleShow"
                style="width:100px; height:100px; border-radius:50%; ">
            </div>
            <div class="user-info">
              <li>
                <div style="height: 100%;">
                  <i class="el-icon-user" /> 登录账号
                  <div class="user-right">{{ user.userId }}</div> <!--user.id-->
                </div>
              </li>

              <li>
                <div style="height: 100%;">
                  <i class="el-icon-picture-outline-round" /> 用户昵称
                  <div class="user-right">{{ this.newUserName ? this.newUserName : user.userName }}</div>
                  <!-- user.username -->
                </div>
              </li>

              <li>
                <div style="height: 100%;">
                  <i class="el-icon-s-custom" /> 身份
                  <div class="user-right">{{ mapping(user.roleType) }}</div> <!--//user.phoneNumber-->
                </div>
              </li>

              <li>
                <div style="height: 100%;">
                  <i class="el-icon-s-promotion" /> 邮箱
                  <div class="user-right">{{ this.newEmail ? this.newEmail : user.email || 'xxxxxx@12.com' }}</div>
                  <!--//user.phoneNumber-->
                </div>
              </li>

              <li>
                <div style="height: 100%;">
                  <i class="el-icon-s-home" /> 班级
                  <div class="user-right">{{ user.class }}</div> <!--//user.phoneNumber-->
                </div>
              </li>

              <li>
                  <div style="height: 100%;">
                    <i class="el-icon-s-check" /> 偏见权重
                    <div class="user-right">{{ user.rightnessWeight }}</div> <!--user.id-->
                  </div>
                </li>

                <li>
                    <div style="height: 100%;">
                      <i class="el-icon-s-check" /> 表现权重
                      <div class="user-right">{{ user.performanceWeight }}</div> <!--user.id-->
                    </div>
                  </li>

                  <li>
                    <div style="height: 100%;">
                      <i class="el-icon-s-check" /> 参与度权重
                      <div class="user-right">{{ user.engagementWeight }}</div> <!--user.id-->
                    </div>
                  </li>
            </div>
            <div>
              <el-button type="primary" icon="el-icon-edit" style="margin-top:20px" @click="changeDiage"></el-button>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <!-- email对话框 -->
    <el-dialog title="修改邮箱" :visible.sync="showDialog_change" @close="closeDialog">
      <el-input v-model="newUserName" placeholder="请输入新的昵称(不改可不填)"></el-input>
      <el-input v-model="newEmail" placeholder="请输入新的邮箱地址(不改可不填)"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateEmail">确认</el-button>
        <el-button @click="closeDialog">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import myUpload from 'vue-image-crop-upload'
const qiniu = require('qiniu-js');
import { getSingleInfo } from '@/api/user'
import avatar from '../../../assets/images/avatar.png'
import { changeface } from '@/api/user';
import { altInform } from '@/api/user'
import vue from 'vue'
import { uploadImage } from '@/utils/uploadImage';
// import user from 'mock/user';


export default {
  name: 'Center',
  components: { myUpload },
  data() {
    return {
      showDialog_change: false, // 控制对话框显示与隐藏
      newEmail: '', // 存储新邮箱地址的数据属性
      showDialog: false,
      imagecropperShow: false,
      user: this.$store.state.user,
      Avatar: this.$store.state.user.avatar || avatar,
      currentAvatar: '',
      userName: '',
      roleMapping: { 0: '管理员', 1: '老师', 2: '学生', 3: '助教', 4: '访客' },
      newUserName: ''
    }
  },
  async created() {
    const res = await getSingleInfo({ 'userId': this.user.userId })
    this.user = res.data[0]
    console.log("个人信息：", this.user)
  },
  // async changeAvatar(param) {
  //   console.log("here");
  //   const res = await uploadImage(param);
  //   this.currentAvatar = res; // 在回调函数中执行后续操作
  //   vue.prototype.$avatar = res;
  //   console.log("this.currentAvatar", res);
  // },
  methods: {
    //获取随机名字
    generateRandomString(length) {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';

      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
      }

      const currentDate = new Date(); // 创建一个 Date 对象，表示当前时间
      const currentYear = currentDate.getFullYear(); // 获取当前年份
      const currentMonth = currentDate.getMonth() + 1; // 获取当前月份（注意月份从0开始，所以要加1）
      const currentDay = currentDate.getDate(); // 获取当前日期
      const currentHour = currentDate.getHours(); // 获取当前小时
      const currentMinute = currentDate.getMinutes(); // 获取当前分钟
      const currentSecond = currentDate.getSeconds(); // 获取当前秒

      // 可以将上述获取的时间信息组合成一个字符串，以方便展示
      const currentTimeString = `${currentYear}_${currentMonth}_${currentDay}_${currentHour}_${currentMinute}_${currentSecond}`;

      console.log(result + '_' + currentTimeString); // 输出当前时间的字符串表示


      return result + '_' + currentTimeString;
    },


    // 点击头像打开上传窗口
    toggleShow() {
      console.log('toggleShow')
      this.showDialog = !this.showDialog
      this.imagecropperShow = !this.imagecropperShow
      console.log(this.showDialog)
    },

    updateEmail() {
      // 获取输入的值
      console.log(this.user)
      const userId = this.user.userId;
      const userName = this.newUserName ? this.newUserName : this.user.userName;
      const email = this.newEmail ? this.newEmail : this.user['email'];
      const userFace = this.user.userFace;
      const roleType = this.user.roleType;
      const banji = this.user.class;
      const password = this.user.password;
      console.log('userFace', this.user.userFace)
      this.showDialog_change = false;
      altInform({ userName, userId, email, roleType, userFace, "class": banji, password }).then(res => {
        const { status } = res;
        if (status) {
          alert("success!")
        } else {
          const { description } = res
          alert(description)
        }

      }).catch(err => {
        console.log(err);
      });
    },

    cropSuccess(imageData) {
      console.log('cropSuccess')
      const formatMatch = imageData.match(/^data:image\/(\w+);base64,/);
      if (formatMatch) {
        const imageFormat = formatMatch[1];
        console.log("图片格式:", imageFormat);

        const binaryImage = atob(imageData.split(",")[1]);
        const uint8Array = new Uint8Array(binaryImage.length);
        for (let i = 0; i < binaryImage.length; i++) {
          uint8Array[i] = binaryImage.charCodeAt(i);
        }

        let fileName = this.generateRandomString(6);
        const blob = new Blob([uint8Array]);
        const f = fileName + '.' + imageFormat
        const file = new File([blob], fileName, { type: 'image/' + imageFormat });
        // this.changeAvatar({ "fileName": f, "blob": blob })
        uploadImage({ "fileName": f, "blob": file }).then(url => {
          console.log("here");
          this.currentAvatar = url; // 在回调函数中执行后续操作
          vue.prototype.$avatar = url;
          this.user.userFace = url;
          this.$store.state.user.avatar = url;
          this.updateEmail();
          console.log("this.currentAvatar", url);
        })


        // const url = uploadImage({"fileName":f,"blob":blob})
        // this.currentAvatar = url
        // vue.prototype.$avatar = url
        // console.log("that.currentAvatar",url)
        // const promise = getUploadToken({'filename': fileName+'.'+imageFormat});
        // promise.then((data) => {
        //   console.log(data)
        //   const data_1 = data.data
        //   const {status} = data_1
        //   if(status){
        //     const { data } = data_1
        //     const {token} = data[0]
        //     console.log(data[0])

        //     //生成随机名字
        //     const imageName = fileName + '.' + imageFormat

        //     const file = new File([blob], imageName, { type: 'image/' + imageFormat });

        //     const putExtra = {};
        //     const config = { region: qiniu.region.na0 };
        //     console.log(file.name)
        //     const observable = qiniu.upload(file, file.name, token, putExtra, config)
        //     let that = this;
        //     const observer = {        //监听
        //       next(res) {
        //         // ...
        //       },
        //       error(err) {
        //         // ...
        //       },
        //       complete(res) {
        //         // ...
        //         // that.Avatar = 'http://rw9rukta6.hn-bkt.clouddn.com/'+ res.key;
        //         that.currentAvatar = 'http://qn.gxc111.top//' + res.key;
        //         console.log(that.currentAvatar)
        //         const userface = that.currentAvatar
        //         vue.prototype.$avatar = userface
        //         console.log(userface)
        //         changeface({ userface }).then(res => {
        //           console.log('successfully');
        //         }).catch(err => {
        //           console.log(err);
        //         });
        //       }
        //     }
        //     const subscription = observable.subscribe(observer) // 上传开始
        //   }else{
        //     alert("获取token失败!")
        //   }


        // }).catch((error) => {
        //   console.log(error);
        // })
      } else {
        console.error("无法获取图片格式");
      }
    },

    changeDiage() {
      this.showDialog_change = !this.showDialog_change;
    },
    closeDialog() {
      this.showDialog_change = false;
    },
    mapping(role) {
      return this.roleMapping[role]
    }
  }
}
</script>


<style lang="scss">
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

.app-container {
  background-size: 100% 100%;
  min-height: 100%;
  width: 100%;
  // background-color: $bg;
  overflow: hidden;
  bottom: 100%;

}

.user-info {
  padding-left: 0;
  list-style: none;

  li {
    border-bottom: 1px solid #f0f3f4;
    padding: 11px 0;
    font-size: 13px;
  }

  .user-right {
    width: 250px;
    float: right;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: right;
  }
}
</style>