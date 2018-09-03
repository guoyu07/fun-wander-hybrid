import ajax from './ajax'

const getBuildingList = function () {
    return ajax
        .get('/indoor/building')
        .then(res => {
            if (res && res.data) {
                return res.data
            } else {
                return null
            }
        })
}

const getBuildingById = function (buildingId) {
    return ajax
        .get(`/indoor/building/${buildingId}`)
        .then(res => {
            if (res && res.data && res.data.length > 0) {
                return res.data[0]
            } else {
                return null
            }
        })
}

const getFloorByBuilding = function (buildingId) {
    return ajax
        .get(`/indoor/building/floor/${buildingId}`)
        .then(res => {
            if (res && res.data) {
                return res.data
            } else {
                return null
            }
        })
}

const getFaceByFloor = function (floorId) {
    return ajax
        .get(`/indoor/building/floor/face/${floorId}`)
        .then(res => {
            if (res && res.data) {
                return res.data
            } else {
                return null
            }
        })
}

const getLinkByFloor = function (floorId) {
    return ajax
        .get(`/indoor/building/floor/link/${floorId}`)
        .then(res => {
            if (res && res.data) {
                return res.data
            } else {
                return null
            }
        })
}

const getNodeByFloor = function (floorId) {
    return ajax
        .get(`/indoor/building/floor/node/${floorId}`)
        .then(res => {
            if (res && res.data) {
                return res.data
            } else {
                return null
            }
        })
}

const getPoiByFloor = function (floorId) {
    return ajax
        .get(`/indoor/building/floor/poi/${floorId}`)
        .then(res => {
            if (res && res.data) {
                return res.data
            } else {
                return null
            }
        })
}

const getPoiById = function (poiId) {
    return ajax
        .get(`/indoor/building/poi/${poiId}`)
        .then(res => {
            if (res && res.data && res.data.length > 0) {
                return res.data[0]
            } else {
                return null
            }
        })
}

const getPoiByTip = function (buildingId, tip) {
    return ajax
        .get('/indoor/building/search/poi', {
            buildingId,
            tip
        })
        .then(res => {
            if (res && res.data) {
                return res.data
            } else {
                return null
            }
        })
}

const getNavigateRoute = function (buildingId, sNodeId, eNodeId) {
    return ajax
        .get('/indoor/building/link/route', {
            buildingId,
            sNodeId,
            eNodeId
        })
        .then(res => {
            if (res && res.data) {
                return res.data
            } else {
                return null
            }
        })
}

export default {
    getBuildingList,
    getBuildingById,
    getFloorByBuilding,
    getFaceByFloor,
    getLinkByFloor,
    getNodeByFloor,
    getPoiByFloor,
    getPoiById,
    getPoiByTip,
    getNavigateRoute
}
