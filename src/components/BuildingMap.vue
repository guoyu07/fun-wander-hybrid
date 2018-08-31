<template>
    <div v-if="building" class="container">
        <mt-header :title="building.name">
            <router-link to="/" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
        </mt-header>
        <indoor-map :building-id="building.building_id" :floor-id="currentFloorId" :enable-poi-select="true" @select-poi="selectPoi" @map-moveend="cacheMapInfo"></indoor-map>
        <div v-if="selectedPoiId">
            <poi-info :building-id="building.building_id" :poi-id="selectedPoiId"></poi-info>
        </div>
        <div v-else>
            <floor-info :building-id="building.building_id" :floor-id="currentFloorId" @change-floor="changeFloor"></floor-info>
        </div>
    </div>
</template>
<script>
import IndoorMap from './IndoorMap.vue'
import FloorInfo from './FloorInfo.vue'
import PoiInfo from './PoiInfo.vue'
import ds from '../utils/service'

export default {
    name: 'BuildingMap',
    components: {
        IndoorMap,
        FloorInfo,
        PoiInfo
    },
    data: function() {
        return {
            building: null,
            selectedPoiId: null,
            currentFloorId: null
        };
    },
    beforeCreate: function() {
        const buildingId = this.$route.query.buildingId;
        ds.getBuildingById(buildingId).then(data => {
            this.building = data
            this.currentFloorId = data.default_fl_id

            this.globalData.currentBuildingId = data.building_id
            this.globalData.currentFloorId = data.default_fl_id
        })
    },
    methods: {
        selectPoi(poiId) {
            this.selectedPoiId = poiId
        },
        changeFloor(floorId) {
            this.currentFloorId = floorId
        },
        cacheMapInfo(mapInfo) {
            this.globalData.map = mapInfo
        }
    }
}
</script>
<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
</style>