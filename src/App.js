import React from 'react';
import './App.css';

import { client } from 'ontology-dapi';
import { Router, Route, Switch, NavLink } from 'react-router-dom';

import history from './utils/history';

import benLogo from './images/ben-logo.png';
import mitLogo from './images/mit-logo.png';
import erickImage from './images/erick-image.jpg';

import Issuers from './pages/Issuers';
import VerifyCertificate from './pages/VerifyCertificate';
import IssueCertificate from './pages/IssueCertificate';

var profiles = require('./data/profiles.js');

client.registerClient({});


var car = require("./signed_certificates/certificate1.json");
var certificate2 = require("./signed_certificates/certificate2.json");

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			signatures: ['','01551fad767d0224484695a14f3c89fb72a162cc04ea2ebd78b5146a66191072803d5ef812c2aee4e3e743ec556d2fc800fa0c5316ae4cf37d9ae8d238fde274f7'],
			verified: '',
			verifiedFrom: '',
			name: '',
			account: '',
			publicKey: '',
			email: '',
			image: ''
		}

		this.onSignMessage = this.onSignMessage.bind(this);
		this.onVerifyMessage = this.onVerifyMessage.bind(this);

	}

	async getProfile() {

    const account = await client.api.asset.getAccount();
    console.log('account', account);
		this.setState({account: account});

		const publicKey = await client.api.asset.getPublicKey();
		console.log('publicKey', publicKey);
		this.setState({publicKey: publicKey});

		for (let i = 0; i < profiles.length; i++) {
				if (profiles[i]['account'] == account) {
					this.setState({
						name: profiles[i].name,
						email: profiles[i].email,
						image: profiles[i].image
					});
				}
		}

	}

	componentDidMount() {

		this.getProfile();

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

		if(!this.state.account){return (<div>Loading</div>)}
		return (

			<div className="App">
      <Router onUpdate={() => window.scrollTo(0, 0)} history={history}>
				<header className="App-header">
					<p className="App-link">ONTcerts</p>
				</header>

				<div className="header-nav" style={{backgroundColor: '#000'}}>
          <div className="header-nav-menu">
					<div className="item"><NavLink to="/issuers">Issuers</NavLink></div>
					<div className="item"><NavLink to="/issue-certificate">Issue Certificate</NavLink></div>
					<div className="item"><NavLink to="/verify-certificate">Verify Certificate</NavLink></div>
					</div>
				</div>

			<div className="content container">

				<div className="Profile">

					<div className="row">
		        <div className="col-12">
		          <h3>Your Profile</h3>
		        </div>
		      </div>

					<div className="row justify-content-center">
		        <div className="col-md-4 text-left">
							<div><b>Name</b>: {this.state.name}</div>
							<div><b>Email</b>: {this.state.email}</div>
							<div><b>Account</b>: {this.state.account}</div>
							<div><b>Public Key</b>: {this.state.publicKey}</div>
							<div><b>Image</b>: <img width="150px" src={this.state.image}/></div>
						</div>
					</div>

				</div>

				<Switch>
					<Route exact path="/" component={Issuers}/>
					<Route path="/issuers" component={Issuers}/>
					<Route path="/issue-certificate" component={IssueCertificate}/>
					<Route path="/verify-certificate" component={VerifyCertificate}/>
				</Switch>
				</div>

				</Router>
			</div>
		);
	}
}

export default App;
