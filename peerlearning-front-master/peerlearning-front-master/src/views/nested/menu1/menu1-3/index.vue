<template>
  <div class="app-container">
    <div class='form'>
      <el-form class="search-form" inline>
      </el-form>
      <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column align="center" label="ID" width="95">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="博客名">
          <template slot-scope="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column label="作者" width="110" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.user_name }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="created_at" label="发布时间" width="200">
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span>{{ scope.row.publish_date }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="created_at" label="浏览" width="120">
          <template slot-scope="scope">
            <span><el-button type="primary" plain @click="tiaozhuan(scope.row.id)">跳转</el-button></span>
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">
          <el-button @click.native.prevent="deleteRow(scope.$index,scope.row.cid,scope.row.id)" type="text" size="small" icon="el-icon-delete">
            移除
          </el-button>
        </template>
      </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { artiInform } from '@/api/table'
import { getInfo } from '@/api/user'
import vue from 'vue'
// import {removeRelation} from '@/api/form'
import {remove2} from '@/api/form'
import {artiRemove} from '@/api/table'
export default {
  async created() {
    const res = await getInfo();
    console.log(res);
    let user = res['data'];
    console.log(user);
    const uid = user['id']
    this.fetchTableData(uid)
  },

  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },

  data() {
    const uid = null;
    const inform = null;
    return {
      list: [],
      beg: true,
      listLoading: false,
      i: 0,
      searchKeyword: '' // 添加searchKeyword属性
    }
  },

  methods: {
    async fetchTableData(uid) {
      console.log('here')
      if (vue.prototype.$articleID == undefined) {
        vue.prototype.$articleID = 0
      }
      this.listLoading = true
        artiInform({ uid }).then(response=>{
          this.list = Array.from(response.data)
          console.log(this.list)
          this.listLoading = false
        })
    },

    deleteRow(index,uid,aid) {
      console.log(index)
      const id = aid;
      // const uid = this.list[index].uid;
      // const aid = this.list[index].aid;
      console.log(uid,aid)
      artiRemove({uid,aid}).then(response=>{
        console.log(response)});
      remove2({id}).then(response=>{
        console.log(response)
      });
      this.$router.go(0)
      console.log("更新收藏")
    },

    tiaozhuan(id) {
      vue.prototype.$articleID = id
      console.log("id" + vue.prototype.$articleID)
      this.$router.push({ path: '/example/show' })
    },

    search() {
      this.listLoading = true
      if (this.searchKeyword == "") {
        this.fetchData()
        return
      }
      getList(this.searchKeyword).then(response => {
        this.list = Array.from(response.data)
        this.listLoading = false
      })
    }
  }
}
</script>

<style scoped>
.form {
  position: relative;
  /* transform: translate(50%, 50%); */
}

.lizi {
  position: absolute;
}
</style>