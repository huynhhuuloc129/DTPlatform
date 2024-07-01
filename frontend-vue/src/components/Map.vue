<template>
    <Transition>
    <div id="container" v-if="checkClick && show == true" style="position: absolute;">
        <div id="sidebarContainer" class="d-flex">
            <!-- Sidebar -->
            <nav id="sidebar" class="bg-light border-end">
                <!-- Sidebar Header -->
                <div class="p-3 border-bottom">
                    <div class="d-flex align-items-center justify-content-between">
                        <button id="arrow-left" @click="show = false" class="btn btn-link p-0">
                            <i class="fas fa-arrow-left"></i>
                            
                        </button>
                        <button id="arrow-down" @click="show = false" class="btn btn-link p-0 w-100 align-content-center">
                            <i class="fas fa-arrow-down"></i>
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
                            @click="swapPlace()">
                            <i class="fa-solid fa-arrows-rotate"></i>
                        </button>
                    </div>
                    <div class="mb-3">
                        <input disabled type="text" class="form-control" :value="displayNameEnd">
                    </div>
                    <hr>

                    <h6>Các tuyến đường sẽ đi qua</h6>
                    <div v-for="(roadName, index) in roadNames" class="d-flex justify-content-between align-items-center mb-2">
                        <div>
                            {{ index+1 }}: <strong>{{ roadName }}</strong>
                        </div>
                        <!-- <div>
                            <span class="badge bg-warning text-dark">Tuyến này có thu phí</span>
                        </div> -->
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
        <div>
            <button id="arrow-right" v-if="show == false && checkClick" style="position: absolute; z-index: 2; margin: 20px; background: white;" @click="show = true" class="btn btn-link p-2">
                <i  style="margin: 0 2px;" class="fas fa-arrow-right"></i>
            </button>

            <button id="arrow-up" v-if="show == false && checkClick" style="position: absolute; z-index: 2; margin-bottom: 20px; left: 50%; bottom: 0; background: white;  transform: translate(-50%, 0)" @click="show = true" class="btn btn-link p-2">
                <i  style="margin: 0 2px;" class="fas fa-arrow-up"></i>
            </button>
        </div>
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

    <button class="geolocate-btn" style="width: 50px; height: auto;" @click="loadingWait = !loadingWait; getLocation()">
        <div v-if="loadingWait == true">
            <i  class="fa-solid fa-spinner fa-spin-pulse"  style="width: 25px; height: 25px;"></i>
        </div>
        <div v-else>
            <i  class="fa-solid fa-location-crosshairs" style="width: 25px; height: 25px;"></i>
        </div>
    </button>

</template>

<script>
import mapboxgl from 'mapbox-gl';
import { useCookies } from 'vue3-cookies'
import mapboxServices from '@/services/mapbox.services';
mapboxgl.accessToken = 'pk.eyJ1IjoiaHFuZ2hpODgiLCJhIjoiY2xzdTBtOG5pMDczcTJqbzFueGhiOGphMyJ9.m-zWte_-Qgshf5tQ9pFIrA';
import PathFinder, { pathToGeoJSON } from "geojson-path-finder";
import { length } from '@turf/turf';
const cookies = useCookies()

var map, geocoderStart, geocoderEnd, token, roads
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
            choosenType : 1,
            loadingWait: false,
            roadNames: [],
            start: [],
            end: []
        }
    },
    methods: {
        async getLocation() {
            if (navigator.geolocation) {

                navigator.geolocation.getCurrentPosition(position => {
                    const lng = position.coords.longitude;
                    const lat = position.coords.latitude;
                    const coordinates = [lng, lat];

                    map.flyTo({
                        center: coordinates,
                        zoom: 14
                    });

                    // Reverse geocode to get the address
                    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`)
                        .then(response => response.json())
                        .then(data => {
                            if (data.features.length > 0) {
                                const place = data.features[0].place_name;
                                this.loadingWait = false
                                geocoderStart.query(place);
                            } else {
                                console.error('No place found for the coordinates');
                            }
                        })
                        .catch(error => {
                            console.error('Error fetching the place name', error);
                        });
                }, error => {
                    console.error('Error getting location', error);
                });
            } else {
                alert('Geolocation is not supported by this browser.');
            }

        },

        changeType(index) {
            this.choosenType = index
            this.timeToTravel = Math.round((this.lengthRoad*0.001) / this.speed * 60)
        },

        swapPlace(){

            geocoderStart.query(this.displayNameEnd)
            geocoderEnd.query(this.displayNameStart)

            for (let i = 0; i < this.start.length; i++) {
                let tempVariable = this.start[i];
                this.start[i] = this.end[i];
                this.end[i] = tempVariable;
            }


            [this.displayNameStart, this.displayNameEnd] = [this.displayNameEnd, this.displayNameStart]; 

            this.calculateRoute()
        },

        async calculateRoute() {
            if (this.start.length == 0 || this.end.length == 0) return;

            var roads1 = await mapboxServices.getRoadNear(token, this.start[0], this.start[1])
            var roads2 = await mapboxServices.getRoadNear(token, this.end[0], this.end[1])

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
            this.timeToTravel = Math.round((this.lengthRoad*0.001) / this.speed * 60)

            // find path line
            const pathLineString = pathToGeoJSON(pathFounded);

            this.checkClick = true
            const route = pathLineString.geometry;

            // get road name
            for (let i=0; i< pathFounded.path.length; i++) {
                
                fetch(`https://api.mapbox.com/search/geocode/v6/reverse?longitude=${pathFounded.path[i][0]}&latitude=${pathFounded.path[i][1]}&access_token=${mapboxgl.accessToken}`)
                .then(response => response.json())
                .then(data => {

                    if (data.features.length > 0) {
                        let address = data.features[0].properties.full_address;
                        if (this.roadNames.indexOf(address) == -1){
                            this.roadNames.push(address)
                        }
                    } else {
                        console.error('No road name found for the coordinates');
                    }
                })
                .catch(error => {
                    console.error('Error fetching the road name', error);
                });
            }

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

        map = new mapboxgl.Map({
            container: this.$refs.mapContainer,
            style: "mapbox://styles/mapbox/streets-v12",
            center: [105.7640697496488, 10.030023648539725],
            zoom: 12,
        });

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
            this.start = e.result.geometry.coordinates
            this.displayNameStart = e.result.place_name
            this.calculateRoute()
        });
        geocoderEnd.on('result', (e) => {
            this.end = e.result.geometry.coordinates
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
#sidebarContainer{
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
    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
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
.label{
    margin-right: 5px;
}
#infor{
    position: absolute; right: 0; 
    margin: 110px 10px 0 0;
}
.v-enter-active{
  transition: opacity 0.05s ease;
}
.v-leave-active {
    transition: opacity 0.05s ease;

}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
#arrow-down, #arrow-up{
    display: none;
}
@media only screen and (max-width: 640px) {
    #infor{
        margin: 130px 10px 0 0;
    }

    #container {
        position: absolute;
        bottom: 0;
        height: 40vh;
    }
    #sidebar, #container    {
        width: 100vw;
    }
    #arrow-left, #arrow-right{
        display: none;
    }
    #arrow-down, #arrow-up{
        display: inline;
    }
}
</style>