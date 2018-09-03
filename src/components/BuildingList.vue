<template>
    <div class="container">
        <mt-header title="商场列表"></mt-header>
        <div class="building-list">
            <mt-cell v-for="item in buildings" :key="item.building_id" :to="item.routeUrl" :title="item.name" :label="item.address" is-link>
                <img src="/images/logo.png" class="building-icon">
            </mt-cell>
        </div>
    </div>
</template>
<script>
import ds from '../utils/service'

export default {
    name: 'BuildingList',
    data: function() {
        return {
            buildings: []
        };
    },
    mounted: function() {
        ds.getBuildingList().then(data => {
            if (data) {
                data.forEach(it => {
                    it.routeUrl = '/buildingMap?buildingId=' + it.building_id
                });
                this.buildings = data;
            }
        })
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.building-list {
    margin-top: 3px;
}

img.building-icon {
    width: 50px;
    height: 50px;
    /* border: 1px solid #eee; */
}
</style>