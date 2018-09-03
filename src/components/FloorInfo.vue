<template>
    <div class="footer">
        <div class="title" @click="openFlag=!openFlag">
            <i class="left-image">
                <img v-if="!openFlag" src="/images/slideUp.png"/>
                <img v-if="openFlag" src="/images/slideDown.png"/>
            </i>
            <span v-if="selectedFloor" class="name">
                {{selectedFloor.fl_name}}-{{selectedFloor.fl_infor}}
            </span>
            <mt-button class="right-button" type="primary" size="small" @click.stop="routeTo()">路 线</mt-button>
        </div>
        <div class="content" v-show="openFlag">
            <div v-for="item in floors" @click="selectFloor(item)">
                <div v-if="item.fl_id===selectedFloor.fl_id">
                    <mt-cell :title="item.fl_name" :value="item.fl_infor" icon="success"></mt-cell>
                </div>
                <div v-else>
                    <mt-cell :title="item.fl_name" :value="item.fl_infor"></mt-cell>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import ds from '@/utils/service'

export default {
    name: 'FloorInfo',
    props: {
        buildingId: {
            type: String,
            required: true
        },
        floorId: String
    },
    data() {
        return {
            floors: [],
            selectedFloor: null,
            openFlag: false
        }
    },
    mounted: function() {
        ds.getFloorByBuilding(this.buildingId).then(res => {
            this.floors = res
            if (this.floorId) {
                for (const it of res) {
                    if (it.fl_id === this.floorId) {
                        this.selectedFloor = it
                        break
                    }
                }
            } else {
                this.selectedFloor = this.floors[0]
            }
        });
    },
    methods: {
        routeTo() {
            this.$router.push({
                path: '/naviPath',
                query: {
                    buildingId: this.buildingId,
                    floorId: this.selectedFloor.fl_id
                }
            });
        },
        selectFloor(item) { // 选择楼层
            if (item.fl_id == this.selectedFloor.fl_id) {
                return;
            }

            this.selectedFloor = item;

            this.$emit('change-floor', this.selectedFloor.fl_id)
        }
    }
}
</script>
<style scoped>
.footer {
    position: absolute;
    width: 100%;
    z-index: 999;
    left: 0px;
    bottom: 0px;
}

.footer .title {
    padding: 10px;
    background-color: #ffffff;
    color: black;
    font-size: 14px;
    border-bottom: #c3c3c3 1px solid;
}

.footer .title .right-button {
    float: right;
    padding: 1px 20px;
    height: 22px;
    line-height: 22px;
}

.footer .left-image img {
    width: 20px;
    height: 20px;
    vertical-align: bottom;
}

.footer .content {
    height: 150px;
    max-height: 150px;
    background-color: #ffffff;
    overflow: auto;
}
</style>