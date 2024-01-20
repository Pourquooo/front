<template>
  <div>
  <el-table :data="tableData" style="width: 100%" max-height="'100vh'">
    <el-table-column fixed prop="userId" label="用户ID" width="getFormattedRoleType(15)">
    </el-table-column>
    <el-table-column prop="userName" label="姓名" width="getFormattedRoleType(15)">
    </el-table-column>
    <el-table-column prop="password" label="登录密码" width="getFormattedRoleType(15)">
    </el-table-column>
    <el-table-column prop="roleType" label="身份" width="getFormattedRoleType(10)">
          <template slot-scope="scope">
          {{ getFormattedRoleType(scope.row) }}
        </template>
    </el-table-column>
    <el-table-column prop="class" label="班级" width="getFormattedRoleType(10)">
    </el-table-column>
    <el-table-column prop="email" label="邮箱" width="getFormattedRoleType(20)">
    </el-table-column>
    <el-table-column fixed="right" label="操作" width="getFormattedRoleType(15)">
      <template slot-scope="scope">
        <el-button @click.native.prevent="deleteRow(scope.$index, tableData)" type="text" size="small">
          移除
        </el-button>
        <el-button @click.native.prevent="modifyRow(scope.$index, tableData)" type="text" size="small">
            编辑
          </el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog title="信息修改" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="用户昵称" :label-width="formLabelWidth">
           <el-input v-model="newForm.userName" autocomplete="off" placeholder="请输入昵称，不改可不填"></el-input>
          </el-form-item>
          <el-form-item label="班级" :label-width="formLabelWidth">
            <el-select v-model="newForm.class" placeholder="请选择班级" @change="handleClassChange">
              <el-option label="1班" value="1班"></el-option>
              <el-option label="2班" value="2班"></el-option>
              <el-option label="3班" value="3班"></el-option>
              <el-option label="4班" value="4班"></el-option>
              <el-option label="5班" value="5班"></el-option>
              <el-option label="6班" value="6班"></el-option>
              <el-option label="不修改" value="0"></el-option> 
            </el-select>
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth">
              <el-input v-model="newForm.password" autocomplete="off" placeholder="请输入密码，不改可不填"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth">
                <el-input v-model="newForm.email" autocomplete="off" placeholder="请输入邮箱，不改可不填"></el-input>
            </el-form-item>
            <el-form-item label="身份" :label-width="formLabelWidth">
                <el-select v-model="newForm.roleType" placeholder="请选择身份">
                <el-option label="管理员" value="0"></el-option>
                <el-option label="教师" value="1"></el-option>
                <el-option label="学生" value="2"></el-option>
                <!-- <el-option label="助教" value="3"></el-option>
                <el-option label="访客" value="4"></el-option> -->
              </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateInfor()">确 定</el-button>
        </div>
      </el-dialog>
</div>
</template>

<script>
import { getAllTeachers } from '@/api/manager';
import { deleteUser } from '@/api/manager';
import { altInform } from '@/api/user';
export default {
  mounted(){
    this.getAllInfo();
  },
  methods: {
    deleteRow(index, rows) {
      let promise = deleteUser({ 'userName': rows[index].userName, 'userId': rows[index].userId });
      promise.then((res) => {
        const { status } = res;
        if (status) {
          rows.splice(index, 1);
          alert("删除成功")
        } else {
          const { description } = res;
          alert(description)
        }
      })
    },
     modifyRow(index, rows) {
      this.form = {
        userId: rows[index].userId,
        userName: rows[index].userName,
        roleType: rows[index].roleType,
        class: rows[index].class,
        password: rows[index].password,
        email: rows[index].email,
        userFace: rows[index].userFace
      };
      this.dialogFormVisible = true;
    },
    getAllInfo(){
      let promise = getAllTeachers();
      promise.then((res) => {
        const { status } = res;
        if (status) {
          const { data } = res
          this.tableData = data
        } else {
          const { description } = res
          alert(description)
        }
      })
    },
    getFormattedRoleType(row) {
      switch (row.roleType) {
        case 0:
          return '管理员';
        case 1:
          return '教师';
        case 2:
          return '学生';
        case 3:
          return '助教';
        default:
          return '访客';
      }
    },
    getColumnWidth(percentage) {
      const tableWidth = this.$el.clientWidth; // 获取表格父元素的宽度
      return `${(tableWidth * percentage) / 100}px`;
    },

    handleClassChange() {
      // 根据选择的班级，将其映射到对应的数字
      switch (this.newForm.class) {
        case "1班":
          this.newForm.class = 1;
          break;
        case "2班":
          this.newForm.class = 2;
          break;
        case "3班":
          this.newForm.class = 3;
          break;
        case "4班":
          this.newForm.class = 4;
          break;
        case "5班":
          this.newForm.class = 5;
          break;
        case "6班":
          this.newForm.class = 6;
          break;
        default:
          this.newForm.class = this.form.class;
          break;
      }
    },
    updateInfor() {
      const myForm = this.newForm;
      const userId = this.form.userId;
      const userFace = this.form.userFace;
      const userName = myForm.userName ? myForm.userName : this.form.userName;
      const email = myForm.email ? myForm.email : this.form.email;
      const bnaji = myForm.class ? myForm.class : this.form.class;
      const roleType = myForm.roleType ? myForm.roleType : this.form.roleType;
      const password = myForm.password ? myForm.password : this.form.password
      let promise = altInform({ userFace, userId, userName, email, 'class': bnaji, roleType, password });
      promise.then((res) => {
        const { status } = res;
        if (status) {
          alert('success')
          this.dialogFormVisible = false;
        } else {
          const { description } = res;
          alert(description)
        }
      })
    }
  
  },
  data() {
    return {
      tableData: [],
      formLabelWidth: '120px',
      dialogFormVisible: false,
      form: {
        userName: '',
        roleType: '',
        password: '',
        email: '',
        class: '',
        userId: '',
        userFace: ''
      },
      newForm: {
        userName: '',
        roleType: '',
        password: '',
        email: '',
        class: '',
        userId: '',
        userFace: ''
      },
    }
  }
}
</script>