<template>
    <div id="mapContainer" style="height: 500px; width: 100%;"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as atlas from 'azure-maps-control';
import azureServices from '@/services/azure.services';

onMounted(() => {
    const map = new atlas.Map('mapContainer', {
        center: [-74, 40.72],
        zoom: 15,
        style: 'grayscale_dark',
        view: 'Auto',

        //Add authentication details for connecting to Azure Maps.
        authOptions: {
            //Use Microsoft Entra ID authentication.
            authType: atlas.AuthenticationType.anonymous,
            clientId: 'e6b6ab59-eb5d-4d25-aa57-581135b927f0', //Your Azure Maps client id for accessing your Azure Maps account.
            getToken: function (resolve, reject, map) {
                //URL to your authentication service that retrieves an Microsoft Entra ID Token.
                var tokenServiceUrl = 'https://samples.azuremaps.com/api/GetAzureMapsToken';

                fetch(tokenServiceUrl).then(r => r.text()).then(token => resolve(token));
            }
            //Alternatively, use an Azure Maps key. Get an Azure Maps key at https://azure.com/maps. NOTE: The primary key should be used as the key.
            //authType: 'subscriptionKey',
            //subscriptionKey: '[YOUR_AZURE_MAPS_KEY]'
        }
    });

})


</script>

<style scoped></style>