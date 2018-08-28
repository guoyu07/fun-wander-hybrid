<template>
    <div class="PlaceSearch">
        <!-- header -->
        <mt-header title="起始点选择">
            <router-link to="" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link>
        </mt-header>
        <!-- 搜索 -->
        <mt-search :show="true" @click.native="searchFocus('start')" v-model="startValue"></mt-search>
        <mt-search :show="true" @click.native="searchFocus('end')" v-model="endValue"></mt-search>
        <!-- tab页 -->
        <mt-navbar style="margin-bottom: 5px" v-model="selected">
            <mt-tab-item id="1">名称搜索</mt-tab-item>
            <mt-tab-item id="2" @click.native="pointSelectOnMap()">地图选点</mt-tab-item>
        </mt-navbar>
        <!-- 搜索结果 -->
        <mt-index-list>
            <mt-index-section v-for="(place, index) in result" :key="index" :index="place.index" >
                <mt-cell v-for="p in place.data" @click.native="selectFromList(p)" :key="p.poi_id" :n="p.name" :title="p.name"></mt-cell>
            </mt-index-section>
        </mt-index-list>
    </div>
</template>

<script>
    import ajax from '@/utils/ajax';
    export default {
        name: 'PlaceSearch',
        props: {},
        data() {
            return {
                timer: null,
                selected: '1',
                startValue: null,
                endValue: null,
                result: [],
                whichPoint: 'start',
                isSelected: false
            }
        },
        watch: {
            startValue (newValue, oldValue) {
                if (this.isSelected) return;
                if (this.timer) clearTimeout(this.timer);
                if (!newValue) {
                    return this.result = [];
                }
                this.timer = setTimeout(() => {
                    this.loadDataList(newValue).then(res => {
                        this.result = res;
                    });
                }, 500);
            },
            endValue (newValue, oldValue) {
                if (this.isSelected) return;
                if (this.timer) clearTimeout(this.timer);
                if (!newValue) {
                    return this.result = [];
                }
                this.timer = setTimeout(() => {
                    this.loadDataList(newValue).then(res => {
                        this.result = res;
                    });
                }, 500);
            }
        },
        methods: {
            handleClose: function () {
                console.log('121212')
            },
            searchFocus: function(flag) {
                this.whichPoint = flag;
            },
            pointSelectOnMap() {
                this.$router.push({path: `/pointInfo?floorId=${this.globalData.currentFloorId}&name=${this.$route.query.name}&type=${this.whichPoint}`});
            },
            selectFromList(data) {
                if (this.whichPoint === 'start') {
                    this.startValue = data.name
                }
                if (this.whichPoint === 'end') {
                    this.endValue = data.name
                }
                this.isSelected = true;
                setTimeout(() => {
                    this.isSelected = false;
                }, 500);
                this.result = [];
            },
            loadDataList: function (searchName) {
                const param = { buildingId: 6101000094, tip: searchName };
                if (this.isSelected) return Promise.resolve([]);
                return ajax.get(`/indoor/building/search/poi/`, param).then(res => {
                    if(res.data && res.data.length !== 0) {
                        let resultObj = {}, resultArr = [];
                        res.data.forEach(e => {
                            resultObj[e.name[0]] = resultObj[e.name[0]] || [];
                            resultObj[e.name[0]].push(e);
                        })
                        for(var o in resultObj){
                            resultArr.push({
                                index: o,
                                data: resultObj[o]
                            })
                        }
                        return resultArr;
                    }
                    return [];
                });
            }
        },
        mounted: function() {
            if (this.$route.query.selectType) {
                this.whichPoint = this.$route.query.selectType;
            }
            if (this.$route.query.from === '/pointInfo') {
                if (this.whichPoint === 'start') {
                    this.startValue = this.$route.query.name;
                    this.endValue = this.globalData.searchInput.end;
                    this.globalData.searchInput.start = this.$route.query.name;
                }
                if (this.whichPoint === 'end') {
                    this.endValue = this.$route.query.name;
                    this.startValue = this.globalData.searchInput.start;
                    this.globalData.searchInput.end = this.$route.query.name;
                }
            } else {
                this.startValue =  this.globalData.searchInput.start = null;
                this.endValue = this.globalData.searchInput.end = null;
            }

            this.isSelected = true;
            setTimeout(() => {
                this.isSelected = false;
            }, 500);
        }
    };
</script>

<style scoped>
    .PlaceSearch {
        display: flex;
        flex-direction: column;
        height: 100%;
    }
</style>
