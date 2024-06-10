<template>

    <!-- <div v-if="checkClick"> -->
        <!-- <SidebarComponent></SidebarComponent> -->
        <Sidebar></Sidebar>
    <!-- </div> -->
    <div ref="mapContainer" class="map-container"></div>
    <div v-if="checkClick" style="position: absolute; right: 0; margin: 110px 10px 0 0;">
        <div class="rounded-pill" style="padding: 10px 20px; background-color: white; margin-bottom: 10px">
            <span class="h6">Độ dài: </span>
            <span>150km</span>
        </div>
        <div class="rounded-pill bg-light" style="padding:10px 20px; background-color: white; margin-bottom: 10px">
            <span class="h6">Lượng khí thải: </span>
            <span>1000 PPM</span>
        </div>
        <div class="rounded-pill bg-light" style="padding:10px 20px; background-color: white; margin-bottom: 10px">
            <span class="h6">Thời gian: </span>
            <span>15 phút</span>
        </div>
    </div>


</template>

<script>
import mapboxgl from 'mapbox-gl';
import { useCookies } from 'vue3-cookies'
import SidebarComponent from './SidebarComponent.vue';
import Sidebar from './Sidebar.vue';
import mapboxServices from '@/services/mapbox.services';
mapboxgl.accessToken = 'pk.eyJ1IjoiaHFuZ2hpODgiLCJhIjoiY2xzdTBtOG5pMDczcTJqbzFueGhiOGphMyJ9.m-zWte_-Qgshf5tQ9pFIrA';
import PathFinder, { pathToGeoJSON } from "geojson-path-finder";

const cookies = useCookies()

var map, geocoderStart, geocoderEnd, start, end, token, roads
export default {
    components: {
        SidebarComponent: SidebarComponent,
        Sidebar: Sidebar
    },
    data() {
        return {
            checkClick: false,
            chargingStations: []
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

            const pathLineString = pathToGeoJSON(pathFinder.findPath({
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
            }));

            console.log(pathLineString)

            this.checkClick = true

            const route = pathLineString.geometry;


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
            this.calculateRoute()
        });
        geocoderEnd.on('result', (e) => {
            end = e.result.geometry.coordinates
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
</style>