<!-- 下载依赖：npm install echarts --save -->
<template>
  <div>
    <div class="dropdown-container">
      <label for="classSelect">班级:</label>
      <select v-model="selectedClass" @change="onClassChange">
        <option v-for="cls in classes" :key="cls.value" :value="cls.value">{{ cls.label }}</option>
      </select>
      <label for="courseSelect">课程:</label>
      <select v-model="selectedCourse" @change="onCourseChange">
        <option v-for="course in courses" :key="course.value" :value="course.value">{{ course.label }}</option>
      </select>
      <label for="teacherSelect">教师:</label>
      <select v-model="selectedTeacher" @change="onTeacherChange">
        <option v-for="teacher in teachers" :key="teacher.value" :value="teacher.value">{{ teacher.label }}</option>
      </select>
      <el-button type="primary" @click="updateChart" style="margin-left: 10px; margin-top: 20px; height: 32px;">确认</el-button>
    </div> 
    <div class="chart-container">
      <div id="main" style="width: 600px; height: 400px; margin-right: 20px;"></div>
      <div class="legend">
        <div v-for="(label, color) in pieData" :key="color" class="legend-item">
          <span :style="{ backgroundColor: color }"></span>
          <!-- <span>{{ label }}</span> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import {getGradeGraph} from '@/api/record'

export default {
  data() {
    return {
      selectedClass: '',
      selectedCourse: '',
      selectedTeacher: '',
      classes: [
        { label: '-', value: '' },
        { label: '2101班', value: '2101' },
        { label: '2102班', value: '2102' },
        { label: '2103班', value: '2103' },
        { label: '2104班', value: '2104' },
        { label: '2105班', value: '2105' },
        { label: '2106班', value: '2106' },
      ],
      courses: [
        { label: '-', value: '' },
        { label: '运维', value: '1111' },
        { label: '数据库实训', value: '1112' },
        { label: '原神元素论', value: '1113' },
        { label: '机器学习', value: '1114' },
        { label: '计算机组成原理', value: '1115' },
      ],
      teachers: [
        { label: '-', value: '' },
        { label: '曾磊', value: '89' },
        { label: '苏景xi', value: '21301111' },
      ],
      pieData: [],
      nameMapping: {
        gradeNum1: '90-100分',
        gradeNum2: '80-90分',
        gradeNum3: '70-80分',
        gradeNum4: '60-70分',
        gradeNum5: '60分以下'
    },
    };
  },
  mounted() {
    this.updateChart();
  },
  methods: {
    onClassChange() {
      console.log('选中的班级:', this.selectedClass);
      // 添加处理班级变化的逻辑
    },
    onCourseChange() {
      console.log('选中的课程:', this.selectedCourse);
      // 添加处理课程变化的逻辑
    },
    onTeacherChange() {
      console.log('选中的教师:', this.selectedTeacher);
      // 添加处理教师变化的逻辑
    },
    updateChart() {
      // 发送请求给后端，获取饼图数据
      getGradeGraph({
        class: this.selectedClass,
        course: this.selectedCourse,
        teacher: this.selectedTeacher,
      }).then(response => {
        //更新饼图数据
        const backendData = response.data[0];
        //处理后端数据，映射为适用于饼图的格式
        this.pieData = Object.keys(backendData).map(key => {
          const percentage = backendData[key];
          const frontendName = this.nameMapping[key] || key;
          return {
            name: frontendName,
            value: parseFloat(percentage),
          };
        });
        // 渲染饼图
        this.renderChart();
      }).catch(error => {
        console.error('Error fetching grade graph:', error);
      });
    },
    renderChart() {
      var chartDom = document.getElementById('main');
      var myChart = echarts.init(chartDom);

      var option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c}%',
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 20,
          data: this.pieData.map(item => item.name),
        },
        series: [
          {
            type: 'pie',
            radius: '50%',
            center: ['50%', '50%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center',
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '30',
                fontWeight: 'bold',
              },
            },
            labelLine: {
              show: false,
            },
            data: this.pieData.map((item, index) => ({
              value: item.value,
              name: item.name,
              itemStyle: {
                color: this.getColor(index),
              },
            })),
          },
        ],
      };
      myChart.setOption(option);
    },
    getColor(index) {
      const colors = ['#5470C6', '#91CC75', '#FAC858', '#EE6666', '#73C0DE'];
      return colors[index % colors.length];
    },
  },
};
</script>

<style>
.dropdown-container {
  display: flex;
  justify-content: flex-start;
  margin-top: 20px;
  margin-left: 70px;
  margin-bottom: 10px;
}

.dropdown-container label {
  margin-top: 20px;
  margin-right: 10px;
  font-size: 16px;
}

.dropdown-container select {
  margin-top: 20px;
  margin-left: 10px;
  margin-right: 10px;
  padding: 5px 10px;
  font-size: 16px;
}

.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.legend {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-top: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.legend-item span {
  display: inline-block;
  width: 15px;
  height: 15px;
  margin-right: 5px;
  border-radius: 50%;
}
</style>