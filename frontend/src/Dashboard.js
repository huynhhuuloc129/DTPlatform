import React, { Component } from 'react';
import ReactMapGL from 'react-map-gl';
import { Source, Layer } from 'react-map-gl';

import {
  Button, LinearProgress
} from '@material-ui/core';
import swal from 'sweetalert';
import { withRouter } from './utils';
const axios = require('axios');
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN; // Set your mapbox token here

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      token: '',
      openProductModal: false,
      openProductEditModal: false,
      id: '',
      name: '',
      desc: '',
      price: '',
      discount: '',
      file: '',
      fileName: '',
      page: 1,
      search: '',
      roads: {
        "type": "FeatureCollection",
        "features": []
      },
      pages: 0,
      loading: false
    };
  }

  componentDidMount = () => {
    let token = localStorage.getItem('token');
    if (!token) {
      // this.props.history.push('/login');
      this.props.navigate("/login");
    } else {
      this.setState({ token: token }, () => {
        this.getRoad();
      });
    }
  }


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
        this.getProduct();
      });
    }
  };


  getRoad = () => {

    this.setState({ loading: true });

    axios.get(`http://localhost:2000/get-road`, {
      headers: {
        'token': this.state.token
      }
    }).then((res) => {
      this.setState({
        loading: false, roads: {
          "type": "FeatureCollection",
          "features":
            res.data.roads
        }
      });
      // console.log(res.data.roads);
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error"
      });
      this.setState({ loading: false, roads: [] }, () => { });
    });
  }

  render() {
    const dataLayer = {
      id: 'data',
      type: 'fill',
      paint: {
        'fill-color': {
          property: 'percentile',
          stops: [
            [0, '#3288bd'],
            [1, '#66c2a5'],
            [2, '#abdda4'],
            [3, '#e6f598'],
            [4, '#ffffbf'],
            [5, '#fee08b'],
            [6, '#fdae61'],
            [7, '#f46d43'],
            [8, '#d53e4f']
          ]
        },
        'fill-opacity': 0.8
      }
    };
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


        <ReactMapGL
          style={{
            height: `80vh`,
            width: `100vw`
          }}
          initialViewState={{
            latitude: 21.032610238914277,
            longitude: 105.84713300000003,
            zoom: 10,
          }}
          mapStyle="mapbox://styles/mapbox/light-v11"
          mapboxAccessToken={MAPBOX_TOKEN}
        >
          <Source type="geojson" data={this.state.roads}>
            <Layer {...dataLayer} />
          </Source>

        </ReactMapGL>
      </div>
    );
  }
}

export default withRouter(Dashboard);
