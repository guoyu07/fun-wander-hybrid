<template>
    <div class="container">
        <mt-header title="地图选点">
            <router-link to="" slot="left">
                <mt-button icon="back" @click="handleClose">返回</mt-button>
            </router-link>
            <mt-button icon="more" @click="showActionSheet()" slot="right"></mt-button>
        </mt-header>
        <leaflet-map show-center-point='1'></leaflet-map>
        <area-data-list></area-data-list>
        <mt-actionsheet :actions="actions" v-model="sheetVisible"></mt-actionsheet>
    </div>
</template>

<script>
    import L from 'leaflet'
    import ajax from '@/utils/ajax'
    import util from '@/utils/util'
    import events from '@/utils/events'
    import leafletMap from './LeafletMap.vue'
    import buildingInfo from './BuildingInfo.vue'
    import AreaDataList from "./areaDataList.vue";

    export default {
        name: 'Main',
        components: {
            AreaDataList,
            leafletMap,
            buildingInfo
        },
        data: function () {
            return {
                building: null,
                map: null,
                layers: [],
                sheetVisible: false,
                actions: []
            }
        },
        mounted: function () {},
        destroyed() {
            this.$bus.off(events.FLOORCHANGING);
        },
        methods: {
            handleClose: function () {
                this.$router.back(-1);
            },
            selectFloor: function (eData) {
                // 更新全局楼层变量;
                this.globalData.currentFloorId = eData.value;
                this.$bus.emit(events.FLOORCHANGING, eData.value);
            },
            showActionSheet: function () {
                this.sheetVisible = !this.sheetVisible;
                if (!this.sheetVisible) return;
                this.loadFloorByBuilding(this.globalData.currentBuilding.id).then(res => {
                    this.actions = res.map(item => {
                        return {
                            name: item.properties.name + '---'+ item.properties.infor,
                            method: this.selectFloor,
                            value: item.properties.id
                        }
                    });
                })
            },
            loadFloorByBuilding: function() {
                return ajax.get(`/indoor/building/floor/${this.globalData.currentBuilding.id}`)
                    .then(res => {
                        const result = null;
                        if (res && res.data && res.data.length > 0) {
                            return res.data.map(it => {
                                const geom = util.wktToGeojson(it.geometry)
                                return {
                                    type: 'Feature',
                                    properties: {
                                        id: it.fl_id,
                                        infor: it.fl_infor,
                                        name: it.fl_name,
                                        num: it.fl_num,
                                    },
                                    geometry: geom
                                };
                            });
                        } else {
                            return [];
                        }
                    }).catch(err => {
                        console.log(err)
                    })
            }
        }
    };
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
    .container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .map-container {
        width: 100%;
        flex: 1;
    }
</style>