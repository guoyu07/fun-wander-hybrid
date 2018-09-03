import Vue from 'vue'
import Mint from 'mint-ui'
import VueRouter from 'vue-router'
import 'mint-ui/lib/style.css'

import App from './App.vue'
import vueBus from '@/utils/vue-bus'

Vue.config.productionTip = false

Vue.use(Mint)
// 增加一个vuebus作为数据传递总线，解决各级别组件传递数据的问题;
Vue.use(vueBus)

Vue.use(VueRouter)

// 用于存储全局变量
Vue.prototype.globalData = {};
Vue.prototype.globalData = {
    currentBuildingId: null,
    currentFloorId: null,
    map: {
        zoom: 17,
        center: null
    }
};

new Vue({
    render: h => h(App)
}).$mount('#app')
