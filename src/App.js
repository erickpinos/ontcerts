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
import VerifyCertificate from './pages/VerifyCertificate';
import IssueCertificate from './pages/IssueCertificate';

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
		}

		this.onSignMessage = this.onSignMessage.bind(this);
		this.onVerifyMessage = this.onVerifyMessage.bind(this);

	}


	componentDidMount() {

	}

	async onSignMessage() {

		console.log('onSignMessage');

		this.signMessage(this.state.certificates[0]);
		this.signMessage(this.state.certificates[1]);

	}

	async signMessage(message) {
		console.log(message);
		try {
			const result = await client.api.message.signMessage({ message });
		//		tslint:disable-next-line:no-console
				var profile = profiles[result.publicKey];
				console.log('message signed by ' + profile);
				console.log('signature:', result);
				console.log('save this signature', result.data);
	//			alert('onSignMessage finished, signature:' + result.data);
		} catch (e) {
			alert('onSignMessage canceled');
	//		tslint:disable-next-line:no-console
			console.log('onSignMessage error:', e);
		}
	}

	async onVerifyMessage(message, publicKey, data) {

		const signature: Signature = {
			data,
			publicKey
		};

		try {
			const result = await client.api.message.verifyMessage({ message, signature });
			alert('onVerifyMessage finished, result:' + result);
			if (result == true) {
				this.setState({verified: 'verified'});
				var profile = profiles[publicKey];
				this.setState({verifiedFrom: profile});
			}
		} catch (e) {
			alert('onVerifyMessage canceled');
			// tslint:disable-next-line:no-console
			console.log('onVerifyMessage error:', e);
		}
	}

	render() {

		return (

			<div className="App">
      <Router onUpdate={() => window.scrollTo(0, 0)} history={history}>
				<header className="App-header">
					<p className="App-link">ONTcerts</p>
				</header>

				<div className="header-nav" style={{backgroundColor: '#000'}}>
          <div className="header-nav-menu">
						<div className="item"><NavLink to="/your-profile">Your Profile</NavLink></div>
					<div className="item"><NavLink to="/profiles">Profiles</NavLink></div>
					<div className="item"><NavLink to="/issue-certificate">Issue Certificate</NavLink></div>
					<div className="item"><NavLink to="/verify-certificate">Verify Certificate</NavLink></div>
					</div>
				</div>

			<div className="content container">

				<Switch>
					<Route exact path="/"/>
					<Route path="/your-profile" component={YourProfile}/>
					<Route path="/profiles" component={Issuers}/>
					<Route path="/issue-certificate" component={IssueCertificate}/>
					<Route path="/verify-certificate" component={VerifyCertificate}/>
				</Switch>
				</div>

				</Router>
			</div>
		);
	}
}
