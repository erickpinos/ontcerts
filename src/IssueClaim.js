import React from 'react';
import './App.css';

import { client } from 'ontology-dapi';

client.registerClient({});

var issuers = {
	'03f631f975560afc7bf47902064838826ec67794ddcdbcc6f0a9c7b91fc8502583': 'BEN',
	'03a5ad912c8f7df57f5528f4067b8f5b69e371097e43d9acb9325a2dbc0578373e': 'MIT'
}

class IssueClaim extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			sender: '',
			recipient: '',
			claim: '',
			signature: '',
			json: ''
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
	}

	async issueClaim(sender, recipient, claim) {
		console.log('issueClaim()');
		console.log('sender', sender);
		console.log('recipient', recipient);
		console.log('claim', claim);

		const message = claim;

		try {
			const result = await client.api.message.signMessage({ message });

      console.log('signature:', result);

			var issuer = issuers[result['publicKey']];

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
		alert('An claim was submitted: ' + this.state.recipient + this.state.claim);
		event.preventDefault();
		this.issueClaim(this.state.sender, this.state.recipient, this.state.claim);
	}

	render() {
		return (
			<form onSubmit={this.handleSubmit}>

				<div>
					<label>Claim:</label>
					<div>
						<textarea name="claim" value={this.state.claim} onChange={this.handleChange} />
					</div>
				</div>

				<div>
					<label>Recipient:</label>
					<div>
						<input name="recipient" value={this.state.recipient} onChange={this.handleChange} />
					</div>
				</div>

				<div>
					<input type="submit" value="Submit" />
				</div>

				<div class="row justify-content-center">
				<div className="col-6" style={{wordWrap: 'break-word'}}>
					<code>
						<div>
							Sender: {this.state.sender}
						</div>

						<div>
							Recipient: {this.state.recipient}
						</div>

						<div>
						Claim: {this.state.claim}
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
		);
	}
}

export default IssueClaim;