<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="学号" prop="studentId">
                <el-input v-model="queryParams.studentId" placeholder="请输入学号" clearable
                    @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="提交时间">
                <el-date-picker v-model="dateRange" style="width: 240px" value-format="yyyy-MM-dd" type="daterange"
                    range-separator="-" start-placeholder="最早日期" end-placeholder="最晚日期"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-download" size="mini" @click="download">下载</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="info" plain icon="el-icon-upload" size="mini" @click="distribute"
                    >分配</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="tableList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" align="center" width="55"></el-table-column>
            <el-table-column label="序号" type="index" width="50" align="center">
                <template slot-scope="scope">
                    <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1 }}</span>
                </template>
            </el-table-column>
            <el-table-column label="课程名" align="center" prop="courseName" :show-overflow-tooltip="true" width="120" />
            <el-table-column label="作业Id" align="center" prop="homeworkId" :show-overflow-tooltip="true" width="120" />
            <el-table-column label="学号" align="center" prop="studentNumber" :show-overflow-tooltip="true" width="120" />
            <el-table-column label="姓名" align="center" prop="studentName" width="160" />
            <el-table-column label="提交时间" align="center" prop="submitTime" width="160" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button type="text" size="small" icon="el-icon-view" @click="handlePreview(scope.row)"
                        >预览</el-button>
                    <el-button type="text" size="small" icon="el-icon-delete" @click="handleDelete(scope.row,scope.$index)"
                        >删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
            @pagination="getList" />
        <!-- 预览界面 -->
        <el-dialog :title="preview.title" :visible.sync="preview.open" width="50%" center :append-to-body="true" class="scrollbar">
            <span>请选择题号：</span>
            <el-select v-model="value" placeholder="请选择" @change="handleSelectChange">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <el-tabs v-model="activeTab">
                <el-tab-pane v-for="(item, index) in preview.data" :key="index" :name="index.toString()">
                    <span><h3>{{ '第' + (index + 1) + '题' }}</h3></span>
                    <br>
                    <div v-for="(value, subIndex) in item.content" :key="subIndex" style="margin-bottom: 10px;">
                        <span v-if="!isUrl(value.content)">{{ value.content }}</span>
                        <img v-else :src="value.content" alt="答案图片" style="object-fit: contain; width: 30%; height: 100px;">
                    </div>
                   
                </el-tab-pane>
            </el-tabs>
        </el-dialog>
    </div>

</template>

<script>
// import { listTable, previewTable, delTable, genCode, synchDb } from "@/api/tool/gen";
import { getUndistributedHomework, deleteHomework} from "@/api/homework"
import { assignment } from '@/api/teacher'
import { downloadXlsx } from '@/utils/download'
import importTable from "./importTable";
import hljs from "highlight.js/lib/highlight";
import "highlight.js/styles/github-gist.css";
hljs.registerLanguage("java", require("highlight.js/lib/languages/java"));
hljs.registerLanguage("xml", require("highlight.js/lib/languages/xml"));
hljs.registerLanguage("html", require("highlight.js/lib/languages/xml"));
hljs.registerLanguage("vue", require("highlight.js/lib/languages/xml"));
hljs.registerLanguage("javascript", require("highlight.js/lib/languages/javascript"));
hljs.registerLanguage("sql", require("highlight.js/lib/languages/sql"));

export default {
    name: "Gen",
    components: { importTable },
    data() {
        return {
            // 当前选择的题号
            value: '0',
            // select选择框的选项
            options: [],
            //默认显示第一题
            activeTab: '0',
            homeworkId: this.$route.query.homeworkId,
            courseId: this.$route.query.courseId,
            courseName: this.$route.query.courseName,
            // 遮罩层
            loading: true,
            // 唯一标识符
            uniqueId: "",
            // 选中数组
            ids: [],
            // 选中表数组
            tableNames: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            // 表数据
            tableList: [],
            // 日期范围
            dateRange: [],
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                studentId: undefined,
                tableComment: undefined
            },
            // 预览参数
            preview: {
                open: false,
                title: "学生回答",
                data: {},
                activeName: "0"
            }
        };
    },
    created() {
        this.getList();
    },
    activated() {
        const time = this.$route.query.t;
        if (time != null && time != this.uniqueId) {
            this.uniqueId = time;
            this.queryParams.pageNum = Number(this.$route.query.pageNum);
            this.getList();
        }
    },
    methods: {
        /** 查询表集合 */
        getList() {
            this.loading = true;
            this.tableList = []
            console.log('here',this.queryParams, 'dateRange',this.dateRange)
            const homeworkId = this.homeworkId
            const courseId = this.courseId
            getUndistributedHomework({homeworkId,courseId}).then(response => {
                const {status} = response
                if(status){
                    this.tableList = response.data[0].students;
                    console.log(this.tableList)
                    if(this.tableList)
                    {
                        this.tableList.forEach(item => {
                            item.homeworkId = this.homeworkId;
                            item.courseName = this.courseName;
                        });
                        this.total = this.tableList.length;
                        console.log('1',this.tableList)
                        if (this.queryParams.studentId) {
                            this.tableList = this.tableList.filter(item => item.studentNumber === parseInt(this.queryParams.studentId));
                        }
                        if (this.dateRange.length > 0) {
                            const startDate = new Date(this.dateRange[0])
                            const endDate = new Date(this.dateRange[1])
                            this.tableList = this.tableList.filter(item => {
                                // 将字符串格式的时间转换为 Date 对象
                                const itemDate = new Date(item.submitTime); // 将 'yourDateStringProperty' 替换为实际的存储时间的属性名
                                // 比较时间范围
                                return itemDate >= startDate && itemDate <= endDate;
                            });
                        }
                        this.loading = false;
                    }else{
                        this.$message({
                            message: '当前作业已被分配！',
                            type: 'warning'
                        })
                    }
                }else{
                    const{description} = response
                    this.$message.error(description)
                }
            }
            );
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        /** 同步数据库操作 */
        handleSynchDb(row) {
            const tableName = row.tableName;
            this.$modal.confirm('确认要强制同步"' + tableName + '"表结构吗？').then(function () {
                return synchDb(tableName);
            }).then(() => {
                this.$modal.msgSuccess("同步成功");
            }).catch(() => { });
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.dateRange = [];
            this.queryParams.studentId = undefined
            this.handleQuery();
        },
        /** 预览按钮 */
        handlePreview(row) {
            // console.log(row)
            this.preview.data = row["answer"].split('￥！').map((value, index) => ({ id: index, content: value.split('￥？').map((value, index)=> ({id: index, content: value})) }));
            this.options = this.preview.data.map((item, index) => ({
                label: `第${index + 1}题`,
                value: index.toString(),
            }));
            this.preview.open = true;
            console.log(this.preview.data)
        },
        /** 高亮显示 */
        highlightedCode(code, key) {
            const vmName = key.substring(key.lastIndexOf("/") + 1, key.indexOf(".vm"));
            var language = vmName.substring(vmName.indexOf(".") + 1, vmName.length);
            const result = hljs.highlight(language, code || "", true);
            return result.value || '&nbsp;';
        },
        /** 复制代码成功 */
        clipboardSuccess() {
            this.$modal.msgSuccess("复制成功");
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            // console.log(selection)
            this.ids = selection.map(selectedItem => {
                // 使用findIndex方法找到tableList中符合条件的项的下标
                // console.log(selectedItem.studentNumber)
                return this.tableList.findIndex(item => item.studentNumber === selectedItem.studentNumber);
            });
            console.log('ids',this.ids)
            
        },
        /** 修改按钮操作 */
        handleEditTable(row) {
            const tableId = row.tableId || this.ids[0];
            const tableName = row.tableName || this.tableNames[0];
            const params = { pageNum: this.queryParams.pageNum };
            this.$tab.openPage("修改[" + tableName + "]生成配置", '/tool/gen-edit/index/' + tableId, params);
        },
        /** 删除按钮操作 */
        handleDelete(row, index) {
            console.log(index)
            this.$confirm('是否确认删除"'+row.studentName+'"的作业？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let promise = deleteHomework({"answerId":row.answerId})
                promise.then((res)=>{
                    const{status} = res
                    if(status){
                        this.tableList.splice(index, 1);
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }else{
                        const{description} = res
                        this.$message.error(description)
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });

        },
        //处理下载
        download(){
            if(this.ids.length == 0){
                this.$message("请先选择需要下载的信息")
            }else{
                let dataList = []
                dataList.push(['学号','姓名','提交时间'])
                let selectedItems = this.ids.map(index => {
                    // 使用下标访问 tableList 中的项
                    return this.tableList[index];
                });
                selectedItems.forEach((item, index)=>{
                    dataList.push([item.studentNumber,item.studentName,item.submitTime])
                })
                console.log(dataList)
                downloadXlsx(dataList, this.courseName+"课堂已提交但未分配的学生名单.xlsx");
            }
        },
        //处理分配
        distribute(){
            let promise = assignment({'homeworkId':this.homeworkId})
            promise.then((res)=>{
                const {status} = res
                const { description } = res
                if(status){
                    this.$message({
                        message: description,
                        type: 'success'
                    });
                }else{
                    this.$message.error(description)
                }
            })
        },
        // 判断是否为url
        isUrl(string) {
            try {
                new URL(string);
                return true;
            } catch (err) {
                return false;
            }
        },
        // deal with instance of select changing
        handleSelectChange(){
            this.activeTab = this.value
        }
    }
};
</script>