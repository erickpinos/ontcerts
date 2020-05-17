import React from 'react';
import './App.css';

import { Router, Route, Switch, NavLink } from 'react-router-dom';

import history from './utils/history';

import YourProfile from './pages/YourProfile';
import Issuers from './pages/Issuers';
import ViewCertificates from './pages/ViewCertificates';
import IssueCertificate from './pages/IssueCertificate';

import { getAccount, getIdentity } from './utils/ontology';

//import { client } from 'cyanobridge';
//import { client as clientWeb } from 'ontology-dapi';

var client = require('cyanobridge').client;
client.registerClient({});

export default class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			verified: '',
			verifiedFrom: '',
			connectedWallet: '',
			connectedNickName: '',
			connectedDID: ''
		}

	}

	async componentDidMount() {
//		this.localAccount();
		var account = await getAccount();
		var identity = await getIdentity();

		console.log('account', account);
		console.log('identity', identity);

		this.setState({
			connectedWallet: account,
			connectedDID: identity
		});

	}

	async localAccount() {
		try {
			var clientWeb = require('ontology-dapi').client;
			clientWeb.registerClient({});

			var connectedWallet = await clientWeb.api.asset.getAccount();

			this.setState({
				connectedWallet: connectedWallet,
			});
		} catch(e) {
			console.log(e)
		}

		try {
			var connectedWallet = await client.api.asset.getAccount();

			this.setState({
				connectedWallet: connectedWallet.result,
			});
		} catch(e) {
			console.log(e)
		}

	}

	render() {
		return (

			<div className="App">
	      <Router onUpdate={() => window.scrollTo(0, 0)} history={history}>

					<header className="App-header">
						<p className="App-link">ONTcerts</p>
						<h5 style={{wordBreak: 'break-word'}}> Connected Wallet: {this.state.connectedWallet}</h5>
						<h5 style={{wordBreak: 'break-word'}}> Connected DID: {this.state.connectedDID}</h5>
					</header>

					<div className="header-nav" style={{backgroundColor: '#000', marginBottom: '20px'}}>
	        	<div className="header-nav-menu">
{/*							<div className="item"><NavLink to="/your-profile">Your Profile</NavLink></div> */}
							<div className="item"><NavLink to="/issuers">Issuers</NavLink></div>
{/*							<div className="item"><NavLink to="/issue-certificate">Issue Certificate</NavLink></div> */}
							<div className="item"><NavLink to="/view-certificates">View Certificates</NavLink></div>
						<div className="item"><a href="https://docs.ont.io/ontology-elements/ontid" target="_blank">Learn More About ONT ID</a></div>
						</div>
					</div>

					<div className="content container">
						<Switch>
							<Route exact path="/"/>
							<Route path="/your-profile" component={YourProfile}/>
							<Route path="/issuers" component={Issuers}/>
							<Route path="/issue-certificate" component={IssueCertificate}/>
							<Route path="/view-certificates" component={ViewCertificates}/>
						</Switch>
					</div>

				</Router>
			</div>
		);
	}
}
