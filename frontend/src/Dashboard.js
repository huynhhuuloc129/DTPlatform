import React, { Component } from 'react';
import ReactMapGL from 'react-map-gl';
import { Source, Layer } from 'react-map-gl';
import {
  Button, LinearProgress
} from '@material-ui/core';
import swal from 'sweetalert';
import { withRouter } from './utils';
import PathFinder, { pathToGeoJSON } from "geojson-path-finder";
import Geocoder from 'react-map-gl-geocoder'

// import GeocoderControl from "./geocoder-control.tsx";

const axios = require('axios');
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN; // Set your mapbox token here 


class Dashboard extends Component {
  constructor() {
    super();
    this.mapRef = React.createRef();
    this.handleOnpress = this.handleOnpress.bind(this);

    this.state = {
      token: '',
      id: '',
      viewport: {
        latitude: 21.032610238914277,
        longitude: 105.84713300000003,
        zoom: 15,
      },
      start: {},
      finish: {},
      search: '',
      roads: {
        "type": "FeatureCollection",
        "features": []
      },
      pathFinder: {},
      pathLineString: {
        "type": "FeatureCollection",
        "features": []
      },// pathToGeoJSON(pathFinder.findPath(start, finish));

      loading: false
    };

  }


  componentDidMount = () => {
    let token = localStorage.getItem('token');
    // console.log(token);
    if (!token || token === "null") {
      // this.props.history.push('/login');
      this.props.navigate("/login");
    } else {
      this.setState({ token: token });
    }

    window.addEventListener("resize", this.resize);
    this.resize();
  }


  componentWillUnmount() {
    window.removeEventListener("resize", this.resize);
  }

  resize = () => {
    this.handleViewportChange({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };

  handleViewportChange = viewport => {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport }
    }, () => {
      // this.getRoad();

      let token = localStorage.getItem('token');
      if (!token || token === "null") {
        // this.props.history.push('/login');
        this.props.navigate("/login");
        return;
      }
    });
  };

  // if you are happy with Geocoder default settings, you can just use handleViewportChange directly
  handleGeocoderViewportChange = viewport => {
    const geocoderDefaultOverrides = { transitionDuration: 1000 };
    // console.log(viewport);
    // this.getRoad();
    console.log(this.state.roads);
    const pF = new PathFinder(this.state.roads, { tolerance: 1e-3 });
    this.setState({
      start: 
      {
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [viewport.longitude, viewport.latitude]
        },
        'properties': {
          'title': 'Finish'
        }
      },
      pathFinder: pF
    });
    return this.handleViewportChange({
      ...viewport,
      ...geocoderDefaultOverrides
    });
  };
  // if you are happy with Geocoder default settings, you can just use handleViewportChange directly
  handleGeocoderViewportChange2 = viewport => {
    const geocoderDefaultOverrides = { transitionDuration: 1000 };
    console.log(viewport);
    this.setState({
      finish:
      {
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [viewport.longitude, viewport.latitude]
        },
        'properties': {
          'title': 'Finish'
        }
      }
    });
    const p = pathToGeoJSON(this.state.pathFinder.findPath(this.state.start, this.state.finish));
    console.log(this.state.pathFinder.findPath(this.state.start, this.state.finish));
    this.setState({ pathLineString: p });
    return this.handleViewportChange({
      ...viewport,
      ...geocoderDefaultOverrides
    });
  };

  handleOnResult = event => {
    // this.setState({
    //   searchResultLayer: new GeoJsonLayer({
    //     id: "search-result",
    //     data: event.result.geometry,
    //     getFillColor: [255, 0, 0, 128],
    //     getRadius: 1000,
    //     pointRadiusMinPixels: 10,
    //     pointRadiusMaxPixels: 10
    //   })
    // });
  };
  navDashboard = () => {
    this.props.navigate("/dashboard");
  }

  navProduct = () => {
    this.props.navigate("/product");
  }

  logOut = () => {
    localStorage.setItem('token', null);
    // this.props.history.push('/');
    this.props.navigate("/");
  }

  onChange = (e) => {
    if (e.target.files && e.target.files[0] && e.target.files[0].name) {
      this.setState({ fileName: e.target.files[0].name }, () => { });
    }
    this.setState({ [e.target.name]: e.target.value }, () => { });
    if (e.target.name === 'search') {
      this.setState({ page: 1 }, () => {
        this.getRoad();
      });
    }
  };


  getRoad = () => {

    this.setState({ loading: true });

    let data = '?';
    data = `${data}`;

    if (this.mapRef.current !== null) {
      // console.log( this.mapRef.current.getMap().getBounds());
      let p = this.mapRef.current.getMap().getBounds().toArray();
      data = `${data}&search=${p[0]},${p[1]}`;
    }

    axios.get(`http://localhost:2000/get-road${data}`, {
      headers: {
        'token': this.state.token
      }
    }).then((res) => {
      this.setState({
        loading: false,
        roads: {
          "type": "FeatureCollection",
          "features":
            res.data.roads
        }
      });
    }).catch((err) => {
      swal({
        text: "" + err,
        icon: "error"
      });
      this.setState({ loading: false, roads: [] }, () => { });
    });
  }
  onSelected = (v, item) => {
    this.setState({ viewport: v });
    console.log('Selected: ', item)
  }


  handleOnpress(event) {
    console.log(event);
    this.getRoad();
  }

  render() {
    const dataLayer = {
      id: 'data',
      'type': 'line',
      'layout': {
        'line-join': 'round',
        'line-cap': 'round'
      },
      'paint': {
        'line-color': '#888',
        'line-width': 1

      }
    };

    const viewport = this.state.viewport;
    return (
      <div>
        {this.state.loading && <LinearProgress size={40} />}
        <div>
          <h2>Dashboard</h2>
          <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="small"
            onClick={this.navDashboard}
          >
            Dashboard
          </Button>
          <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="small"
            onClick={this.navProduct}
          >
            Show Product
          </Button>

          <Button
            className="button_style"
            variant="contained"
            size="small"
            onClick={this.logOut}
          >
            Log Out
          </Button>
        </div>



        <br />


        <div style={{ height: "100vh" }}>
          <ReactMapGL
            ref={this.mapRef}

            width="100%"
            height="100%"
            // onViewportChange={this.handleViewportChange}
            onLoad={this.getRoad}
            onDrag={this.handleOnpress}
            // onZoom={this.handleOnpress}
            // {...{
            //   latitude: 21.032610238914277,
            //   longitude: 105.84713300000003,
            //   zoom: 15,
            // }}            
            {...viewport}
            onViewportChange={(newViewport) => this.setState({ viewport: newViewport })}

            mapStyle="mapbox://styles/mapbox/light-v11"
            mapboxApiAccessToken={MAPBOX_TOKEN}
          >
            <Source type="geojson" data={this.state.roads}>
              <Layer {...dataLayer} />
            </Source>

          </ReactMapGL>
          <Geocoder
            mapRef={this.mapRef}
            mapboxApiAccessToken={MAPBOX_TOKEN} onSelected={this.onSelected}

            onViewportChange={this.handleGeocoderViewportChange}
            position="top-left"
          />
          <Geocoder
            mapRef={this.mapRef}
            mapboxApiAccessToken={MAPBOX_TOKEN} onSelected={this.onSelected}

            onViewportChange={this.handleGeocoderViewportChange2}
            position="top-left"
          />


        </div>
      </div>
    );
  }
}

export default withRouter(Dashboard);
