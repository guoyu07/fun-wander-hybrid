<template>
    <div class="container">
        <!-- header -->
        <mt-header title="起始点选择">
            <router-link to="" slot="left">
                <mt-button icon="back" @click="goBack">返回</mt-button>
            </router-link>
        </mt-header>
        <div>
            <div class="search-bar">
                <mt-search :show="false" :autofocus="!sPoiId" @click.native="switchStartEnd(1)" v-model="startPoiName" placeholder="起点"></mt-search>
                <mt-search :show="false" :autofocus="!!sPoiId" @click.native="switchStartEnd(2)" v-model="endPoiName" placeholder="终点"></mt-search>
            </div>
            <!-- tab页 -->
            <mt-navbar style="margin-bottom: 5px" v-model="mode">
                <mt-tab-item :id="1">名称搜索</mt-tab-item>
                <mt-tab-item :id="2" @click.native="selectPoiOnMap()">地图选点</mt-tab-item>
            </mt-navbar>
            <!-- 搜索结果 -->
            <div>
                <mt-cell v-for="it in result" @click.native="selectPoi(it)" :key="it.poi_id" :title="it.name" :label="it.address">
                    <img v-if="!!it.selected" src="/images/tick.png">
                </mt-cell>
            </div>
        </div>
    </div>
</template>
<script>
import ds from '@/utils/service'

export default {
    name: 'NaviPath',
    data() {
        return {
            buildingId: this.$route.query.buildingId,
            floorId: this.$route.query.floorId,
            sPoiId: this.$route.query.sPoiId,
            ePoiId: this.$route.query.ePoiId,
            // backRoute: `/buildingMap?buildingId=${this.$route.query.buildingId}`,
            timer: null,
            mode: 1,
            startEnd: 1, // 起终点编辑模式：1.起点；2.终点
            startPoi: null,
            startPoiName: null,
            endPoi: null,
            endPoiName: null,
            result: [],
        }
    },
    watch: {
        startPoiName(newVal) {
            if (this.startPoi && newVal === this.startPoi.name) {
                return
            }

            this.startPoi = null
            if (this.timer) {
                clearTimeout(this.timer)
            }

            if (newVal) {
                this.timer = setTimeout(() => {
                    this.getPoiByTip(newVal).then(res => {
                        this.result = res;
                    });
                }, 500)
            } else {
                this.result = []
            }
        },
        endPoiName(newVal) {
            if (this.endPoi && newVal === this.endPoi.name) {
                return
            }

            this.endPoi = null
            if (this.timer) {
                clearTimeout(this.timer)
            }

            if (newVal) {
                this.timer = setTimeout(() => {
                    this.getPoiByTip(newVal).then(res => {
                        this.result = res;
                    });
                }, 500)
            } else {
                this.result = []
            }
        }
    },
    methods: {
        goBack() {
            this.$router.back(-1);
        },
        switchStartEnd(flag) {
            this.startEnd = flag

            if (this.startPoi) {
                this.startPoi.selected = false
            }

            if (this.endPoi) {
                this.endPoi.selected = false
            }
        },
        setStartPoi(data) {
            if (this.startPoi) {
                this.startPoi.selected = false
            }
            this.startPoi = data
            this.startPoiName = data.name

            if (this.endPoi) {
                this.doNavigate()
            }
        },
        setEndPoi(data) {
            if (this.endPoi) {
                this.endPoi.selected = false
            }
            this.endPoi = data
            this.endPoiName = data.name

            if (this.startPoi) {
                this.doNavigate()
            }
        },
        selectPoi(data) {
            if (this.startEnd === 1) {
                this.setStartPoi(data)
            } else if (this.startEnd === 2) {
                this.setEndPoi(data)
            }

            data.selected = true
        },
        getPoiByTip: function(tip) {
            return ds.getPoiByTip(this.buildingId, tip)
        },
        selectPoiOnMap() {
            this.$router.push({
                path: '/selectPoi',
                query: {
                    buildingId: this.buildingId,
                    floorId: this.floorId,
                    startEnd: this.startEnd,
                    sPoiId: this.startPoi ? this.startPoi.poi_id : '',
                    ePoiId: this.endPoi ? this.endPoi.poi_id : ''
                }
            });
        },
        doNavigate() {
            console.log('kkkkkkkkk');
        }
    },
    mounted: function() {
        if (this.sPoiId) {
            ds.getPoiById(this.sPoiId).then(data => {
                this.setStartPoi(data)
            })
        }
        if (this.ePoiId) {
            ds.getPoiById(this.ePoiId).then(data => {
                this.setEndPoi(data)
            })
        }
    }
}
</script>
<style>
/** 覆盖search部分样式 */

.mint-search {
    height: auto;
}

.mint-search-list {
    display: none
}
</style>
