import VueRouter from 'vue-router';

// import areaDataList from '../components/areaDataList.vue';
import MapBoxMap from '../components/MapBoxMap.vue';
import LeafletMap from '../components/LeafletMap.vue';
import MineMap from '../components/MineMap.vue';
import BuildingList from '../components/BuildingList.vue';
import NaviPath from '../components/NaviPath.vue';
import BuildingMap from '../components/BuildingMap.vue';
import SelectPoiOnMap from '../components/SelectPoiOnMap.vue';

const routes = [
    { path: '/', component: BuildingList },
    { path: '/buildingMap', component: BuildingMap },
    { path: '/naviPath', component: NaviPath },
    { path: '/selectPoi', component: SelectPoiOnMap },
    { path: '/map', component: LeafletMap },
    { path: '/mapbox', component: MapBoxMap },
    { path: '/minmap', component: MineMap }    
];

export default new VueRouter({
    routes
});