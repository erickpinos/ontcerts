import React from 'react';
import '../App.css';

import { client } from 'cyanobridge';

var profiles = require('../data/profiles.js');

client.registerClient({});

export default class IssueCertificate extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			sender: '',
			recipient: '',
			claim: '',
			signature: '',
			json: '',
			name: '',
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

	componentDidMount() {
		this.getAccount();
		this.getIssuerName();
	}

	async getAccount() {
		const account = await client.api.asset.getAccount();
		console.log('account', account);
		this.setState({sender: account});
	}

	async getIssuerName() {

		const account = await client.api.asset.getAccount();
		console.log('account', account);

		for (let i = 0; i < profiles.length; i++) {
			if (profiles[i]['account'] === this.state.sender) {
				this.setState({
					name: profiles[i].name,
				});
			}
		}
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
		if(!this.state.name){return (<div>Loading</div>)}

		return (
			<div>
			<h3>Issue Certificates</h3>
			<p>You are {this.state.name}</p>
			<form onSubmit={this.handleSubmit}>

				<div className="form-group">
					<label>Type:</label>
					<div>
						<textarea name="certType" value={this.state.certType} onChange={this.handleChange} required/>
					</div>
				</div>

				<div className="form-group">
					<label>Intro:</label>
					<div>
						<textarea name="certIntro" value={this.state.certIntro} onChange={this.handleChange} required/>
					</div>
				</div>

				<div className="form-group">
					<label>Recipient:</label>
					<div>
						<textarea name="certRecipient" value={this.state.certRecipient} onChange={this.handleChange} required/>
					</div>
				</div>

				<div className="form-group">
					<label>For:</label>
					<div>
						<textarea name="certFor" value={this.state.certFor} onChange={this.handleChange} required/>
					</div>
				</div>

				<div className="form-group">
					<label>Topic:</label>
					<div>
						<textarea name="certTopic" value={this.state.certTopic} onChange={this.handleChange} required/>
					</div>
				</div>

				<div className="form-group">
					<label>Date:</label>
					<div>
						<textarea name="certDate" value={this.state.certDate} onChange={this.handleChange} required/>
					</div>
				</div>

				<div className="form-group">
					<label>Signature:</label>
					<div>
						<textarea name="certSignSig" value={this.state.certSignSig} onChange={this.handleChange} required/>
					</div>
				</div>

				<div className="form-group">
					<label>Sign Name:</label>
					<div>
						<textarea name="certSignName" value={this.state.certSignName} onChange={this.handleChange} required/>
					</div>
				</div>

				<div className="form-group">
					<label>Sign Title:</label>
					<div>
						<textarea name="certSignTitle" value={this.state.certSignTitle} onChange={this.handleChange} required/>
					</div>
				</div>

				<div className="form-group">
					<input type="submit" value="Submit" />
				</div>

				<div class="row justify-content-center">
				<div className="col-6" style={{wordWrap: 'break-word'}}>
					<code>
						<div>
							Sender: {this.state.sender}
						</div>

						<div>
						Signature: {JSON.stringify(this.state.signature)}
						</div>
					</code>
				</div>
				</div>

				<div class="row justify-content-center">
					<div class="col-6" style={{wordWrap: 'break-word'}}>
						{JSON.stringify(this.state.json)}
					</div>
				</div>
		</form>
			</div>
		);
	}
}
