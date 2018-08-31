import util from './util';

const poi_face_fill_color_map = {
    9203002: '#fd7676', //公共受限区域
    9205000: '#939395', //空置单元
    //99905000:'#ddd',//空置单元（3）

    1103003: '#befe73', //客梯
    1102000: '#befe73', //楼梯
    1103001: '#befe73', //扶梯

    1303014: '#f69d70',
    1303004: '#d9ceff',
    1303020: '#f1d35b', //体育
    1303005: '#f69d70', //金
    1303015: '#fe9104', //玛斯威顿
    1303021: '#c6a5a3', //安踏体育
    1303001: '#fb8ec6', //服装
    //00303001:'#fb8ec6',//服装（3）
    //00303000:'#fb8ec6',//恒源祥
    1303002: '#c6a5a3', //鞋
    1304000: '#81effe', //保健
    1303000: '#f69d70', //商铺
    1306004: '#04feef', //中国移动
    1303007: '#f1d35b', //手机

    2707000: '#affed1', //医药超市
    2301000: '#d9ceff', //zhiao
    1303009: '#f69d70', //酒
};

const createFeature = function (data, idKey = 'id') {
    const properties = {}
    let geometry = null
    for (let [k, v] of Object.entries(data)) {
        if (k === idKey) {
            properties.id = v;
        } else if (k === 'geometry') {
            geometry = util.wktToGeojson(data.geometry)
        } else {
            properties[k] = v;
        }
    }
    return {
        type: 'Feature',
        properties,
        geometry
    }
}

const getBuildingStyle = function (feature) {
    return {
        color: '#d1a990', //商城边框色
        fill: true,
        fillColor: '#f8c0e3', //商城地面色
        fillOpacity: 0.2
    }
}

const getFaceStyle = function (feature) {
    return {
        color: feature.selected ? 'blue' : '#e2d7de', //店铺边框色彩
        fill: true,
        fillColor: poi_face_fill_color_map[feature.properties.poi_kind] || '#f1d35b', //店铺内部色彩
        fillOpacity: 0.8
    }
}

const getLinkStyle = function (feature) {
    return {
        color: '#fff' //线路色彩
    }
}

const getNodeStyle = function (feature) {
    return {
        radius: 2,
        color: '#fde3b1',
        fill: true,
        fillColor: '#000',
        fillOpacity: 1
    }
}

const getPoiPointStyle = function (feature) {
    return {
        radius: 2,
        color: '#fde3b1',
        fill: true,
        fillColor: '#000',
        fillOpacity: 1
    }
}

const getPoiTextIconStyle = function (feature) {
    return {
        html: feature.properties.name,
        className: 'div-icon',
        iconSize: [50, 20],
        iconAnchor: [25, -5],
    }
}

export default {
    createFeature,
    getBuildingStyle,
    getFaceStyle,
    getLinkStyle,
    getNodeStyle,
    getPoiPointStyle,
    getPoiTextIconStyle
}
