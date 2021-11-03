<template>
<div class="fans-container">
    <div ref="main" style="width: 600px;height:400px;"></div>
</div>
    <map-demo />
</template>
<script>
import echarts from 'echarts'
import MapDemo from './components/map-demo'
export default {
  name: 'FansIndex',
  components: {
    MapDemo, // 百度地图结合 echarts
  },
  props: {},
  mounted () {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(this.$refs.main)

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: '日新增用户数'
      },
      tooltip: {},
      legend: {
        data: ['新增用户数']
      },
      xAxis: {
        data: ['05/03', '05/04', '05/05', '05/06', '05/07', '05/08']
      },
      yAxis: {},
      series: [
        {
          name: '新增用户数',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }
      ]
    }

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)
  }
}
</script>
<style scoped>

</style>
