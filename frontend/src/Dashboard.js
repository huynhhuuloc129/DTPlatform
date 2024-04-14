import React, { Component } from 'react';
import ReactMapGL from 'react-map-gl';

import {
  Button, LinearProgress
} from '@material-ui/core';
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
      products: [],
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


  render() {
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
            zoom: 12,
          }}
          mapStyle="mapbox://styles/mapbox/light-v11"
          mapboxAccessToken={MAPBOX_TOKEN}
        />


      </div>
    );
  }
}

export default withRouter(Dashboard);
