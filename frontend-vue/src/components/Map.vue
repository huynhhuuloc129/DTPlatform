<template>
    <Transition>
    <div  v-if="checkClick && show == true">
        <div id="sidebarContainer" class="d-flex">
            <!-- Sidebar -->
            <nav id="sidebar" class="bg-light border-end">
                <!-- Sidebar Header -->
                <div class="p-3 border-bottom">
                    <div class="d-flex align-items-center justify-content-between">
                        <button @click="show = false" class="btn btn-link p-0">
                            <i class="fas fa-arrow-left"></i>
                        </button>
                        <!-- <button class="btn btn-link p-0">
                            <i class="fas fa-ellipsis-v"></i>
                        </button> -->
                    </div>
                </div>

                <!-- Sidebar Content -->
                <div class="p-3">
                    <div class="d-flex align-items-center justify-content-between mb-3">
                        <div class="d-flex align-items-center mb-3">
                            <div style="margin-bottom: 5px">
                                
                                <input type="radio" @change="changeType(0)"
                                    class="btn-check" name="btnradio" id="btnradio" autocomplete="off" />
                                <label class="btn btn-outline-secondary  label" for="btnradio">
                                    Tối ưu
                                </label>

                                <input checked v-model="speed" type="radio" value=60 @change="changeType(1)"
                                    class="btn-check" name="btnradio" id="btnradioCar" autocomplete="off" />
                                <label class="btn btn-outline-secondary  label" for="btnradioCar">
                                    <i class="fa-solid fa-car"></i>
                                </label>
        
                                <input v-model="speed" type="radio" value=40 @change="changeType(2)"
                                    class="btn-check" name="btnradio" id="btnradioMotor" autocomplete="off" />
                                <label class="btn btn-outline-secondary  label" for="btnradioMotor">
                                    <i class="fa-solid fa-motorcycle"></i>
                                </label>

                                <input v-model="speed" type="radio" value=10 @change="changeType(3)"
                                    class="btn-check" name="btnradio" id="btnradioBike" autocomplete="off" />
                                <label class="btn btn-outline-secondary  label" for="btnradioBike">
                                    <i class="fas fa-bicycle"></i>
                                </label>

                                <input v-model="speed" type="radio" value=5 @change="changeType(4)"
                                    class="btn-check" name="btnradio" id="btnradioWalk" autocomplete="off" />
                                <label class="btn btn-outline-secondary label" for="btnradioWalk">
                                    <i class="fas fa-walking"></i>
                                </label>

                                <input v-model="speed" type="radio" value=1 @change="changeType(5)"
                                    class="btn-check" name="btnradio" id="btnradioWait" autocomplete="off" />
                                <label class="btn btn-outline-secondary label" for="btnradioWait">
                                    <i class="fa-solid fa-person"></i>
                                </label>
                            </div>
                          
                        </div>
                    </div>
                    <div class="">
                        <input disabled type="text" class="form-control" :value="displayNameStart">
                    </div>
                    <div class="text-center">
                        <button class="btn btn-light"
                            @click="[displayNameStart, displayNameEnd] = [displayNameEnd, displayNameStart];">
                            <i class="fa-solid fa-arrows-rotate"></i>
                        </button>
                    </div>
                    <div class="mb-3">
                        <input disabled type="text" class="form-control" :value="displayNameEnd">
                    </div>
                    <hr>

                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <div>
                            <strong>qua CT01</strong>
                            <p class="mb-0">2 giờ 48 p</p>
                        </div>
                        <div>
                            <span class="badge bg-warning text-dark">Tuyến này có thu phí</span>
                        </div>
                    </div>
                    <div class="mb-2">
                        <strong>Phuong Trang</strong>
                        <p class="mb-0">3 giờ 58 p</p>
                    </div>
                    <div class="mb-2">
                        <strong>Phuong Trang</strong>
                        <p class="mb-0">3 giờ 52 p</p>
                    </div>
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
        <button v-if="show == false && checkClick" style="position: absolute; z-index: 1; margin: 20px; " @click="show = true" class="btn btn-link p-0">
            <i  class="fas fa-arrow-right"></i>
        </button>
    </Transition>

    <div ref="mapContainer" class="map-container"></div>
    <div id="infor" v-if="checkClick">
        <div class="rounded-pill" style="padding: 10px 20px; background-color: white; margin-bottom: 10px">
            <span class="h6">Độ dài: </span>
            <span>{{ lengthRoad }} m</span>
        </div>
        <div class="rounded-pill bg-light" style="padding:10px 20px; background-color: white; margin-bottom: 10px">
            <span class="h6">Lượng khí thải: </span>
            <span>1000 PPM</span>
        </div>
        <div class="rounded-pill bg-light" style="padding:10px 20px; background-color: white; margin-bottom: 10px">
            <span class="h6">Thời gian: </span>
            <span>{{ timeToTravel }} phút</span>
        </div>
    </div>


</template>

<script>
import mapboxgl from 'mapbox-gl';
import { useCookies } from 'vue3-cookies'
import mapboxServices from '@/services/mapbox.services';
mapboxgl.accessToken = 'pk.eyJ1IjoiaHFuZ2hpODgiLCJhIjoiY2xzdTBtOG5pMDczcTJqbzFueGhiOGphMyJ9.m-zWte_-Qgshf5tQ9pFIrA';
import PathFinder, { pathToGeoJSON } from "geojson-path-finder";
import { length } from '@turf/turf';
const cookies = useCookies()

var map, geocoderStart, geocoderEnd, start, end, token, roads
export default {
    data() {
        return {
            show: true,
            checkClick: false,
            chargingStations: [],
            displayNameEnd: '',
            displayNameStart: '',
            lengthRoad: 0,
            timeToTravel: 0,
            speed: 60,
            choosenType : 1
        }
    },
    methods: {
        /*
        async getChargingStations(coordinates) {
            const [longitude, latitude] = coordinates;
            const bbox = [102.1444, 8.1797, 109.4648, 23.3933];
            const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/xe%20điện.json?proximity=${longitude},${latitude}&bbox=${bbox.join(',')}&country=VN&access_token=${mapboxgl.accessToken}`);
            const data = await response.json();
            this.chargingStations = data.feature;
            console.log(data)
            this.displayChargingStations();
        },
        displayChargingStations() {
            this.chargingStations.forEach(station => {
                const [longitude, latitude] = station.geometry.coordinates;
                const name = station.text;
                const address = station.place_name;

                new mapboxgl.Marker()
                    .setLngLat([longitude, latitude])
                    .setPopup(new mapboxgl.Popup().setHTML(`<h3>${name}</h3><p>${address}</p>`))
                    .addTo(this.map);
            });
            console.log(this.chargingStations)
        },*/
        changeType (index) {
            this.choosenType = index
            this.timeToTravel = Math.round((this.lengthRoad*0.001) / this.speed * 60)
        },
        async calculateRoute() {
            if (!start || !end) return;

            var roads1 = await mapboxServices.getRoadNear(token, start[0], start[1])
            var roads2 = await mapboxServices.getRoadNear(token, end[0], end[1])

            var nearestRoad1 = roads1.roads[0].geometry.coordinates[0]
            var nearestRoad2 = roads2.roads[0].geometry.coordinates[0]

            // var network = await mapboxServices.getRoadInsideBoundary(token, nearestRoad1[0], nearestRoad1[1], nearestRoad2[0], nearestRoad2[1])

            const pathFinder = new PathFinder({
                "type": "FeatureCollection",
                "features":
                    roads.roads
            }, {
                weight: function (a, b, props) {
                    const dx = a[0] - b[0];
                    const dy = a[1] - b[1];
                    return Math.sqrt(dx * dx + dy * dy);
                },
            });

            const pathFounded = pathFinder.findPath({
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [nearestRoad1[0], nearestRoad1[1]]
                    // 'coordinates': [105.84368150000002, 21.046629699999983]
                },
                'properties': {
                    'title': 'Start'
                }
            }, {
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [nearestRoad2[0], nearestRoad2[1]]
                    // 'coordinates': [105.84368150000002, 21.046629699999983]
                },
                'properties': {
                    'title': 'Start'
                }
            })

            // calculate length road
            const pathGeoJSONTurf = {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "LineString",
                    "coordinates": pathFounded.path
                }
            };
            this.lengthRoad = Math.round(length(pathGeoJSONTurf, { units: 'meters' }));

            // calculate time
            console.log(this.speed)
            this.timeToTravel = Math.round((this.lengthRoad*0.001) / this.speed * 60)

            // find path line
            const pathLineString = pathToGeoJSON(pathFounded);

            this.checkClick = true
            const route = pathLineString.geometry;


            // add path to map
            if (map.getSource('route')) {
                map.getSource('route').setData(route);
            } else {
                map.addLayer({
                    id: 'route',
                    type: 'line',
                    source: {
                        type: 'geojson',
                        data: route,
                    },
                    layout: {
                        'line-join': 'round',
                        'line-cap': 'round',
                    },
                    paint: {
                        'line-color': '#3887be',
                        'line-width': 5,
                        'line-opacity': 0.75,
                    },
                });
            }

        },
    },

    async mounted() {
        token = cookies.cookies.get('Token')

        roads = await mapboxServices.getRoad(token)
        // pathFinder = new PathFinder(geojson, {
        //     weight: function (a, b, props) {
        //         const dx = a[0] - b[0];
        //         const dy = a[1] - b[1];
        //         return Math.sqrt(dx * dx + dy * dy);
        //     },
        // });
        map = new mapboxgl.Map({
            container: this.$refs.mapContainer,
            style: "mapbox://styles/mapbox/streets-v12",
            center: [105.7640697496488, 10.030023648539725],
            zoom: 12,
        });
        // const marker = new mapboxgl.Marker() // initialize a new marker
        // .setLngLat([105.7640697496488, 10.030023648539725]) // Marker [lng, lat] coordinates
        // .addTo(map);
        // this.map = map;

        geocoderStart = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl,
            marker: {
                color: 'red'
            },
            placeholder: 'Start place',
        });

        geocoderEnd = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl,
            marker: {
                color: 'yellow'
            },
            placeholder: 'End place',
        });

        map.addControl(geocoderStart);
        map.addControl(geocoderEnd);

        geocoderStart.on('result', (e) => {
            start = e.result.geometry.coordinates
            this.displayNameStart = e.result.place_name
            this.calculateRoute()
        });
        geocoderEnd.on('result', (e) => {
            end = e.result.geometry.coordinates
            this.displayNameEnd = e.result.place_name
            this.calculateRoute()
        });
    },
    unmounted() {
        map.remove();
        map = null;
    }

};
</script>

<style>
.map-container {
    flex: 1;
}

#sidebar {
    z-index: 1;
    width: 350px;
    height: 100vh;
}
#content {
    width: 100%;
}
.label{
    margin-right: 5px;
}
#infor{
    position: absolute; right: 0; 
    margin: 110px 10px 0 0;
}
.v-enter-active{
  transition: opacity 0.5s ease;
}
.v-leave-active {
    transition: opacity 0.2s ease;

}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
@media only screen and (max-width: 640px) {
    #infor{
        margin: 130px 10px 0 0;
    }
}
</style>