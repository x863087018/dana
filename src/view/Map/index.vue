<template>
    <div>
        <div id="map"></div>
    </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { onMounted } from 'vue';
const map = ref<any>()
onMounted(() => {
    initMap()
})
const initMap = () => {
    const gaodeMapUrl = 'https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}';
    map.value = new Map({
        view: new View({
            center: [121, 29],
            zoom: 8,
            projection: "EPSG:4326"
        }),
        layers: [
            new TileLayer({
                source: new XYZ({
                    url: gaodeMapUrl
                })
            })
        ],
        target: 'map'
    });


}
</script>
<style lang="scss" scoped>
#map {
    width: 100%;
    height: 500px;
}
</style>