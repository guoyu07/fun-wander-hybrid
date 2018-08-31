<template>
    <div id="leafletMap" class="map-container"></div>
</template>
<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import dao from '../utils/service'
import render from '../utils/render'

L.Icon.Default.prototype.options.imagePath = '/res/leaflet/images/'

const def_center = [34.300590391379714, 108.94400235446722]
const def_zoom = 19

export default {
    name: 'IndoorMap',
    props: {
        buildingId: {
            type: String,
            required: true
        },
        floorId: String,
        showCenterMarker: { // 是否显示地图中心点图标
            type: Boolean,
            default: false
        },
        enablePoiSelect: { // 是否开启POI点选功能
            type: Boolean,
            default: false
        },
        zoom: {
            type: Number,
            default: def_zoom
        },
        center: {
            type: [Object, Array],
            default: function() {
                return def_center
            }
        },
        markers: Array,
        polylines: Array
    },
    data: function() {
        return {
            map: null,
            floorLayers: []
        }
    },
    watch: {
        floorId: function(newVal) {
            this.reloadFloorLayers(this.map, newVal)
        }
    },
    mounted: function() {
        // 创建地图;
        this.map = this.createMap()

        this.loadBuildingLayers(this.map, this.buildingId, this.floorId)
    },
    methods: {
        // 加载腾讯地图;
        createMap: function() {
            const map = L.map('leafletMap', {
                minZoom: 5,
                maxZoom: 24,
                zoomControl: false,
                attributionControl: false
            }).setView(this.center, this.zoom)

            // 腾讯底图
            L.tileLayer('http://{s}.map.gtimg.com/realtimerender?z={z}&x={x}&y={y}&type=vector&style=0', {
                // attribution: 'test',
                minZoom: 5,
                maxZoom: 18,
                id: 'mapbox.streets',
                subdomains: ['rt0', 'rt1', 'rt2', 'rt3'],
                tms: true
            }).addTo(map)

            if (this.showCenterMarker) {
                const myIcon = L.icon({
                    iconUrl: '/images/pin.png',
                    iconSize: [32, 32],
                    iconAnchor: [16, 32]
                });
                const centerMarker = L.marker(map.getCenter(), { icon: myIcon }).addTo(map)
                map.on('move', function() {
                    centerMarker.setLatLng(map.getCenter())
                })
            }

            map.on('moveend', () => {
                this.$emit('map-moveend', { zoom: map.getZoom(), center: map.getCenter() })
            })

            return map
        },
        loadBuildingLayers: function(map, buildingId, floorId) {
            if (!map || !buildingId) {
                throw new Error('缺少加载室内地图的信息');
            }

            const p = dao.getBuildingById(buildingId).then(data => {
                if (data) {
                    const center = data.center_coordinate.split(',').map(it => parseFloat(
                        it)).reverse()
                    const feature = render.createFeature(data, 'building_id')

                    L.geoJSON(feature, { style: render.getBuildingStyle }).addTo(map)

                    if (this.center === def_center) {
                        map.setView(center);
                    }

                    return data
                }
            })

            if (floorId) {
                this.reloadFloorLayers(map, floorId)
            } else {
                p.then(data => {
                    if (data && data.default_fl_id) {
                        this.reloadFloorLayers(map, data.default_fl_id)
                    }
                })
            }
        },
        bindSelectPoiEvent: function(map, faceLayer, poiLayer) {
            let selectedPoiId = null // POI反选控制
            let poiFaceMarker // POI选中时的高亮Face图层
            let poiMarker // POI选中时的高亮点图层

            // 点击地图空白处反选POI
            map.on('click', e => {
                // 如果没有选中POI，则清除之前的高亮图层
                if (!selectedPoiId) {
                    if (poiFaceMarker) {
                        poiFaceMarker.remove()
                    }
                    if (poiMarker) {
                        poiMarker.remove()
                    }
                }

                this.$emit('select-poi', selectedPoiId)

                selectedPoiId = null
            })

            // 绑定POI选择操作
            faceLayer.on('click', function(e) {
                if (poiFaceMarker) {
                    poiFaceMarker.remove()
                }
                if (poiMarker) {
                    poiMarker.remove()
                }

                const poiId = e.layer.feature.properties.poi_id
                if (poiId) {
                    poiFaceMarker = L.geoJSON(e.layer.feature, {
                        style: {
                            color: 'blue',
                            fill: false
                        }
                    }).addTo(map)

                    let poiLatLng
                    for (const it of poiLayer.getLayers()) {
                        if (it.feature.properties.id === poiId) {
                            poiLatLng = it.feature.geometry.coordinates.slice().reverse()
                            poiMarker = L.marker(poiLatLng).addTo(map)
                            break;
                        }
                    }

                    map.setView(poiLatLng)

                    selectedPoiId = poiId
                }
            })
        },
        reloadFloorLayers: function(map, floorId) {
            if (!map || !floorId) {
                throw new Error('缺少加载室内地图的信息');
            }

            // 清空楼层相关的图层
            this.floorLayers.forEach(it => it.remove())

            const p1 = dao.getFaceByFloor(floorId).then(data => {
                if (data) {
                    const features = data.map(it => render.createFeature(it, 'face_id'))
                    const layer = L.geoJSON(features, {
                        style: render.getFaceStyle
                    }).addTo(map)
                    this.floorLayers.push(layer)

                    return layer
                }
            })

            dao.getLinkByFloor(floorId).then(data => {
                if (data) {
                    const features = data.map(it => render.createFeature(it, 'link_id'))
                    const layer = L.geoJSON(features, { style: render.getLinkStyle }).addTo(map)
                    this.floorLayers.push(layer)

                    return layer
                }
            })

            dao.getNodeByFloor(floorId).then(data => {
                if (data) {
                    const features = data.map(it => render.createFeature(it, 'node_id'))
                    const layer = L.geoJSON(features, {
                        style: render.getNodeStyle,
                        pointToLayer: function(feature, latlng) {
                            return L.circleMarker(latlng)
                        }
                    }).addTo(map)
                    this.floorLayers.push(layer)

                    return layer
                }
            })

            const p2 = dao.getPoiByFloor(floorId).then(data => {
                if (data) {
                    const features = data.map(it => render.createFeature(it, 'poi_id'))
                    const layer = L.geoJSON(features, {
                            style: render.getPoiPointStyle,
                            pointToLayer: function(feature, latlng) {
                                return L.circleMarker(latlng)
                            }
                        })
                        .addTo(map)
                    this.floorLayers.push(layer)

                    const textLayer = L.geoJSON(features, {
                        pointToLayer: function(feature, latlng) {
                            const iconStyle = render.getPoiTextIconStyle(feature)

                            return L.marker(latlng, { icon: L.divIcon(iconStyle) });
                        }
                    }).addTo(map)
                    this.floorLayers.push(textLayer)

                    return layer
                }
            })

            if (this.enablePoiSelect) {
                Promise.all([p1, p2]).then(layers => {
                    this.bindSelectPoiEvent(map, layers[0], layers[1])
                })
            }
        }
    }
};
</script>
<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
.map-container {
    width: 100%;
    height: 100%;
}
</style>