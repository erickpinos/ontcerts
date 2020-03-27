// TODO:
//  Repository of issuers, issuer logo, issuer contact email, and issuer's public key.
//  When issuing a certificate, the issuer can sign the
//  Anyone can become an issuer, but certain issuers are trust anchors.

import React from 'react';
import logo from './logo.svg';
import './App.css';

import { client } from 'ontology-dapi';

import benLogo from './images/ben-logo.png';
import mitLogo from './images/mit-logo.png';

import IssueCertificate from './IssueCertificate';

client.registerClient({});

var issuers = {
	'03f631f975560afc7bf47902064838826ec67794ddcdbcc6f0a9c7b91fc8502583': 'BEN',
	'03a5ad912c8f7df57f5528f4067b8f5b69e371097e43d9acb9325a2dbc0578373e': 'MIT'
}

var issuers2 = {
	'03f631f975560afc7bf47902064838826ec67794ddcdbcc6f0a9c7b91fc8502583': { 'issuerName': 'BEN', 'issuerEmail': 'email', 'issuerLogo': benLogo},
	'03a5ad912c8f7df57f5528f4067b8f5b69e371097e43d9acb9325a2dbc0578373e': { 'issuerName': 'MIT', 'issuerEmail': 'email', 'issuerLogo': mitLogo}
}

var car = require("./signed_certificates/certificate1.json");
var certificate2 = require("./signed_certificates/certificate2.json");
var certificate3 = require("./signed_certificates/certificate3.json");

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			certificates: [],
			signatures: ['','01551fad767d0224484695a14f3c89fb72a162cc04ea2ebd78b5146a66191072803d5ef812c2aee4e3e743ec556d2fc800fa0c5316ae4cf37d9ae8d238fde274f7'],
			verified: '',
			verifiedFrom: ''
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
//		this.getCertificate('./signed_certificates/certificate1.json');
//		this.getCertificate('./signed_certificates/certificate2.json');
		this.getCertificate('./signed_certificates/certificate3.json');

//		doAsyncStuff().then((res)=>{this.setState({promiseIsResolved: true})})
	}

	getCertificate(certificateURL) {
		fetch(certificateURL)
		.then((response) => response.text())
		.then((data) =>{
//			console.log(data);
			var certificate = certificate3;
			certificate.claim = JSON.parse(certificate3.claim);
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
			if (result == true) {
				this.setState({verified: 'verified'});
				var issuer = issuers[publicKey];
				this.setState({verifiedFrom: issuer});
			}
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

		if(!this.state.certificates[0]){return (<div>No certificate detected.</div>)}

//		if(!this.state.certificates[1]){return (<div>No certificate detected.</div>)}

//		if(!this.state.certificates[2]){return (<div>No certificate detected.</div>)}

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
						<IssueCertificate />
					</div>

					<h3>Verify Certificates</h3>

				<div className="row justify-content-center">
					<div className="col-lg-6 col-10">
						<div className="card">
						<div className="card-body">
						<h5>Massachusetts Institute of Technology</h5>
						<p className="cert-intro">Upon the recommendation of the faculty hereby confers on</p>
						<p className="cert-recipient">Erick Jose Pinos</p>
						<p>The Degree of</p>
						<p className="cert-type">Bachelor of Science</p>
						<p>in</p>
						<p className="cert-topic">Management</p>
						<p>In recognition of proficency in the general and the special studies and exercises prescribed by said institute for such degree given this day under teh seal of the Institute at Cambridge in the Commwealth of Massachusetts</p>
						<p className="cert-date">February 21, 2018</p>
						<p>R Margery Morgan</p>
						<p>Secretary</p>
						<p className="cert-sign-sig">Rafael Reif</p>
						<p className="cert-sign-title">President</p>
						<img className="cert-logo" src={mitLogo} />

						</div>
						<button onClick={() => this.onVerifyMessage(this.state.certificates[1]['claim'],this.state.certificates[1]['signature']['publicKey'],this.state.certificates[1]['signature']['data'])}>Verify Certificate 2</button>
						<p>This certificate is {this.state.verified} from {this.state.verifiedFrom}</p>
						</div>
					</div>
				</div>

				<div className="row justify-content-center">
					<div className="col-lg-6 col-10">
						<div className="card cert">
						<div className="card-body">
							<img className="cert-logo" src={benLogo} />
							<h3 className="cert-type">{this.state.certificates[0].claim['certType']}</h3>
							<p className="cert-intro">{this.state.certificates[0].claim['certIntro']}</p>
							<h4 className="cert-recipient">{this.state.certificates[0].claim['certRecipient']}</h4>
							<p className="cert-for">{this.state.certificates[0].claim['certFor']}</p>
							<h4 className="cert-topic">{this.state.certificates[0].claim['certTopic']}</h4>
							<p className="cert-date">{this.state.certificates[0].claim['certDate']}</p>
							<p className="cert-spacer"></p>
							<h4 className="cert-sign-sig">{this.state.certificates[0].claim['certSignSig']}</h4>
							<p className="cert-sign-name">{this.state.certificates[0].claim['certSignname']}</p>
							<p className="cert-sign-title">{this.state.certificates[0].claim['certSignTitle']}</p>
						<button onClick={() => this.onVerifyMessage(JSON.stringify(this.state.certificates[0]['claim']),this.state.certificates[0]['signature']['publicKey'],this.state.certificates[0]['signature']['data'])}>Verify Certificate 2</button>
						<p>This certificate is {this.state.verified} from {this.state.verifiedFrom}</p>
						</div>
						</div>
					</div>
				</div>

			</div>
		);
	}
}

export default App;
