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
    this.mapRef = React.createRef()
    this.handleOnpress = this.handleOnpress.bind(this);

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
        this.getRoad();
      });
    }
  };


  getRoad = () => {

    this.setState({ loading: true });

    let data = '?';
    data = `${data}`;

    if (this.mapRef.current !== null) {
      let p=this.mapRef.current.getBounds().toArray();
      // console.log(p);
      data = `${data}&search=${p[0]},${p[1]}`;
    }

    axios.get(`http://localhost:2000/get-road${data}`, {
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

  handleOnpress(event) {
  
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
          ref={this.mapRef}
          style={{
            height: `80vh`,
            width: `100vw`
          }}

          onDrag={this.handleOnpress}
          initialViewState={{
            latitude: 21.032610238914277,
            longitude: 105.84713300000003,
            zoom: 15,
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
