import React from 'react';
import '../App.css';

import { client } from 'ontology-dapi';

import benLogo from '../images/ben-logo.png';

import Certificate from '../components/Certificate.js';

var profiles = require('../data/profiles.js');

client.registerClient({});

var certificates = [];

for (let i = 0; i < 3; i++) {
	try {
		var certificate = require("../signed_certificates/certificate" + i + ".json");
		certificates.push(certificate);
	} catch(e) {
		console.log(e);
	}
}

console.log('certificates', certificates);

export default class IssueCertificate extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
      certificates: [],
			sender: '',
			recipient: '',
			claim: '',
			signature: '',
			json: '',
			certType: 'Certificate of Completion',
			certIntro: 'This certificate is awarded to',
			certRecipient: 'Erick Pinos',
			certFor: 'for successfully completing the BEN lesson',
			certTopic: 'Launch an ERC20 Token',
			certDate: 'February 14, 2020',
			certSignSig: 'Erick Pinos',
			certSignName: 'Erick Pinos',
			certSignTitle: 'President'
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);

		this.onVerifyMessage = this.onVerifyMessage.bind(this);

	}

	async getPublicKey() {
		const publicKey = await client.api.asset.getPublicKey();
		console.log('the public key is', publicKey);
		this.setState({sender: publicKey});
	}

	componentDidMount() {
		this.getPublicKey();

//    this.getCertificate('./signed_certificates/certificate3.json');
	}

/*
  getCertificate(certificateURL) {
		fetch(certificateURL)
		.then((response) => response.text())
		.then((data) =>{
//			console.log(data);
			var certificates = ['1'];
			var certificate = certificates[2];
			certificate.claim = JSON.parse(certificates[2].claim);
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
*/
	async issueClaim(sender, recipient, claim) {
		console.log('issueClaim()');
		console.log('sender', sender);
		console.log('recipient', recipient);
		console.log('claim', claim);

		var message = claim;

		try {
			const result = await client.api.message.signMessage({ message });

      console.log('signature:', result);

			var issuer = profiles[result['publicKey']];

			console.log('claim signed by ' + issuer);
			console.log('signature:', result);
			console.log('data', result.data);
			console.log('publicKey', result.publicKey);

			this.setState({'signature': result})

			var signed_certificate = {
				'sender': sender,
				'recipient': recipient,
				'claim': message,
				'signature': result
			};

			this.setState({json: signed_certificate});
//		new CSVDownload(this.state.csvClaim);
	//			alert('onSignMessage finished, signature:' + result.data);
		} catch (e) {
			alert('onSignMessage canceled');
			console.log('onSignMessage error:', e);
		}
	}

	handleChange(event) {
		this.setState({
			[event.target.name]: event.target.value,
		});
		console.log(event.target.value);
	}

	handleSubmit(event) {
		event.preventDefault();
		var claim = {};
		claim.certType = this.state.certType;
		claim.certIntro = this.state.certIntro;
		claim.certRecipient = this.state.certRecipient;
		claim.certFor = this.state.certFor;
		claim.certTopic = this.state.certTopic;
		claim.certDate = this.state.certDate;
		claim.certSignSig = this.state.certSignSig;
		claim.certSignName = this.state.certSignName;
		claim.certSignTitle = this.state.certSignTitle;
		this.setState({'claim': claim});
		alert('A claim was submitted: ' + JSON.stringify(claim));
		this.issueClaim(this.state.sender, this.state.recipient, claim);
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

    if(!certificates[0]){return (<div>No certificates detected.</div>)}

		return (
			<div>

      <h3>Verify Certificates</h3>

			<div class='certificates'>

				{certificates.map(certificate => <Certificate key={certificate.recipient} certificate={certificate} />)}

			</div>

			</div>
		);
	}
}
