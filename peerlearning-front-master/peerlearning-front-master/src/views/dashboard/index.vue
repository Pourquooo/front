<template>
  <div class="dashboard-container">
    <div class="dashboard-text" style=" margin-left: 30px; color: #d9bfa1;">welcome: {{ sname }}</div>
    <!-- <div class="dashboard-container2">
      <vue-particles color="#eee" :particleOpacity="0.5" :particlesNumber="75" shapeType="circle" :particleSize="4"
        linesColor="#eee" :linesWidth="2" :lineLinked="true" :lineOpacity="0.4" :linesDistance="150" :moveSpeed="2"
        :hoverEffect="true" hoverMode="grab" :clickEffect="true" clickMode="push">
      </vue-particles>
    </div> -->
    <div class="dashboard-container1">
      <vue-particles color="#eee" :particleOpacity="0.5" :particlesNumber="75" shapeType="circle" :particleSize="4"
        linesColor="#eee" :linesWidth="2" :lineLinked="true" :lineOpacity="0.4" :linesDistance="150" :moveSpeed="2"
        :hoverEffect="true" hoverMode="grab" :clickEffect="true" clickMode="push">
      </vue-particles>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'sname'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    height: 750px;
    // background-size: 100%;
    // background-image: url(../../assets/background/c1.png);
    background-color: black;
  }

  &-container1 {
    height: 100%;
    width: 100%;
    background-size: 100% 100%;
    background-image: url(../../assets/background/H.jpg);
  }

  // &-container2 {
  //   height: 1px;
  // }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
