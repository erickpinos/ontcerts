import React from 'react';
import '../App.css';

import { client } from 'cyanobridge';

import benLogo from '../images/ben-logo.png';

var profiles = require('../data/profiles.js');

client.registerClient({});


var certificate3 = require("../signed_certificates/certificate3.json");

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
	}

	async getPublicKey() {
		const publicKey = await client.api.asset.getPublicKey();
		console.log('the public key is', publicKey);
		this.setState({sender: publicKey});
	}

	componentDidMount() {
		this.getPublicKey();

    this.getCertificate('./signed_certificates/certificate3.json');
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

	render() {

    if(!this.state.certificates[0]){return (<div>No certificate detected.</div>)}

		return (
			<div>


      <h3>Verify Certificates</h3>

{/*
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
*/}
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
          <p className="cert-sign-name">{this.state.certificates[0].claim['certSignName']}</p>
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
