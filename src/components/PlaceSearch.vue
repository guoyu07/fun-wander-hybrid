<template>
    <div class="PlaceSearch">
        <!-- header -->
        <mt-header :title="$route.query.name">
            <router-link to="/" slot="left"><mt-button icon="back"></mt-button></router-link>
        </mt-header>
        <!-- 搜索 -->
        <mt-search :show="true" v-model="startValue"></mt-search>
        <mt-search :show="true" v-model="endValue"></mt-search>
        <!-- tab页 -->
        <mt-navbar style="margin-bottom: 5px" v-model="selected">
            <mt-tab-item id="1">名称搜索</mt-tab-item>
            <mt-tab-item id="2" @click.native="pointSelectOnMap()">地图选点</mt-tab-item>
        </mt-navbar>
        <!-- 搜索结果 -->
        <mt-index-list>
            <mt-index-section v-for="(place, index) in result" :key="index" :index="place.index" >
                <mt-cell v-for="p in place.data" :key="p.poi_id" :n="p.name" :title="p.name"></mt-cell>
            </mt-index-section>
        </mt-index-list>
    </div>
</template>

<script>
    import ajax from '@/utils/ajax';
    import appHeader from '@/components/header'
    export default {
        name: 'PlaceSearch',
        props: {},
        data() {
            return {
                timer: null,
                selected: '1',
                startValue: null,
                endValue: null,
                result: []
            }
        },
        components: {appHeader},
        watch: {
            startValue (newValue, oldValue) {
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
            pointSelectOnMap() {
                this.$router.push({path: `main/point?id=6101000094&name=荣民龙首广场`});
            },
            loadDataList: function (searchName) {
                const param = { buildingId: 6101000094, tip: searchName };
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
        mounted: function() {},
    };
</script>

<style scoped>
    .PlaceSearch {
        display: flex;
        flex-direction: column;
        height: 100%;
    }
</style>
