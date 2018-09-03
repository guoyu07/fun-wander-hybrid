<template>
    <div class="container">
        <mt-header title="地图选点">
            <router-link to="" slot="left">
                <mt-button icon="back" @click="goBack">返回</mt-button>
            </router-link>
            <mt-button icon="more" @click="showActionSheet()" slot="right"></mt-button>
        </mt-header>
        <indoor-map :building-id="buildingId" :floor-id="floorId" :show-center-marker="true" :zoom="globalData.map.zoom" :center="globalData.map.center" @map-moveend="getMapCenter"></indoor-map>
        <closest-poi-list :floor-id="floorId" :location="location" :start-end="startEnd"></closest-poi-list>
        <mt-actionsheet :actions="floorActions" v-model="sheetVisible"></mt-actionsheet>
    </div>
</template>
<script>
import ds from '@/utils/service'
import IndoorMap from './IndoorMap.vue'
import ClosestPoiList from "./ClosestPoiList.vue";

export default {
    name: 'SelectPoiInMap',
    components: {
        IndoorMap,
        ClosestPoiList
    },
    data: function() {
        return {
            buildingId: this.$route.query.buildingId,
            floorId: this.$route.query.floorId,
            startEnd: parseInt(this.$route.query.startEnd),
            location: this.globalData.map.center,
            sheetVisible: false,
            floorActions: []
        }
    },
    created() {
        ds.getFloorByBuilding(this.buildingId).then(data => {
            this.floorActions = data.map(it => ({
                name: it.fl_name + '-' + it.fl_infor,
                method: this.selectFloor,
                value: it.fl_id
            }))
        })
    },
    methods: {
        goBack: function() {
            this.$router.back(-1);
        },
        selectFloor: function(e) {
            this.floorId = e.value
        },
        showActionSheet() {
            this.sheetVisible = true
        },
        getMapCenter(data) {
            this.location = data.center
        }
    }
}
</script>
<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
</style>