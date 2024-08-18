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
                                <button class="btn btn-outline-primary" style="background-color: none;"
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
                        <div class="d-flex justify-content-between mb-3">
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
                        </div>
                        <div id="geocoder">

                            <input type="text" @keyup="suggestion(addressStart, 0)" class="form-control "
                                placeholder="Điểm bắt đầu" v-model="addressStart">

                            <select v-if="suggestStart.length > 0 && displaySuggestStart == true" class="form-select"
                                multiple size="2">
                                <option value=1 v-for="suggestion in suggestStart"
                                    @click="addressStart = suggestion; displaySuggestStart = false">
                                    {{ suggestion }}
                                </option>
                            </select>

                            <div id="geocoder-icon" class="m-2">
                                <div class="text-center">
                                    <button :disabled="disableSwap" class="btn btn-light" @click="swapPlace()">
                                        <i class="fa-solid fa-arrows-rotate"></i>
                                    </button>
                                </div>
                            </div>

                            <input type="text" @keyup="suggestion(addressEnd, 1)" class="form-control"
                                placeholder="Điểm kết thúc" v-model="addressEnd">

                            <select v-if="suggestEnd.length > 0 && displaySuggestEnd == true" class="form-select"
                                multiple size="2">
                                <option v-for="suggestion in suggestEnd"
                                    @click="addressEnd = suggestion; displaySuggestEnd = false">
                                    {{ suggestion }}
                                </option>
                            </select>

                            <button class="btn btn-primary mt-3" @click="geocode($event)">Tìm đường</button>
                        </div>
                        <hr>

                        <h6>Lộ trình:</h6>
                        <div id="instructions"></div>

                        <hr>
                        <div>
                            <div class="profile">
                                <div class="h6">
                                    <span class="h6">Độ dài: </span>
                                    <span>{{ lengthRoad }} m</span>
                                </div>
                                <div class="h6">
                                    <span class="h6">Lượng khí thải: </span>
                                    <span>1000 PPM</span>
                                </div>
                                <div class="h6">
                                    <span class="h6">Thời gian: </span>
                                    <span>{{ timeToTravel }} phút</span>
                                </div>
                            </div>
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

    <div ref="mapContainer" class="map-container"></div>

    <button class="geolocate-btn" style="width: 50px; height: auto;"
        @click="loadingWait = !loadingWait; getCurrentLocation()">
        <div v-if="loadingWait == true">
            <i class="fa-solid fa-spinner fa-spin-pulse" style="width: 25px; height: 25px;"></i>
        </div>
        <div v-else>
            <i class="fa-solid fa-location-crosshairs" style="width: 25px; height: 25px;"></i>
        </div>
    </button>

</template>

<script>
import mapboxgl from 'mapbox-gl';
import { useCookies } from 'vue3-cookies'
import mapboxServices from '@/services/mapbox.services';
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY;
import { useRouter } from 'vue-router'
import autosuggestServices from '@/services/autosuggest.services';
import PollutionService from '../services/pollution.services'
import directionService from '@/services/direction.services';
import locationService from '@/services/location.service';
import trafficServices from '@/services/traffic.services';

const cookies = useCookies()

var map, token, roads

const aqicnApiKey = import.meta.env.VITE_AQI_API_KEY
const trafficToken = import.meta.env.VITE_TRAFFIC_API_KEY

export default {
    computed: {
        disableSwap() {
            return this.addressStart == '' || this.addressEnd == '';
        }
    },
    data() {
        return {
            displaySuggestStart: false,
            displaySuggestEnd: false,
            suggestStart: [],
            suggestEnd: [],
            show: true,
            checkClick: false,
            lengthRoad: 0,
            timeToTravel: 0,
            choosenType: 1,
            choosenTypeCar: 'driving',
            loadingWait: false,
            roadNames: [],
            start: [],
            end: [],
            traffics: [],
            router: useRouter(),
            markers: [],
            addressStart: '',
            addressEnd: '',
        }
    },
    methods: {
        createCompleteAddresses(data) {
            return data.map(entry => {
                console.log(entry)
                return entry.address.formattedAddress
            });
        },
        async suggestion(q, type) {
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }

            this.timer = setTimeout(async () => {
                let resp = await autosuggestServices.getAutoSuggest(q, trafficToken)
                if (resp != null && resp.resourceSets.length > 0 && resp.resourceSets[0].resources.length > 0) {
                    let completeAddress = this.createCompleteAddresses(resp.resourceSets[0].resources[0].value)

                    if (type == 0) { // suggest start
                        this.displaySuggestStart = true

                        this.suggestStart = []
                        completeAddress.forEach(element => {
                            if (element != '')
                                this.suggestStart.push(element)
                        });

                    } else { // suggest end
                        this.displaySuggestEnd = true

                        this.suggestEnd = []
                        completeAddress.forEach(element => {
                            if (element != '')
                                this.suggestEnd.push(element)
                        });
                    }
                } else {
                    return;
                }
            }, 500);
        },

        clearMarkers() {
            this.markers.forEach(marker => marker.remove());
            this.markers.length = 0; // Clear the array
        },

        async geocode(e) {
            e.preventDefault();
            this.clearMarkers();

            if (this.addressStart == '' || this.addressEnd == '') return;

            // get start location
            let resp = await locationService.getLocation(this.addressStart, trafficToken)

            if (resp.resourceSets.length > 0 && resp.resourceSets[0].resources.length > 0) {
                var location = resp.resourceSets[0].resources[0].point.coordinates;
                var lng = location[1];
                var lat = location[0];

                this.start[0] = lng
                this.start[1] = lat

                let marker = new mapboxgl.Marker({ color: 'green', draggable: true })
                    .setLngLat([lng, lat])
                    .addTo(map);
                marker.on('dragend', () => {
                    let lngLat = marker.getLngLat();
                    this.start[0] = lngLat.lng
                    this.start[1] = lngLat.lat
                    this.calculateRoute()
                });
                this.markers.push(marker);

            } else {
                alert('Location not found');
            }

            // get end location
            let respEnd = await locationService.getLocation(this.addressEnd, trafficToken)

            if (respEnd.resourceSets.length > 0 && respEnd.resourceSets[0].resources.length > 0) {
                var location = respEnd.resourceSets[0].resources[0].point.coordinates;
                var lng = location[1];
                var lat = location[0];

                this.end[0] = lng
                this.end[1] = lat

                let marker = new mapboxgl.Marker({ color: 'red', draggable: true })
                    .setLngLat([lng, lat])
                    .addTo(map);
                marker.on('dragend', () => {
                    let lngLat = marker.getLngLat();
                    this.end[0] = lngLat.lng
                    this.end[1] = lngLat.lat
                    this.calculateRoute()
                });
                this.markers.push(marker);

                map.flyTo({
                    center: [lng, lat],
                    essential: true
                });

                // calculate route
                this.calculateRoute()

            } else {
                alert('Location not found');
            }

        },

        toggle() {  // toggle side bar
            var x = document.getElementById("container");
            if (x.style.display === "none") {
                x.style.display = "block";
            } else {
                x.style.display = "none";
            }
        },

        pushToDashBoard() {
            this.router.push('home')
        },

        async getCurrentLocation() {
            if (navigator.geolocation) {
                var latCurrent, lngCurrent

                navigator.geolocation.getCurrentPosition(async (position) => {
                    lngCurrent = position.coords.longitude;
                    latCurrent = position.coords.latitude;

                    const coordinates = [lngCurrent, latCurrent];

                    let resp = await locationService.getLocationByPoint(latCurrent, lngCurrent, trafficToken)
                    if (resp.resourceSets.length > 0 && resp.resourceSets[0].resources.length > 0) {
                        var address = resp.resourceSets[0].resources[0].address.addressLine;

                        this.addressStart = address + ' Việt Nam'
                    }

                    map.flyTo({
                        center: coordinates,
                        zoom: 14
                    });

                    this.start[0] = lngCurrent
                    this.start[1] = latCurrent

                    let marker = new mapboxgl.Marker({ color: 'green', draggable: true })
                        .setLngLat([lngCurrent, latCurrent])
                        .addTo(map);
                    marker.on('dragend', () => {
                        let lngLat = marker.getLngLat();
                        this.start[0] = lngLat.lng
                        this.start[1] = lngLat.lat
                        this.calculateRoute()
                    });
                    this.markers[0] = marker

                    // calculate route
                    this.calculateRoute()

                    this.loadingWait = false
                }, error => {
                    console.error('Error getting location', error);
                });

            } else {
                alert('Geolocation is not supported by this browser.');
            }

        },

        changeType(index) { // change driving type
            if (index == 1) this.choosenTypeCar = 'driving'
            else if (index == 2) this.choosenTypeCar = 'cycling'
            else if (index == 3) this.choosenTypeCar = 'walking'
            else if (index == 0) this.choosenTypeCar = 'driving-traffic'

            this.choosenType = index
            this.calculateRoute()
        },

        swapPlace() { // swap start and end place

            for (let i = 0; i < this.start.length; i++) {
                let tempVariable = this.start[i];
                this.start[i] = this.end[i];
                this.end[i] = tempVariable;
            }

            // swap address in input
            let temp = this.addressStart;
            this.addressStart = this.addressEnd
            this.addressEnd = temp

            this.calculateRoute()
        },

        async calculateRoute() { // find path
            if (this.start.length == 0 || this.end.length == 0) return;

            // Mapbox direction API
            let respDirection = await directionService.getDirection(this.choosenTypeCar, import.meta.env.VITE_MAPBOX_KEY, this.start[0], this.start[1], this.end[0], this.end[1])
            const directions = respDirection.routes[0];

            const route = directions.geometry.coordinates;
            const steps = directions.legs[0].steps;

            // add instruction
            const instructions = document.getElementById('instructions');
            let tripInstructions = '';
            for (const step of steps) {
                tripInstructions += `<li>${step.maneuver.instruction}</li>`;
            }
            instructions.innerHTML = `<ol>${tripInstructions}</ol>`;

            this.lengthRoad = Math.round(directions.distance);
            this.timeToTravel = Math.round(directions.duration / 60)

            if (map.getLayer('route')) {
                map.removeLayer('route');
            }
            if (map.getSource('route')) {
                map.removeSource('route');
            }

            map.addSource('route', {
                'type': 'geojson',
                'data': {
                    'type': 'Feature',
                    'properties': {},
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': route
                    }
                }
            });
            map.addLayer({
                'id': 'route',
                'type': 'line',
                'source': 'route',
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-color': 'blue',
                    'line-width': 8
                }
            })

            const bounds = [
                [Math.min(this.start[0], this.end[0]), Math.min(this.start[1], this.end[1])], // Southwest coordinates [lng, lat]
                [Math.max(this.start[0], this.end[0]), Math.max(this.start[1], this.end[1])]  // Northeast coordinates [lng, lat]
            ];

            map.fitBounds(bounds, {
                padding: 100 // Optional padding around the bounding box
            });

            // own data road

            // var roads1 = await mapboxServices.getRoadNear(token, this.start[0], this.start[1])
            // var roads2 = await mapboxServices.getRoadNear(token, this.end[0], this.end[1])

            // var nearestRoad1 = roads1.roads[0].geometry.coordinates[0]
            // var nearestRoad2 = roads2.roads[0].geometry.coordinates[0]

            // var network = await mapboxServices.getRoadInsideBoundary(token, nearestRoad1[0], nearestRoad1[1], nearestRoad2[0], nearestRoad2[1])
            // const pathFinder = new PathFinder({
            //     "type": "FeatureCollection",
            //     "features":
            //         roads.roads
            // }, {
            //     weight: function (a, b, props) {
            //         const dx = a[0] - b[0];
            //         const dy = a[1] - b[1];
            //         return Math.sqrt(dx * dx + dy * dy);
            //     },
            // });

            // const pathFounded = pathFinder.findPath({
            //     'type': 'Feature',
            //     'geometry': {
            //         'type': 'Point',
            //         'coordinates': [nearestRoad1[0], nearestRoad1[1]]
            //         // 'coordinates': [105.84368150000002, 21.046629699999983]
            //     },
            //     'properties': {
            //         'title': 'Start'
            //     }
            // }, {
            //     'type': 'Feature',
            //     'geometry': {
            //         'type': 'Point',
            //         'coordinates': [nearestRoad2[0], nearestRoad2[1]]
            //         // 'coordinates': [105.84368150000002, 21.046629699999983]
            //     },
            //     'properties': {
            //         'title': 'Start'
            //     }
            // })

            // // calculate length road
            // const pathGeoJSONTurf = {
            //     "type": "Feature",
            //     "properties": {},
            //     "geometry": {
            //         "type": "LineString",
            //         "coordinates": pathFounded.path
            //     }
            // };
            // this.lengthRoad = Math.round(length(pathGeoJSONTurf, { units: 'meters' }));

            // // calculate time
            // this.timeToTravel = Math.round((this.lengthRoad * 0.001) / this.speed * 60)

            // // find path line
            // const pathLineString = pathToGeoJSON(pathFounded);

            // this.checkClick = true
            // const route = pathLineString.geometry;

            // // get road name
            // this.roadNames = [];

            // for (let i = 0; i < pathFounded.path.length; i++) {

            //     fetch(`https://api.mapbox.com/search/geocode/v6/reverse?longitude=${pathFounded.path[i][0]}&latitude=${pathFounded.path[i][1]}&access_token=${mapboxgl.accessToken}`)
            //         .then(response => response.json())
            //         .then(data => {

            //             if (data.features.length > 0) {
            //                 let address = data.features[0].properties.full_address;
            //                 if (this.roadNames.indexOf(address) == -1) {
            //                     this.roadNames.push(address)
            //                 }
            //             } else {
            //                 console.error('No road name found for the coordinates');
            //             }
            //         })
            //         .catch(error => {
            //             console.error('Error fetching the road name', error);
            //         });
            // }

            // // add path to map
            // if (map.getSource('route')) {
            //     map.getSource('route').setData(route);
            // } else {
            //     map.addLayer({
            //         id: 'route',
            //         type: 'line',
            //         source: {
            //             type: 'geojson',
            //             data: route,
            //         },
            //         layout: {
            //             'line-join': 'round',
            //             'line-cap': 'round',
            //         },
            //         paint: {
            //             'line-color': '#3887be',
            //             'line-width': 5,
            //             'line-opacity': 0.75,
            //         },
            //     });
            // }
        },


    },

    async mounted() {
        token = cookies.cookies.get('Token')

        roads = await mapboxServices.getRoad(token)

        map = new mapboxgl.Map({
            container: this.$refs.mapContainer,
            style: "mapbox://styles/mapbox/streets-v12",
            center: [105.804817, 21.028511],
            zoom: 12,
        });

        // add start point
        // geocoderStart = new MapboxGeocoder({
        //     accessToken: mapboxgl.accessToken,
        //     mapboxgl: mapboxgl,
        //     marker: {
        //         color: 'red',
        //         draggable: true

        //     },
        //     placeholder: 'Start place',
        // });

        // geocoderStart.on('result', (e) => {
        //     var marker = geocoderStart.mapMarker;
        //     if (marker) {
        //         marker.on('dragend', () => {
        //             let lngLat = marker.getLngLat();
        //             this.start[0] = lngLat.lng
        //             this.start[1] = lngLat.lat
        //             this.calculateRoute()
        //         });
        //     }

        //     this.start = e.result.geometry.coordinates
        //     this.calculateRoute()
        // });

        // // add end point
        // geocoderEnd = new MapboxGeocoder({
        //     accessToken: mapboxgl.accessToken,
        //     mapboxgl: mapboxgl,
        //     marker: {
        //         color: 'yellow',
        //         draggable: true

        //     },
        //     placeholder: 'End place',
        // });

        // geocoderEnd.on('result', (e) => {
        //     var marker = geocoderEnd.mapMarker;
        //     if (marker) {
        //         marker.on('dragend', () => {
        //             let lngLat = marker.getLngLat();
        //             this.end[0] = lngLat.lng
        //             this.end[1] = lngLat.lat
        //             this.calculateRoute()
        //         });
        //     }

        //     this.end = e.result.geometry.coordinates
        //     this.calculateRoute()
        // });

        // adding pollution
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

            let resp = await PollutionService.getPollution(aqicnApiKey, stations[i])
            // console.log(resp.data)
            if (resp.status == 'ok') {
                let aqi = resp.data.aqi;
                let coords = resp.data.city.geo;

                // adding description to marker
                let description = `
                    <b>Station</b>: ${resp.data.city.name} <br>
                    <b>AQI</b>: ${aqi}  <br>
                    <b>Dominant Pollutant</b>: ${resp.data.dominentpol} <br>`;
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

                let el = document.createElement('div');
                el.className = `custom-marker marker ${markerColor}`;
                el.textContent = aqi

                let marker = new mapboxgl.Marker(el)
                    .setLngLat([coords[1], coords[0]])
                    .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(description))
                    .addTo(map);
            }
        }

        // document.getElementById('geocoder-start').appendChild(geocoderStart.onAdd(map));
        // document.getElementById('geocoder-end').appendChild(geocoderEnd.onAdd(map));

        // add traffic
        let respTraffic = await trafficServices.getTraffic(trafficToken)

        let featureCollection = []
        for (let i = 0; i < respTraffic.resourceSets[0].resources.length; i++) {
            let resource = respTraffic.resourceSets[0].resources[i]

            let latPoint = resource.point.coordinates[0], lngPoint = resource.point.coordinates[1] // 0 lat 1 lng
            let latToPoint = resource.toPoint.coordinates[0], lngToPoint = resource.toPoint.coordinates[1] // 0 lat 1 lng

            let severity = resource.severity
            let feature = {
                'type': 'Feature',
                'properties': {},
                'geometry': {
                    'type': 'LineString',
                    'coordinates': [
                        [lngPoint, latPoint],
                        [lngToPoint, latToPoint]
                    ]
                },
                'properties': {
                    'severity': severity
                }
            }

            featureCollection.push(feature)
        }
        if (map.getSource('trafficLine')) {
            map.getSource('trafficLine' + i).setData({
                'type': 'FeatureCollection',
                'features': featureCollection,
            });
        } else {
            map.addLayer({
                'id': 'trafficLine',
                'type': 'line',
                'source': {
                    'type': 'geojson',
                    'data': {
                        'type': 'FeatureCollection',
                        'features': featureCollection,
                    }
                },
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-color': [
                        'case',
                        ['==', ['get', 'severity'], 5], '#ff0000', // Red for high severity
                        ['==', ['get', 'severity'], 4], '#ff0000', // Red for high severity
                        ['==', ['get', 'severity'], 3], '#ffa500', // Orange for medium severity
                        ['==', ['get', 'severity'], 2], '#008000', // Green for low severity
                        ['==', ['get', 'severity'], 1], '#008000', // Green for low severity
                        ['==', ['get', 'severity'], 0], '#008000', // Green for low severity
                        '#888' // Default color
                    ],
                    'line-width': 5
                }
            })
        }

    },
    unmounted() {
        if (map != null) map.remove();
        map = null;
    }

};
</script>

<style scoped>
#backIcon {
    z-index: 5;

}

#sidebarContainer {
    background-color: white;
    overflow-x: hidden;
}

.geolocate-btn {
    position: absolute;
    bottom: 20px;
    right: 20px;
    background-color: white;
    border: none;
    border-radius: 4px;
    padding: 10px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    cursor: pointer;
    font-size: 16px;
}

.map-container {
    flex: 1;
}

#sidebar {
    z-index: 3;
    width: 360px;
    overflow-x: hidden;
    overflow-y: scroll;
    height: 100vh;
}

#content {
    width: 100%;
}

.label {
    margin-right: 5px;
}

#infor {
    position: absolute;
    right: 0;
    margin: 110px 10px 0 0;
}

.v-enter-active {
    transition: opacity 0.05s ease;
}

.v-leave-active {
    transition: opacity 0.05s ease;

}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}

#geocoder {
    position: relative;
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

.form-select {
    min-height: 10px;
    position: absolute;
    z-index: 999;
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

@media only screen and (max-width: 640px) {
    #infor {
        margin: 130px 10px 0 0;
    }
}
</style>