import React from 'react';
import '../App.css';

import { AirtableOntCerts } from '../utils/airtable';

import { client } from 'ontology-dapi';

import { Account, Identity, Crypto, Claim, Merkle } from 'ontology-ts-sdk';

import { testBlockchain, testSignature } from '../utils/ontology';

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
			subject: '',
			claim: '',
			signature: '',
			json: '',
			name: '',
			certInstitutionName: 'BEN',
			certSubject: 'Erick Pinos',
			certCourseName: 'ERC20 Token',
			certFinalGrade: 'Pass'
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

	async issueOntIdClaim(message, subject) {

		const timestamp = Date.now();
		const restUrl = 'http://polaris1.ont.io:20334';
		const socketUrl = 'ws://polaris1.ont.io:20335';

		const adminPrivateKey = new Crypto.PrivateKey('7c47df9664e7db85c1308c080f398400cb24283f5d922e76b478b5429e821b97');
		const adminAddress = new Crypto.Address('AdLUBSSHUuFaak9j169hiamXUmPuCTnaRz');

		const ontid = 'did:ont:AeXrnQ7jvo3HbSPgiThkgJ7ifPQkzXhtpL';
		const publicKeyId = ontid + '#keys-1';
		const privateKey = new Crypto.PrivateKey('4a8d6d61060998cf83acef4d6e7976d538b16ddeaa59a96752a4a7c0f7ec4860');

		// Write claim
		const signature = undefined;
		const useProof = true;

		const claim = new Claim({
		    messageId: '2020/04/22',
		    issuer: ontid,
		    subject: ontid,
		    issuedAt: timestamp
		}, signature, useProof);
		claim.version = '0.7.0';
		claim.context = 'https://example.com/template/v1';
/*		claim.content = {
		    Name: 'Bob Dylan',
		    Age: '22',
		};
*/
		claim.content = message;

		// Sign claim

		console.log('issueOntIdClaim claim unsigned', claim);
		await claim.sign(restUrl, publicKeyId, privateKey);

		console.log('issueOntIdClaim claim signed', claim);

		// Attest claim
		const gasFee = '500';
		const gasLimit = '20000';

		const attestResult = await claim.attest(socketUrl, gasFee, gasLimit, adminAddress, adminPrivateKey);
		console.log('issueOntIdClaim attestResult', attestResult);
//		txhash "00fbe7b186c9fef8861c9d5ce83a53fc9a0f82b82aaa94c55fc054bc08c021af";

		console.log('issueOntIdClaim claim attested', claim);

		const contract = '36bb5c053b6b839c8f6b923fe852f91239b9fccc';
		const proof = await Merkle.constructMerkleProof(restUrl, attestResult.Result.TxHash, contract);

		claim.proof = proof;
		console.log('issueOntIdClaim claim wtih proof clamtomatch', claim);

		const signed = claim.serialize();
		console.log('issueOntIdClaim claim serialized', signed);

		const msg = Claim.deserialize(signed);

		console.log('issueOntIdClaim msg deserialized claimtomatch', msg);

		const testBlockchainResult = await testBlockchain(signed);
		console.log('issueOntIdClaim testBlockchainResult', testBlockchainResult);

		const testSignatureResult = await testSignature(signed);
		console.log('issueOntIdClaim testSignatureResult', testSignatureResult);

		var fields = {'claim': signed}
		this.addClaimToAirtable(fields);

	}

	async verifyClaim(msg) {
		const result = await msg.verify(restUrl, false);
		console.log('verifyClaim result', result);
	}

	async verifyClaimAttested(msg) {
		console.log('verifyClaimAttested msg', msg);
//		const result = await msg.verify(restUrl, true);
		const result = await msg.getStatus(restUrl);
		console.log('verifyClaimAttested result', result);
}

	async issueClaim(sender, subject, claim) {
		console.log('issueClaim');
		console.log('issueClaim sender', sender);
		console.log('issueClaim subject', subject);
		console.log('issueClaim claim', claim);

		// Issue claim by ONT message signing
//		var message = JSON.stringify(claim);
//		const result = await this.signMessage(message);

		// Issue claim by ONT ID claim attestation
//		var message = JSON.stringify(claim);
		const result = await this.issueOntIdClaim(claim, subject);

		this.setState({'signature': result})


		var signed_certificate = {
			'sender': sender,
			'subject': subject,
			'claim': claim,
			'signature': result
		};

		this.setState({json: signed_certificate});
		//		new CSVDownload(this.state.csvClaim);
	}

	async addClaimToAirtable(fields) {
	  await AirtableOntCerts('Claims').create([
	    {
	      fields
	    }
	  ], function(err, records) {
	    if (err) {
	      console.error(err);
	      return;
	    }
	    records.forEach(function (record) {
	      console.log('addClaimToAirtable() record.getId() = ', record.getId());
	    });
	  });
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
		claim['Institution Name'] = this.state.certInstitutionName;
		claim['Recipient ONT ID'] = this.state.certSubject;
		claim['Course Name'] = this.state.certCourseName;
		claim['Final Grade'] = this.state.certFinalGrade;

		this.setState({'claim': claim});
//		alert('A claim was submitted: ' + JSON.stringify(claim));

		this.issueClaim(this.state.sender, this.state.subject, claim);
	}

	render() {
//		if(!this.state.name){return (<div>Loading</div>)}

		// Types
		return (
			<div>
			<h3>Issue Certificates</h3>
			<p>Issuing a Certificate Costs 0.01 ONG</p>
			<p>You are {this.state.name}</p>

			<form onSubmit={this.handleSubmit}>

			<div className="form-group">
				<div className="form-group">
					<label>Institution Name:</label>
					<div>
						<textarea name="certInstitutionName" value={this.state.certInstitutionName} onChange={this.handleChange} required/>
					</div>
				</div>

				<label>Recipient ONT ID:</label>
					<div>
						<textarea name="certSubject" value={this.state.certSubject} onChange={this.handleChange} required/>
					</div>
				</div>

				<div className="form-group">
					<label>Course Name:</label>
					<div>
						<textarea name="certCourseName" value={this.state.certCourseName} onChange={this.handleChange} required/>
					</div>
				</div>

				<div className="form-group">
					<label>Final Grade:</label>
					<div>
						<textarea name="certFinalGrade" value={this.state.certFinalGrade} onChange={this.handleChange} required/>
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
