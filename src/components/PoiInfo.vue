<template>
    <div v-if="poi" class="footer">
        <div class="poi-detail">
            <div class="waper">
                <div class="name">{{poi.name}}</div>
                <div class="address">{{poi.address}}</div>
            </div>
            <div class="deta">
                <div class="left">
                    <img src="/images/list.png" /> 详情
                </div>
                <div class="right">
                    <mt-button type="primary" size="small" @click.stop="startWith()">出发</mt-button>
                    <mt-button type="primary" size="small" @click.stop="goto()">到达</mt-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import ds from '@/utils/service'

export default {
    name: 'PoiInfo',
    props: {
        buildingId: {
            type: String,
            required: true
        },
        poiId: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            poi: null
        }
    },
    watch: {
        poiId: function(newVal) {
            this.reloadPoi(newVal)
        }
    },
    created() {
        this.reloadPoi(this.poiId)
    },
    methods: {
        reloadPoi(poiId) {
            ds.getPoiById(poiId).then(poi => {
                if (poi) {
                    this.poi = poi
                }
            })
        },
        startWith() {
            this.$router.push({
                path: '/naviPath',
                query: {
                    buildingId: this.buildingId,
                    sPoiId: this.poiId
                }
            });
        },
        goto() {
            this.$router.push({
                path: '/naviPath',
                query: {
                    buildingId: this.buildingId,
                    ePoiId: this.poiId
                }
            });
        }
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.footer {
    position: absolute;
    width: 100%;
    z-index: 999;
    left: 0px;
    bottom: 0px;
}

.footer .poi-detail {
    background-color: white;
}

.footer .poi-detail .waper {
    border-bottom: solid 1px #c3c3c3;
}

.footer .poi-detail .waper .name {
    padding: 6px 20px 2px 20px;
    font-weight: bold;
    font-size: 14px;
}

.footer .poi-detail .waper .address {
    padding: 0px 20px 10px 20px;
    font-size: 10px;
}

.footer .poi-detail .deta {
    color: #151515;
    font-size: 14px;
    display: flex;
}

.footer .poi-detail .deta img {
    width: 14px;
    height: 14px;
    vertical-align: middle;
}

.footer .poi-detail .deta .left {
    padding: 10px 20px;
    flex: 1;
}

.footer .poi-detail .deta .right {
    padding: 8px;
}

.footer .poi-detail .deta .right button {
    padding: 0px 20px;
    height: 24px;
    line-height: 24px;
}
</style>