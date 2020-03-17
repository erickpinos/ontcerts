import React from 'react';
import logo from './logo.svg';
import './App.css';

import { client } from 'ontology-dapi';

import IssueClaim from './IssueClaim';

client.registerClient({});

var issuers = {
	'03f631f975560afc7bf47902064838826ec67794ddcdbcc6f0a9c7b91fc8502583': 'BEN',
	'03a5ad912c8f7df57f5528f4067b8f5b69e371097e43d9acb9325a2dbc0578373e': 'MIT'
}

var car = require("./signed_certificates/certificate1.json");

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			certificates: [],
			signatures: ['','01551fad767d0224484695a14f3c89fb72a162cc04ea2ebd78b5146a66191072803d5ef812c2aee4e3e743ec556d2fc800fa0c5316ae4cf37d9ae8d238fde274f7']
		}

		this.onSignMessage = this.onSignMessage.bind(this);
		this.onVerifyMessage = this.onVerifyMessage.bind(this);

	}

	async getIssuerName() {
		console.log('getIssuerName()');

		const publicKey = await client.api.asset.getPublicKey();
		console.log('the account is', publicKey);

		var issuer = issuers[publicKey];
		console.log('the issuer is', issuer);

		this.setState({name: issuer});
		console.log('this.state.name set to', this.state.name);

	}

	componentDidMount() {

		// Get Issuer Name
		this.getIssuerName();

		// Get Certificates
		this.getCertificate('./signed_certificates/certificate1.json');

//		doAsyncStuff().then((res)=>{this.setState({promiseIsResolved: true})})
	}

	getCertificate(certificateURL) {
		fetch(certificateURL)
		.then((response) => response.text())
		.then((data) =>{
//			console.log(data);
			var certificate = car;
			var certificates = this.state.certificates;
			certificates.push(certificate);
			this.setState({certificates: certificates});
			console.log('this.state.certificates set to', this.state.certificates);
			console.log(this.state.certificates[0]);
			var certificatethis = this.state.certificates[0];
			console.log('certificatethis', certificatethis);
			console.log(certificatethis.recipient);
		})		
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
				var issuer = issuers[result.publicKey];
				console.log('message signed by ' + issuer);
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
		} catch (e) {
			alert('onVerifyMessage canceled');
			// tslint:disable-next-line:no-console
			console.log('onVerifyMessage error:', e);
		}
	}

	render() {
//		if (typeof this.state.name !== 'undefined') {
//			console.log("this.state.name: ", this.state.name);
//		} else {
//			console.log("this.state.name: Not Pulled Yet");
//		}

//		var test = this.state.name;

		if(!this.state.name){return (<div>Switch to an Issuer wallet</div>)}

		return (

			<div className="App">
				<header className="App-header" style={{ minHeight: '50vh'}}>
					<img src={logo} className="App-logo" alt="logo" />
					<p className="App-link">ONTcerts</p>
				</header>

				<div className="row">
					<div className="col">
						<h3>Issuers</h3>
					</div>
				</div>

				<div className="row">
					<div className="col">
						<table style={{margin: '0 auto'}}>
						  <thead>
								<tr>
									<th>Issuer</th>
									<th>Public Key</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>BEN</td>
									<td>03f631f975560afc7bf47902064838826ec67794ddcdbcc6f0a9c7b91fc8502583</td>
								</tr>
								<tr>
									<td>MIT</td>
									<td>03a5ad912c8f7df57f5528f4067b8f5b69e371097e43d9acb9325a2dbc0578373e</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>

					<h3>Issue Certificates</h3>
					<p>You are {this.state.name}</p>
					<div className="row justify-content-center">
						<IssueClaim />
					</div>
					<button onClick={this.onSignMessage}>Click Me</button>
				
					<h3>Verify Certificates</h3>

				<div className="row justify-content-center">
					<div className="col-3">
						<div className="card">
						<h5>Certificate 1</h5>
						<p>{JSON.stringify(this.state.certificates[0])}</p>
						<button onClick={() => this.onVerifyMessage(this.state.certificates[0]['claim'],this.state.certificates[0]['signature']['publicKey'],this.state.certificates[0]['signature']['data'])}>Verify Certificate 1</button>
						</div>
					</div>
				</div>

					<h3>To Do</h3>
					<ul>
					<li>Repository of issuers, issuer logo, issuer contact email, and issuer's public key.</li>
					<li>When issuing a certificate, the issuer can sign the</li>
					<li>Anyone can become an issuer, but certain issuers are trust anchors.</li>
					</ul>

			</div>
		);
	}
}

export default App;
