<template>
    <div class="areaDataList">
        <mt-cell v-for="item in cloestPoiList" :key="item.poi_id" :title="item.name" :label="`${item.address}`">
            <mt-button type="primary" class="start_end_btn" size="small" @click.stop="selectPoi(item)">{{operDesc}}</mt-button>
        </mt-cell>
    </div>
</template>
<script>
import L from 'leaflet'
import util from '../utils/util'
import ds from '../utils/service'

export default {
    name: 'ClosestPoiList',
    props: {
        floorId: {
            type: String,
            required: true
        },
        location: {
            type: Object,
            required: true
        },
        startEnd: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            poiList: [],
            cloestPoiList: []
        }
    },
    computed: {
        operDesc: function() {
            return this.startEnd === 1 ? '设为起点' : '设为终点'
        }
    },
    watch: {
        floorId: function(newVal) {
            this.getPoiList(newVal).then(data => {
                this.poiList = data
            })
        },
        location: function(newVal) {
            this.cloestPoiList = this.filterPoi(newVal)
        }
    },
    created() {
        this.getPoiList(this.floorId).then(data => {
            this.poiList = data
            this.cloestPoiList = this.filterPoi(this.location)
        })
    },
    methods: {
        getPoiList: function(floorId) {
            return ds.getPoiByFloor(floorId).then(data => {
                if (data) {
                    data.forEach(it => {
                        const geom = util.wktToGeojson(it.geometry)
                        it.latlng = L.latLng(geom.coordinates.slice().reverse());
                    })

                    return data;
                } else {
                    return []
                }
            });
        },
        filterPoi: function(location) {
            const radius = 15; // 搜索半径;
            const temp = this.poiList.slice();
            temp.forEach(it => {
                it.distance = location.distanceTo(it.latlng)
            })

            return temp.sort((a, b) => a.distance - b.distance).filter(item => item.distance < radius);
        },
        selectPoi(data) {
            const queryObj = {}
            if (this.startEnd === 1) {
                queryObj.sPoiId = data.poi_id
            } else {
                queryObj.ePoiId = data.poi_id
            }
            // 通过跳转路由来实现;
            this.$router.push({
                path: '/naviPath',
                query: queryObj
            })
        }
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.areaDataList {
    position: absolute;
    bottom: 0;
    width: 100%;
    max-height: 200px;
    z-index: 1000;
    background: #fff;
    overflow: auto;
}

.areaDataList>div {
    border-bottom: 1px solid #eee;
}
</style>