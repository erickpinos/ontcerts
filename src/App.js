import React from 'react';
import './App.css';

import { client } from 'ontology-dapi';

import { Router, Route, Switch, NavLink } from 'react-router-dom';

import history from './utils/history';

import benLogo from './images/ben-logo.png';
import mitLogo from './images/mit-logo.png';
import erickImage from './images/erick-image.jpg';

import YourProfile from './pages/YourProfile';
import Issuers from './pages/Issuers';
import ViewCertificates from './pages/ViewCertificates';
import IssueCertificate from './pages/IssueCertificate';

import { getAccount } from './utils/ontology';

var profiles = require('./data/profiles.js');

client.registerClient({});

var car = require("./signed_certificates/certificate1.json");
var certificate2 = require("./signed_certificates/certificate2.json");


export default class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			signatures: ['','01551fad767d0224484695a14f3c89fb72a162cc04ea2ebd78b5146a66191072803d5ef812c2aee4e3e743ec556d2fc800fa0c5316ae4cf37d9ae8d238fde274f7'],
			verified: '',
			verifiedFrom: '',
			connectedWallet: '',
			connectedNickName: ''
		}

	}

	async componentDidMount() {
		this.setState({
			connectedWallet: await getAccount()
		});
	}

	render() {
		return (

			<div className="App">
	      <Router onUpdate={() => window.scrollTo(0, 0)} history={history}>

					<header className="App-header">
						<p className="App-link">ONTcerts</p>
						<h5> Connected Wallet: {this.state.connectedWallet}</h5>
						<h5> Welcome, {this.state.connectedNickName}</h5>
					</header>

					<div className="header-nav" style={{backgroundColor: '#000'}}>
		        <div className="header-nav-menu">
							<div className="item"><NavLink to="/your-profile">Your Profile</NavLink></div>
						<div className="item"><NavLink to="/profiles">Profiles</NavLink></div>
						<div className="item"><NavLink to="/issue-certificate">Issue Certificate</NavLink></div>
						<div className="item"><NavLink to="/view-certificates">View Certificates</NavLink></div>
						</div>
					</div>

					<div className="content container">
						<Switch>
							<Route exact path="/"/>
							<Route path="/your-profile" component={YourProfile}/>
							<Route path="/profiles" component={Issuers}/>
							<Route path="/issue-certificate" component={IssueCertificate}/>
							<Route path="/view-certificates" component={ViewCertificates}/>
						</Switch>
					</div>

				</Router>
			</div>
		);
	}
}
