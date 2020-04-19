import React from 'react';
import '../App.css';

import { client } from 'ontology-dapi';

import { Account, Identity, Crypto, Claim, OntidContract, TransactionBuilder,
	RestClient, CONST, Wallet, OntAssetTxBuilder, WebsocketClient, RevocationType } from 'ontology-ts-sdk';

var profiles = require('../data/profiles.js');

client.registerClient({});

const restUrl = 'http://polaris1.ont.io:20334';
const socketUrl = 'ws://polaris1.ont.io:20335';

const adminPrivateKey = new Crypto.PrivateKey('7c47df9664e7db85c1308c080f398400cb24283f5d922e76b478b5429e821b97');
const adminAddress = new Crypto.Address('AdLUBSSHUuFaak9j169hiamXUmPuCTnaRz');

//const privateKey = Crypto.PrivateKey.random();
const privateKey = adminPrivateKey;
const publicKey = privateKey.getPublicKey();

const account = Account.create(privateKey, '123456', 'MyAccount');
const identity = Identity.create(privateKey, '123456', 'MyIdentity');

//const ontid = 'did:ont:AN88DMMBZr5X9ChpMHX3LqRvQHqGxk2c3r';
//const ontid = identity.ontid;

const issuerOntId = identity.ontid;
console.log('issuerOntId', issuerOntId);

const subjectOntId = identity.ontid;
console.log('subjectOntId', subjectOntId);

const address = account.address;
const publicKeyId = issuerOntId + '#keys-1';
console.log('publicKeyId', publicKeyId);

let serialized: string;
let signed: string;

export default class IssueCertificate extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			account: '',
			identity: '',
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

		this.issueClaim = this.issueClaim.bind(this);

		this.issueOntIdClaim = this.issueOntIdClaim.bind(this);

	}

	componentDidMount() {
		this.getAccount();
		this.getIssuerName();
		this.getIdentity();
	}

	async getAccount() {
		const account = await client.api.asset.getAccount();
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

	async getIdentity() {
		const identity = await client.api.identity.getIdentity();
		this.setState({identity: identity});
	}

	async issueOntIdClaim() {

		// Write claim
		const signature = null;
		const useProof = false;

		const claim = new Claim({
		    messageId: '1',
		    issuer: issuerOntId,
		    subject: subjectOntId,
		    issueAt: 1525800823
		}, signature, useProof);
		claim.version = '0.7.0';
		claim.context = 'https://example.com/template/v1';
		claim.content = {
		    Name: 'Bob Dylan',
		    Age: '22',
		};

		// Sign claim
		console.log('issueOntIdClaim signing claim');
		var result = await claim.sign(restUrl, publicKeyId, privateKey);
		console.log('issueOntIdClaim result', result);

		signed = claim.serialize();

		console.log('issueOntIdClaim claim.signature', claim.signature);

		const msg = Claim.deserialize(signed);

		this.verifyClaim(msg);
		this.verifyClaimHasAttest(msg);
		this.verifyClaimAttested(msg);


		this.attestClaim(claim);

	}

	async verifyClaim(msg) {
		const result = await msg.verify(restUrl, false);
		console.log('verifyClaim result', result);
	}

	async verifyClaimHasAttest(msg) {
		const result = await msg.verify(restUrl, true);
		console.log('verifyClaimMissingAttest result', result);
	}

	async verifyClaimAttested(msg) {
		const result = await msg.verify(restUrl, false);
		console.log('verifyClaimAttested result', result);
	}

	async attestClaim(claim) {
		console.log('attestClaim');

		const gasFee = '500';
		const gasLimit = '20000';

		const result = await claim.attest(socketUrl, gasFee, gasLimit, adminAddress, adminPrivateKey);
		console.log('attestClaim', result);

		const signed = claim.serialize();

		const msg = Claim.deserialize(signed);
		this.verifyClaim(msg);
		this.verifyClaimHasAttest(msg);
		this.verifyClaimAttested(msg);

	}

	async signMessage(message) {
		try {
			const result = await client.api.message.signMessage({ message });
			console.log('onSignMessage finished');
			console.log('onSignMessage signature', result.data);
			return result;
		} catch (e) {
			console.log('onSignMessage error', e);
		}
	}

	async issueClaim(sender, recipient, claim) {
		console.log('issueClaim');
		console.log('issueClaim sender', sender);
		console.log('issueClaim recipient', recipient);
		console.log('issueClaim claim', claim);

		// Issue claim by ONT message signing
//		var message = JSON.stringify(claim);
//		const result = await this.signMessage(message);

		// Issue claim by ONT ID claim attestation
		var message = JSON.stringify(claim);
		const result = await this.issueClaimOntId(message);

    console.log('issueClaim result', result);
		console.log('issueClaim data', result.data);
		console.log('issueClaim publicKey', result.publicKey);

		this.setState({'signature': result})

		var signed_certificate = {
			'sender': sender,
			'recipient': recipient,
			'claim': claim,
			'signature': result
		};

		this.setState({json: signed_certificate});
		//		new CSVDownload(this.state.csvClaim);
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
//		alert('A claim was submitted: ' + JSON.stringify(claim));

		this.issueClaim(this.state.sender, this.state.recipient,claim);
	}

	render() {
//		if(!this.state.name){return (<div>Loading</div>)}

		return (
			<div>
			<h3>Issue Certificates</h3>
			<p>You are {this.state.name}</p>

			<div><button onClick={this.issueOntIdClaim}>Issue ONT ID Claim</button></div>

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
		</form>

		{ (this.state.json !== '') && (
			<div className="row justify-content-center">
				<div className="col-6" style={{wordWrap: 'break-word'}}>
					<h3>Resulting JSON</h3>
					<code>
							{JSON.stringify(this.state.json)}
					</code>
					<p>Save this JSON somewhere safe. Your credential will be lost without it.</p>
				</div>
			</div>
			)
		}
			</div>
		);
	}
}
