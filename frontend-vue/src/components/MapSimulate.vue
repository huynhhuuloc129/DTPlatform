<template>
    <div
        style="position:absolute;top:15px;left:15px;border-radius:5px;padding:5px;background-color:white; z-index: 500;">
        Select weather overlay:
        <select @change="updateTileLayer($event)" title="Select weather overlay">
            <option value="microsoft.weather.radar.main">Radar</option>
            <option value="microsoft.weather.infrared.main" selected="selected">Infrared</option>
        </select>
        <br /><br />
        <input type="button" value="Play" title="Play" @click="playAnimation" />
        <input type="button" value="Pause" title="Pause" @click="pauseAnimation" />
        <input type="button" value="Stop" title="Stop" @click="stopAnimation" />
        <input type="button" value="Reset" title="Reset" @click="resetAnimation" />
        <br /><br />
        Speed:
        <select @change="setSpeed($event)" title="Speed">
            <option value="0.5">0.5x</option>
            <option selected="selected" value="1">1x</option>
            <option value="2">2x</option>
            <option value="5">5x</option>
        </select>
    </div>

    <!-- <div id="messagePanel"
        style="position: absolute;top: 20px;right: 20px;background-color: white;padding: 2px;border-radius: 15px;width: 110px;text-align: center; z-index: 500;">
    </div> -->


    <div id="mapContainer"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const map = ref(null);
const layer = ref(null);
const timer = ref(null);
const displayMessages = ref([]);

const boundingBox = [
    [105.878868, 21.06872], // Bottom-left corner
    [105.788963, 20.97431]  // Top-right corner
];

//Base weather tile layer URL for radar data. {azMapsDomain} is a placeholder that is set automatically by the map, and will also automatically append the map credentials to the request.
var urlTemplate = 'https://{azMapsDomain}/map/tile?api-version=2022-08-01&tilesetId={tilesetId}&zoom={z}&x={x}&y={y}&timeStamp={timeStamp}&tileSize=256&view=Auto';

//Details on the availability of the different weather layers.
var weatherLayers = {
    'microsoft.weather.infrared.main': {
        interval: 10 * 60 * 1000, //10 minute interval
        past: 3 * 60 * 60 * 1000, //Data available up to 3 hours in the past.
        future: 0 //Forecast data not avaiable.
    },
    'microsoft.weather.radar.main': {
        interval: 5 * 60 * 1000, //5 minute interval
        past: 1.5 * 60 * 60 * 1000, //Data available up to 1.5 hours in the past.
        future: 1.5 * 60 * 60 * 1000 //Data available up to 1.5 hours in the future.
    }
};


onMounted(() => {
    map.value = new atlas.Map('mapContainer', {
        center: [105.804817, 21.028511],
        zoom: 5,
        // style: 'grayscale_dark',
        view: 'Auto',

        authOptions: {

            authType: atlas.AuthenticationType.subscriptionKey,
            subscriptionKey: import.meta.env.VITE_AZURE_MAP_KEY
        }
    });

    map.value.events.add('ready', function () {
        loadWeatherLayer('microsoft.weather.infrared.main');
        //Create a vector tile source and add it to the map.
        var datasource = new atlas.source.VectorTileSource(null, {
            tiles: ['https://{azMapsDomain}/traffic/flow/tile/pbf?api-version=1.0&style=relative&zoom={z}&x={x}&y={y}'],
            maxZoom: 22
        });
        map.value.sources.add(datasource);

        //Common style options for traffic background colors.
        var trafficBackgroundOptions = {
            //The name of the data layer within the data source to pass into this rendering layer.
            sourceLayer: 'Traffic flow',

            //Color the roads based on the level of traffic.
            strokeColor: [
                'step',
                ['get', 'traffic_level'],
                '#6B0512', //Dark red
                0.01, '#EE2F53', //Red
                0.8, 'orange', //Orange
                1, "#66CC99" //Green
            ],

            //Scale the width of roads based on the level of traffic.
            strokeWidth: [
                'interpolate',
                ['exponential', 2],
                ['zoom'],
                12, 3,
                17, 9
            ],
        };

        //Create two line layer for the base traffic flow color. One layer for both direction traffic data, and one layer for single line traffic data.
        map.value.layers.add([
            new atlas.layer.LineLayer(datasource, null, Object.assign({
                //For traffic data that represents one side of the road, offset it.
                offset: [
                    'interpolate',
                    ['exponential', 2],
                    ['zoom'],
                    12, 2,
                    17, 6
                ],

                filter: ['==', ['get', 'traffic_road_coverage'], 'one_side']
            }, trafficBackgroundOptions)),

            new atlas.layer.LineLayer(datasource, null, Object.assign({
                filter: ['==', ['get', 'traffic_road_coverage'], 'full']
            }, trafficBackgroundOptions))
        ], 'labels');

        //Common style options for traffic flow dashed lines.
        var trafficFLowLineOptions = {
            sourceLayer: 'Traffic flow',
            strokeColor: 'black',

            //Scale the width of roads based on the level of traffic.
            strokeWidth: [
                'interpolate',
                ['exponential', 2],
                ['zoom'],
                12, 1,
                17, 4
            ]
        };

        //Create an offset for the layers that has two directional traffic data.
        var offsetExp = [
            'interpolate',
            ['exponential', 2],
            ['zoom'],
            12, 3,
            17, 7
        ];

        //Create line layers for the different levels of traffic flow.
        var oneSideSlowFlowLayer = new atlas.layer.LineLayer(datasource, null, Object.assign({
            offset: offsetExp,
            filter: ['all', ['==', ['get', 'traffic_road_coverage'], 'one_side'], ['>', ['get', 'traffic_level'], 0], ['<=', ['get', 'traffic_level'], 0.01]]
        }, trafficFLowLineOptions));

        var slowFlowLayer = new atlas.layer.LineLayer(datasource, null, Object.assign({
            filter: ['all', ['==', ['get', 'traffic_road_coverage'], 'full'], ['>', ['get', 'traffic_level'], 0], ['<=', ['get', 'traffic_level'], 0.01]]
        }, trafficFLowLineOptions));

        var oneSideMidFlowLayer = new atlas.layer.LineLayer(datasource, null, Object.assign({
            offset: offsetExp,
            filter: ['all', ['==', ['get', 'traffic_road_coverage'], 'one_side'], ['>', ['get', 'traffic_level'], 0.01], ['<=', ['get', 'traffic_level'], 0.8]]
        }, trafficFLowLineOptions));

        var midFlowLayer = new atlas.layer.LineLayer(datasource, null, Object.assign({
            filter: ['all', ['==', ['get', 'traffic_road_coverage'], 'full'], ['>', ['get', 'traffic_level'], 0.01], ['<=', ['get', 'traffic_level'], 0.8]]
        }, trafficFLowLineOptions));

        var oneSideFastFlowLayer = new atlas.layer.LineLayer(datasource, null, Object.assign({
            offset: offsetExp,
            filter: ['all', ['==', ['get', 'traffic_road_coverage'], 'one_side'], ['>', ['get', 'traffic_level'], 0.8]]
        }, trafficFLowLineOptions));

        var fastFlowLayer = new atlas.layer.LineLayer(datasource, null, Object.assign({
            filter: ['all', ['==', ['get', 'traffic_road_coverage'], 'full'], ['>', ['get', 'traffic_level'], 0.8]]
        }, trafficFLowLineOptions));

        //Add the layers below the labels to make the map clearer.
        map.value.layers.add([oneSideSlowFlowLayer, slowFlowLayer, oneSideMidFlowLayer, midFlowLayer, oneSideFastFlowLayer, fastFlowLayer], 'labels');

        //Create a moving dashed line animation for each of the flow layers, but with different speedMultipliers.
        //Reverse the animation direction as it appears to ensure the correct flow directions for different side of the road for most countries (drive on the right side).
        var animationOptions = {
            gapLength: 2,
            dashLength: 2,
            duration: 2000,
            autoPlay: true,
            loop: true,
            reverse: true
        };

        if (atlas.animations) {
            atlas.animations.flowingDashedLine(oneSideSlowFlowLayer, Object.assign({ speedMultiplier: 0.25 }, animationOptions));
            atlas.animations.flowingDashedLine(slowFlowLayer, Object.assign({ speedMultiplier: 0.25 }, animationOptions));
            atlas.animations.flowingDashedLine(oneSideMidFlowLayer, Object.assign({ speedMultiplier: 1 }, animationOptions));
            atlas.animations.flowingDashedLine(midFlowLayer, Object.assign({ speedMultiplier: 1 }, animationOptions));
            atlas.animations.flowingDashedLine(oneSideFastFlowLayer, Object.assign({ speedMultiplier: 4 }, animationOptions));
            atlas.animations.flowingDashedLine(fastFlowLayer, Object.assign({ speedMultiplier: 4 }, animationOptions));
        } else {
            console.error('Atlas animations are not loaded.');
        }
    });
})


function loadWeatherLayer(tilesetId) {
    //If there is already a layer, stop it animating.
    if (layer.value) {
        layer.value.stop();
        clearInterval(timer);
    }

    //Get the current time.
    var now = new Date().getTime();

    //Get the details for the requested weather layer.
    var layerInfo = weatherLayers[tilesetId];

    //Calculate the number of timestamps.
    var numTimestamps = (layerInfo.past + layerInfo.future) / layerInfo.interval;

    var tlOptions = [];

    for (var i = 0; i < numTimestamps; i++) {
        //Calculate time period for an animation frame. Shift the interval by one as the olds tile will expire almost immediately.
        var time = (now - layerInfo.past) + (i + 1) * layerInfo.interval;

        //Create a tile layer option for each timestamp.
        tlOptions.push(createTileLayer(tilesetId, time));

        //Optionally, create a message to display for each frame of the animation based on the time stamp.
        if (time === now) {
            displayMessages.value.push('Current');
        } else {
            var dt = (time - now) / 1000 / 60;
            displayMessages.value.push(`${dt} minutes`);
        }
    }

    if (layer.value) {
        layer.value.setOptions({
            tileLayerOptions: tlOptions
        });
        layer.value.play();
    } else {
        //Create the animation manager.
        layer.value = new atlas.layer.AnimatedTileLayer({
            tileLayerOptions: tlOptions,
            duration: numTimestamps * 800, //Allow one second for each frame (tile layer) in the animation.
            autoPlay: true,
            loop: true
        });

        //Add an event to the underlying frame animation to update the message panel when the frame changes.
        // map.value.events.add('onframe', layer.value.getPlayableAnimation(), function (e) {
        //     if (e.frameIdx >= 0) {
        //         var msg = displayMessages.value[e.frameIdx];
        //         document.getElementById('messagePanel').innerText = msg;
        //     }
        // });

        //Add the layer to the map.
        map.value.layers.add(layer.value, 'labels');

        //Setup an interval timer to shift the layers (remove oldest, add newest) based on the update interval of the tile layer.
        timer.value = setInterval(intervalHandler(tilesetId), layerInfo.interval);
    }
}

function createTileLayer(tilesetId, time) {
    //Create an ISO 8601 timestamp string.
    //JavaScripts format for ISO string includes decimal seconds and the letter "Z" at the end that is not supported. Use slice to remove this.
    var timestamp = new Date(time).toISOString().slice(0, 19);

    //Create a tile layer option for each timestamp.
    return {
        tileUrl: urlTemplate.replace('{tilesetId}', tilesetId).replace('{timeStamp}', timestamp),
        tileSize: 256,      //Weather tiles only available in 256 pixel size.
        opacity: 0.9,
        maxSourceZoom: 15   //Weather tiles only available to zoom level 15. If you zoom in closer, the map may pull tiles from level 15 to fill the map.
    };
}

function intervalHandler(tilesetId) {
    return function () {
        //Get the details for the requested weather layer.
        var layerInfo = weatherLayers[tilesetId];

        //Calculate time period for an animation frame. Shift the interval by one as the olds tile will expire almost immediately.
        var time = (now - layerInfo.past) + (i + 1) * layerInfo.interval;

        //Create an ISO 8601 timestamp string.
        //JavaScripts format for ISO string includes decimal seconds and the letter "Z" at the end that is not supported. Use slice to remove this.
        var timestamp = new Date(time).toISOString().slice(0, 19);

        //Get the current tile layer options from the animation layer.
        var layers = layer.value.getOptions().tileLayerOptions;

        //Remove the oldest tile layer options.
        tlOptions.shift();

        //Add the newest tile layer options.
        tlOptions.push(createTileLayer(tilesetId, time));

        //Update the animation layer.
        layer.value.setOptions({ tileLayerOptions: tlOptions });
    }
}

function updateTileLayer(event) {
    const tilesetId = event.target.value;
    loadWeatherLayer(tilesetId);
}

function setSpeed(event) {
    const speed = parseFloat(event.target.value);

    layer.value.setOptions({ speedMultiplier: speed });
}

function playAnimation() {
    if (layer.value) {
        layer.value.play();
    }
}

function pauseAnimation() {
    if (layer.value) {
        layer.value.pause();
    }
}

function stopAnimation() {
    if (layer.value) {
        layer.value.stop();
    }
}

function resetAnimation() {
    if (layer.value) {
        layer.value.reset();
    }
}

</script>

<style scoped>
#mapContainer {
    width: 100%;
    height: 100%;
}
</style>
