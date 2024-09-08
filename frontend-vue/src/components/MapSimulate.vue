<template>
    <Transition>
        <div id="container" style="position: absolute;">
            <div id="sidebarContainer" class="d-flex">
                <!-- Sidebar -->
                <nav id="sidebar" class="bg-light border-end">
                    <!-- Sidebar Header -->
                    <div class="p-3 border-bottom">
                        <div class="d-flex align-items-center justify-content-between">
                            <div id="backIcon">
                                <button class="btn btn-outline-dark" style="background-color: none;"
                                    @click="pushToDashBoard()">
                                    Trang chủ
                                </button>
                            </div>
                            <button id="arrow-left" @click="show = false; toggle()" class="btn btn-link p-0">
                                <i class="fas fa-arrow-left"></i>
                            </button>
                            <!-- <button class="btn btn-link p-0">
                            <i class="fas fa-ellipsis-v"></i>
                        </button> -->
                        </div>
                    </div>

                    <!-- Sidebar Content -->
                    <div class="p-3">
                        <!-- <div class="d-flex justify-content-between mb-3">
                            <div class="d-flex mb-3">
                                <div style="margin-bottom: 5px;">

                                    <input type="radio" @change="changeType(0)" class="btn-check" name="btnradio"
                                        id="btnradio" autocomplete="off" />
                                    <label class="btn btn-outline-secondary  label" for="btnradio">
                                        Tối ưu
                                    </label>

                                    <input checked type="radio" value=60 @change="changeType(1)" class="btn-check"
                                        name="btnradio" id="btnradioCar" autocomplete="off" />
                                    <label class="btn btn-outline-secondary  label" for="btnradioCar">
                                        <i class="fa-solid fa-car"></i>
                                    </label>

                                    <input type="radio" value=10 @change="changeType(2)" class="btn-check"
                                        name="btnradio" id="btnradioBike" autocomplete="off" />
                                    <label class="btn btn-outline-secondary  label" for="btnradioBike">
                                        <i class="fas fa-bicycle"></i>
                                    </label>

                                    <input type="radio" value=5 @change="changeType(3)" class="btn-check"
                                        name="btnradio" id="btnradioWalk" autocomplete="off" />
                                    <label class="btn btn-outline-secondary label" for="btnradioWalk">
                                        <i class="fas fa-walking"></i>
                                    </label>
                                </div>

                            </div>
                        </div> -->
                        <div id="geocoder">

                            <input type="text" @input="onStartInput" class="form-control" placeholder="Điểm bắt đầu"
                                v-model="addressStart">

                            <select
                                v-if="addressStart != undefined && addressStart.length > 0 && displaySuggestStart == true"
                                class="form-select" multiple :size="suggestionsStart.length">
                                <option value=1 v-for="(suggestion) in suggestionsStart"
                                    @click="addressStart = suggestion.address.freeformAddress; startPoint = suggestion.position; displaySuggestStart = false">
                                    {{ suggestion.address.freeformAddress }}
                                </option>
                            </select>

                            <div id="geocoder-icon" class="m-2">
                                <div class="text-center">
                                    <button :disabled="addressStart == '' || addressEnd == ''" class="btn btn-light"
                                        @click="swapPlace()">
                                        <i class="fa-solid fa-arrows-rotate"></i>
                                    </button>
                                </div>
                            </div>

                            <input type="text" @input="onEndInput" class="form-control" placeholder="Điểm kết thúc"
                                v-model="addressEnd">

                            <select v-if="addressEnd != undefined && addressEnd.length > 0 && displaySuggestEnd == true"
                                class="form-select" multiple :size="suggestionsEnd.length">
                                <option value=1 v-for="(suggestion) in suggestionsEnd"
                                    @click="addressEnd = suggestion.address.freeformAddress; endPoint = suggestion.position; displaySuggestEnd = false">
                                    {{ suggestion.address.freeformAddress }}
                                </option>
                            </select>

                            <button class="btn btn-dark mt-3" @click="geocode($event)">Tìm đường</button>
                        </div>
                        <hr>

                        <h5>Kết quả</h5>
                        <div id="resultsPanel"></div>

                        <hr>
                        <div class="fw-bold">

                            <div class="d-flex justify-content-between">
                                <span class="fw-bold">
                                    Thời tiết:
                                </span>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" @click="toggleWeatherLayer" type="checkbox"
                                        role="switch" id="flexSwitchCheckDefault">
                                </div>
                            </div>

                            <select class="form-select w-75" @change="updateTileLayer($event)"
                                title="Select weather overlay">
                                <option value="microsoft.weather.radar.main">Radar</option>
                                <option value="microsoft.weather.infrared.main" selected="selected">Infrared</option>
                            </select>
                            <br /><br />
                        </div>

                    </div>
                </nav>

            </div>
        </div>
    </Transition>
    <Transition>
        <div>
            <button id="arrow-right" v-if="show == false"
                style="position: absolute; z-index: 2; margin: 20px; background: white;" @click="show = true; toggle()"
                class="btn btn-link p-2">
                <i style="margin: 0 2px;" class="fas fa-arrow-right"></i>
            </button>

        </div>
    </Transition>



    <!-- <div id="messagePanel"
        style="position: absolute;top: 20px;right: 20px;background-color: white;padding: 2px;border-radius: 15px;width: 110px;text-align: center; z-index: 500;">
    </div> -->


    <div id="mapContainer"></div>
</template>

<script setup>
import AutoSuggestAzureServices from '@/services/autoSuggestAzure.services';
import PollutionService from '../services/pollution.services'
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'
import debounce from 'lodash/debounce';

const router = useRouter()
const show = ref(true)
const switchBtn = ref(false)
const lineLayer = ref(null)
const addressStart = ref(null)
const startPoint = ref(null)
const addressEnd = ref(null)
const endPoint = ref(null)
const suggestionsStart = ref([]);
const suggestionsEnd = ref([]);
const displaySuggestStart = ref(false), displaySuggestEnd = ref(false)

const routeColors = ['blue', '#800080', '#FF1493', '#00FFFF', '#FF00FF', '#40E0D0'];
var routeURL, map
const datasourceRoute = ref(null)

const dataBus = ref([])

const layer = ref(null);
const timer = ref(null);

// const boundingBox = [
//     [105.878868, 21.06872], // Bottom-left corner
//     [105.788963, 20.97431]  // Top-right corner
// ];

//Base weather tile layer URL for radar data. {azMapsDomain} is a placeholder that is set automatically by the map, and will also automatically append the map credentials to the request.
var urlTemplate = 'https://{azMapsDomain}/map/tile?api-version=2022-08-01&tilesetId={tilesetId}&zoom={z}&x={x}&y={y}&timeStamp={timeStamp}&tileSize=256&view=Auto';

const getSuggestionsStart = async () => {
    displaySuggestStart.value = true

    setTimeout(async () => { // delay the search
        if (addressStart.value) {

            let resp = await AutoSuggestAzureServices.getSuggestion(addressStart.value, import.meta.env.VITE_AZURE_MAP_KEY)
            suggestionsStart.value = resp.results;

        } else {
            suggestionsStart.value = [];
        }
    }, 500
    )
};

const getSuggestionsEnd = async () => {
    displaySuggestEnd.value = true

    setTimeout(async () => { // delay the search
        if (addressEnd.value) {

            let resp = await AutoSuggestAzureServices.getSuggestion(addressEnd.value, import.meta.env.VITE_AZURE_MAP_KEY)
            suggestionsEnd.value = resp.results;
        } else {
            suggestionsEnd.value = [];
        }
    }, 500
    )
};

const debouncedFetchStartSuggestions = debounce(getSuggestionsStart, 300);
const debouncedFetchEndSuggestions = debounce(getSuggestionsEnd, 300);

const onStartInput = () => {
    debouncedFetchStartSuggestions();
};

const onEndInput = () => {
    debouncedFetchEndSuggestions();
};

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

async function fetchJSON(url) {
    return fetch(url)
        .then(function (response) {
            return response.json();
        });
}

onMounted(async () => {

    map = new atlas.Map('mapContainer', {
        center: [105.804817, 21.028511],
        zoom: 12,
        // style: 'grayscale_dark',
        view: 'Auto',

        authOptions: {
            authType: atlas.AuthenticationType.subscriptionKey,
            subscriptionKey: import.meta.env.VITE_AZURE_MAP_KEY
        }
    });

    // add bus data
    // add bus data
    let resp = await fetchJSON('https://dtplatform.netlify.app/export.geojson')
    dataBus.value = resp.features

    for (let i = 0; i < dataBus.value.length; i++) {
        let lat = dataBus.value[i].geometry.coordinates[1]
        let lng = dataBus.value[i].geometry.coordinates[0]

        let description = ''
        if (dataBus.value[i].properties.name != undefined)
            description = `<div class="fw-bold">${dataBus.value[i].properties.name}</div>`

        let el = {
            htmlContent: `<div class="custom-marker-bus marker"><i class="fa-solid fa-bus text-white"></i></div>`,
            position: [lng, lat],
            popup: new atlas.Popup({
                content: description,
                pixelOffset: [0, -20]
            })
        }

        let marker = new atlas.HtmlMarker(el)
        map.markers.add(marker);

        map.events.add('click', marker, () => {
            marker.togglePopup();
        });
    }


    //Use MapControlCredential to share authentication between a map control and the service module.
    var pipeline = atlas.service.MapsURL.newPipeline(new atlas.service.MapControlCredential(map));

    //Construct the RouteURL object
    routeURL = new atlas.service.RouteURL(pipeline);

    // add pollution data
    await loadPollutionData();

    map.events.add('ready', function () {

        var datasource = new atlas.source.VectorTileSource(null, {
            tiles: ['https://{azMapsDomain}/traffic/flow/tile/pbf?api-version=1.0&style=relative&zoom={z}&x={x}&y={y}'],
            maxZoom: 22
        });
        map.sources.add(datasource);

        // for routing
        datasourceRoute.value = new atlas.source.DataSource();
        map.sources.add(datasourceRoute.value);

        lineLayer.value = new atlas.layer.LineLayer(datasourceRoute.value, null, {
            // Get the route color using the resultIndex property of the route line. 
            strokeColor: ['to-color', ['at', ['get', 'resultIndex'], ['literal', routeColors]]],
            strokeWidth: 10,
            lineJoin: 'round',
            lineCap: 'round',
        });
        map.layers.add(lineLayer.value, 'labels1');

        map.layers.add(new atlas.layer.SymbolLayer(datasourceRoute.value, null, {
            textOptions: {
                textField: ['get', 'title'],
                offset: [0, 1.2]
            },
            filter: ['any', ['==', ['geometry-type'], 'Point'], ['==', ['geometry-type'], 'MultiPoint']] //Only render Point or MultiPoints in this layer.
        }));

        // for traffic
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
        map.layers.add([
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
        map.layers.add([oneSideSlowFlowLayer, slowFlowLayer, oneSideMidFlowLayer, midFlowLayer, oneSideFastFlowLayer, fastFlowLayer], 'labels');

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

async function loadPollutionData() {
    const stations = [
        'hanoi',
        '@13414',
        '@1583',
        '@13686',
        'A230626',
        '@8641',
        'A476599',
        'A363001',
        'A230383',
        'A112819',
        'A80656',
        'A477292',
        'A230398'
    ];

    for (let i = 0; i < stations.length; i++) {

        let resp = await PollutionService.getPollution(import.meta.env.VITE_AQI_API_KEY, stations[i])
        // console.log(resp.data)
        if (resp.status == 'ok') {
            let aqi = resp.data.aqi;
            let coords = resp.data.city.geo;

            // adding description to marker
            let description = `<div style="margin: 10px">
                    <b>Station</b>: ${resp.data.city.name} <br>
                    <b>AQI</b>: ${aqi}  <br>
                    <b>Dominant Pollutant</b>: ${resp.data.dominentpol} <br>
                    `;
            if (resp.data.iaqi.pm25 != null) {
                description += `<b>PM2.5</b>: ${resp.data.iaqi.pm25.v} <br>`
            }
            if (resp.data.iaqi.pm10 != null) {
                description += `<b>PM10</b>: ${resp.data.iaqi.pm10.v} <br>`
            }
            if (resp.data.iaqi.h != null) {
                description += `<b>Humidity</b>: ${resp.data.iaqi.h.v} <br>`
            }
            if (resp.data.iaqi.t != null) {
                description += `<b>Temperature</b>: ${resp.data.iaqi.t.v} <br>`
            }
            if (resp.data.iaqi.p != null) {
                description += `<b>Pressure</b>: ${resp.data.iaqi.p.v} <br>`
            }
            if (resp.data.iaqi.w != null) {
                description += `<b>Wind</b>: ${resp.data.iaqi.w.v} <br>`
            }
            // calculate time and add to description
            let timeElapsed = Date.now() - Date.parse(resp.data.time.s);
            let minutesElapsed = Math.floor(timeElapsed / (1000 * 60));
            let hoursElapsed = Math.floor(timeElapsed / (1000 * 60 * 60));
            let daysElapsed = Math.floor(timeElapsed / (1000 * 60 * 60 * 24));

            let content = minutesElapsed + ' phút trước'
            if (minutesElapsed > 60) content = hoursElapsed + ' giờ trước'
            if (hoursElapsed > 24) content = daysElapsed + ' ngày trước'

            description += `<div class='text-secondary'>Cập nhật lần cuối: ${content} </div>`
            description += `</div>`

            let markerColor = 'green';
            if (aqi > 50 && aqi <= 100) {
                markerColor = 'yellow';
            } else if (aqi > 100 && aqi <= 150) {
                markerColor = 'red';
            } else if (aqi > 150 && aqi <= 200) {
                markerColor = 'purple';
            } else if (aqi > 200) {
                markerColor = 'brown';
            }

            let el = {
                htmlContent: `<div class="custom-marker marker ${markerColor}">${aqi}</div>`,
                position: [coords[1], coords[0]],
                popup: new atlas.Popup({
                    content: description,
                    pixelOffset: [0, -40]
                })
            }

            let marker = new atlas.HtmlMarker(el)
            map.markers.add(marker);

            map.events.add('click', marker, () => {
                marker.togglePopup();
            });
        }
    }
}

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

        var tileLayerOption = createTileLayer(tilesetId, time);

        //Create a tile layer option for each timestamp.
        tlOptions.push(tileLayerOption);
    }

    if (layer.value) {
        layer.value.setOptions({
            tileLayerOptions: tlOptions,
            speedMultiplier: 0.5
        });

        layer.value.play();
    } else {
        //Create the animation manager.
        layer.value = new atlas.layer.AnimatedTileLayer({
            tileLayerOptions: tlOptions,
            duration: numTimestamps * 800, //Allow one second for each frame (tile layer) in the animation.
            speedMultiplier: 0.5,
            autoPlay: true,
            loop: true
        });

        //Add the layer to the map.
        map.layers.add(layer.value, 'labels');

        //Setup an interval timer to shift the layers (remove oldest, add newest) based on the update interval of the tile layer.
        timer.value = setInterval(intervalHandler(tilesetId), layerInfo.interval);
    }
}

function createTileLayer(tilesetId, time) {

    var timestamp = new Date(time).toISOString().slice(0, 19);

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

function toggleWeatherLayer() {
    // e.preventDefault();
    switchBtn.value = !switchBtn.value

    if (switchBtn.value) {
        loadWeatherLayer('microsoft.weather.infrared.main');
    } else {
        if (layer.value) {
            map.layers.remove(layer.value);
            layer.value = null; // Ensure layer is reset.
        }
        // Stop the interval timer if necessary.
        if (timer.value) {
            clearInterval(timer.value);
            timer.value = null; // Ensure timer is reset.
        }
    }

}

function toggle() {  // toggle side bar
    var x = document.getElementById("container");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

function pushToDashBoard() {
    router.push('home')
}

// 
// routing
// 
async function geocode(e) {
    e.preventDefault();
    // this.clearMarkers();
    if (addressStart.value == null || addressEnd.value == null) return;

    // get start location
    let markerStart = new atlas.HtmlMarker({
        color: 'DodgerBlue',
        text: 'S',
        position: [startPoint.value.lon, startPoint.value.lat]
    })
    // get end location
    let markerEnd = new atlas.HtmlMarker({
        color: 'Red',
        text: 'E',
        position: [endPoint.value.lon, endPoint.value.lat]
    });

    map.markers.add(markerStart);
    map.markers.add(markerEnd);

    map.setCamera({
        bounds: [
            Math.min(startPoint.value.lon, endPoint.value.lon),
            Math.min(startPoint.value.lat, endPoint.value.lat),
            Math.max(startPoint.value.lon, endPoint.value.lon),
            Math.max(startPoint.value.lat, endPoint.value.lat)
        ], // Set the bounds to the defined area
        padding: 100,    // Optional: Add some padding around the bounds (in pixels)
        type: 'fly',    // Smooth transition
        duration: 2000
    });

    calculateRoute()
}

async function calculateRoute() {
    //Colors for the different routes.
    datasourceRoute.value.clear();

    var coordinates = [
        [startPoint.value.lon, startPoint.value.lat], [endPoint.value.lon, endPoint.value.lat]
    ];

    //Get the route options from the form.         
    var options = {
        maxAlternatives: 5,
        minDeviationTime: 0,
        minDeviationDistance: 0,
        postBody: {
            "supportingPoints": {
                "type": "GeometryCollection",
                "geometries": [
                    new atlas.data.Point([startPoint.value.lon, startPoint.value.lat]),
                    new atlas.data.Point([endPoint.value.lon, endPoint.value.lat])
                ]
            }
        }
    };

    try {

        //Calculate a route.
        const directions = await routeURL.calculateRouteDirections(atlas.service.Aborter.timeout(10000), coordinates, options)

        //Get the route data as GeoJSON and add it to the data source.
        var data = directions.geojson.getFeatures();
        datasourceRoute.value.add(data);

        // Create a table with the route travel time/distance information.
        var html = ['<table class="table"><tr><td>Route</td><td>Distance</td><td>Time</td></tr>'];

        for (var i = 0; i < directions.routes.length; i++) {
            var s = directions.routes[i].summary.travelTimeInSeconds % 60;

            html.push('<tr><td><div class="colorBlock" style="background-color:',
                routeColors[i], '; width: 40px; height: 20px"></div></td><td>',

                //Convert distance to meters and round to 1 decimal place.
                Math.round(directions.routes[i].summary.lengthInMeters / 1000 * 10) / 10, ' km</td><td>',

                //Format time as min:sec. If seconds less than 10, prepend a 0 to the second value.
                Math.round(directions.routes[i].summary.travelTimeInSeconds / 60), ':',
                ((s < 10) ? '0' : ''), s, ' min</td></tr>');
        }

        map.events.add('click', lineLayer.value, function (e) {
            let clickedRoadIndex = e.shapes[0].getProperties().resultIndex;

            if (clickedRoadIndex !== undefined) {
                let originalData = datasourceRoute.value.getShapes();

                map.layers.remove(lineLayer.value);

                datasourceRoute.value.clear();
                let clickedRoadData = e.shapes;
                let otherRoadData = originalData.filter(shape => shape.getProperties().resultIndex !== clickedRoadIndex);

                datasourceRoute.value.add([...otherRoadData, ...clickedRoadData]);


                map.layers.add(lineLayer.value, 'labels1');

                lineLayer.value.setOptions({
                    strokeColor: [
                        'case',
                        ['==', ['get', 'resultIndex'], clickedRoadIndex], // If the clicked road
                        'blue', // Highlight color
                        '#B0B0B0' // Gray color for other roads
                    ],
                });

            } else {
                console.error('Clicked road has no resultIndex property');
            }
        });

        html.push('</table>');
        document.getElementById('resultsPanel').innerHTML = html.join('');

        //Update the map view to center over the route.
        // map.value.setCamera({
        //     bounds: data.bbox,
        //     padding: 30 //Add a padding to account for the pixel size of symbols.
        // });
    } catch (error) {
        console.error('Error calculating route:', error);
    }
}

function swapPlace() { // swap start and end place

    let tempVariable = startPoint.value.lon;
    startPoint.value.lon = endPoint.value.lon;
    endPoint.value.lon = tempVariable;

    tempVariable = startPoint.value.lat;
    startPoint.value.lat = endPoint.value.lat;
    endPoint.value.lat = tempVariable;

    // swap address in input
    let temp = addressStart.value;
    addressStart.value = addressEnd.value
    addressEnd.value = temp

    calculateRoute()
}

</script>

<style scoped>
#mapContainer {
    width: 100%;
    height: 100%;
}

.custom-marker {
    /* pollution */
    color: black;
    font-size: 15px;
    width: 40px;
    height: 40px;
    border: 2px solid #2980b9;
    border-radius: 5px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
}

.custom-marker::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 10px solid #3498db;
}

.custom-marker-bus {
    position: relative;
    width: 20px;
    /* Width of the marker */
    height: 20px;
    /* Height of the marker */
    background-color: #007bff;
    /* Marker color */
    border-radius: 50%;
    /* Make it round */
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px solid #fff;
    /* Optional border */
}


.marker.green {
    background-color: #00e676;
}

.marker.yellow {
    background-color: #ffeb3b;
}

.marker.red {
    background-color: #f44336;
}

.marker.purple {
    background-color: #9c27b0;
}

.marker.brown {
    background-color: #795548;
}

@media only screen and (max-width: 500px) {
    #sidebar {
        width: 300px;
    }
}
</style>
