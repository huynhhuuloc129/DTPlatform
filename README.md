# Steps to deploy online
## Deploy backend on Render.com
1. Login to Render.
2. Click "+ New" and select "Web Service".
3. Choose the DTPlatform repository and connect.
4. Fill in the following details:
Language: Node
Root Directory: backend
Build Command: yarn
Start Command: npm start
Instance Type: Free
5. Set Environment Variables:
REACT_APP_MONGODB: your_mongodb_key

## Deploy frontend on Netlify.com
1. Login to Netlify.
2. Click "Add new site" and select "Import an existing project".
3. Choose the DTPlatform repository and connect.
4. Fill in the following details:
Base Directory: frontend-vue
Build Command: npm run build
Publish Directory: frontend-vue/dist
Instance Type: Free
5. Set Environment Variables:
VITE_AQI_API_KEY: your_aqi_key
VITE_AZURE_MAP_KEY: your_azure_key
VITE_MAPBOX_KEY: your_mapbox_key
VITE_TRAFFIC_API_KEY: your_traffic_key
