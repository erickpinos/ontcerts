import React from 'react';
import '../App.css';

import { AirtableOntCerts } from '../utils/airtable';

import { client } from 'ontology-dapi';

import { Account, Identity, Crypto, Claim, OntidContract, OntidContractTxBuilder, TransactionBuilder,
	RestClient, CONST, Wallet, OntAssetTxBuilder, WebsocketClient, RevocationType,
	attestClaimTxBuilder, Merkle } from 'ontology-ts-sdk';

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
			certName: 'Launch an ERC20 Token',
			certRecipient: 'Erick Pinos',
			certDescription: 'for successfully completing the BEN lesson'
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

	async issueOntIdClaim(message) {

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

//		signed = claim.serialize();

//		console.log('issueOntIdClaim claim.signature', claim.signature);

//		const msg = Claim.deserialize(signed);

//		this.verifyClaim(msg);
//		this.verifyClaimAttested(msg);

//		this.attestClaim(claim);

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

		const verifyResult = await msg.verify(restUrl, true);

//		const verifyResult = await msg.getStatus(restUrl);
		console.log('issueOntIdClaim verifyResult', verifyResult);

		var fields = {'claim': JSON.stringify(signed)}
		this.addClaimToAirtable(fields);

/*
		const pk = privateKey.getPublicKey();
		const strs = signed.split('.');

		const signData = this.str2hexstr(strs[0] + '.' + strs[1]);
		const result2 = pk.verify(signData, msg.signature);

console.log('issueOntIdClaim result2', result2);
*/
	}

	/**
	 * Turn normal string into hex string
	 * @param str Normal string
	 */
	str2hexstr(str: string) {
	    return this.ab2hexstring(this.str2ab(str));
	}

	/**
	 * Turn normal string into ArrayBuffer
	 * @param str Normal string
	 */
	str2ab(str: string) {
	    const buf = new ArrayBuffer(str.length); // 每个字符占用1个字节
	    const bufView = new Uint8Array(buf);
	    for (let i = 0, strLen = str.length; i < strLen; i++) {
	        bufView[i] = str.charCodeAt(i);
	    }
	    return buf;
	}

	/**
 * Turn array buffer into hex string
 * @param arr Array like value
 */
ab2hexstring(arr: any): string {
    let result: string = '';
    const uint8Arr: Uint8Array = new Uint8Array(arr);
    for (let i = 0; i < uint8Arr.byteLength; i++) {
        let str = uint8Arr[i].toString(16);
        str = str.length === 0
            ? '00'
            : str.length === 1
                ? '0' + str
                : str;
        result += str;
    }
    return result;
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

	async attestClaim(claim) {
/*		console.log('attestClaim');

		console.log('claimbeforeattesting', claim);

		const gasFee = '500';
		const gasLimit = '20000';

		const result = await claim.attest(socketUrl, gasFee, gasLimit, adminAddress, adminPrivateKey);
		console.log('attestClaim result', result);
//		txhash "00fbe7b186c9fef8861c9d5ce83a53fc9a0f82b82aaa94c55fc054bc08c021af";

		const contract = '36bb5c053b6b839c8f6b923fe852f91239b9fccc';
		const proof = await Merkle.constructMerkleProof(restUrl, result.Result.TxHash, contract);
		console.log('claim before modifying proof', claim);
		claim.proof = proof;
		console.log('proof', proof);

		console.log('111 claim', claim);
		const signed = claim.serialize();
		console.log('111 signed', signed);
		const msg = Claim.deserialize(signed);
		console.log('111 msg', msg);

		console.log('verifyClaimAttested msg', msg);
//		const result = await msg.verify(restUrl, true);
//		const result = await msg.getStatus(restUrl);
//		console.log('verifyClaimAttested result', result);

//		this.verifyClaim(msg);
//		this.verifyClaimAttested(msg);

//		console.log('signed', signed);
//		console.log('result', result);
//		console.log('claim', claim);*/
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
//		var message = JSON.stringify(claim);
		const result = await this.issueOntIdClaim(claim);

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
		claim['Credential Name'] = this.state.certName;
		claim['Recipient'] = this.state.certRecipient;
		claim['Description'] = this.state.certDescription;

		this.setState({'claim': claim});
//		alert('A claim was submitted: ' + JSON.stringify(claim));

		this.issueClaim(this.state.sender, this.state.recipient, claim);
	}

	render() {
//		if(!this.state.name){return (<div>Loading</div>)}

		return (
			<div>
			<h3>Issue Certificates</h3>
			<p>You are {this.state.name}</p>

			<div><button onClick={this.addAttribute}>Add Attribute</button></div>

			<div><button onClick={this.issueOntIdClaim}>Issue ONT ID Claim</button></div>

			<form onSubmit={this.handleSubmit}>

				<div className="form-group">
					<label>Crediential Name:</label>
					<div>
						<textarea name="certName" value={this.state.certName} onChange={this.handleChange} required/>
					</div>
				</div>

				<div className="form-group">
					<label>Recipient:</label>
					<div>
						<textarea name="certRecipient" value={this.state.certRecipient} onChange={this.handleChange} required/>
					</div>
				</div>

				<div className="form-group">
					<label>Description:</label>
					<div>
						<textarea name="certFor" value={this.state.certDescription} onChange={this.handleChange} required/>
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
