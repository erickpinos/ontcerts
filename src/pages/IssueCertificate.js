import React from 'react';
import '../App.css';

import { client } from 'ontology-dapi';

import { Account, Identity, Crypto, Claim, OntidContract, TransactionBuilder,
	RestClient, CONST, Wallet, OntAssetTxBuilder, WebsocketClient, RevocationType } from 'ontology-ts-sdk';

var profiles = require('../data/profiles.js');

client.registerClient({});

export default class IssueCertificate extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			account: '',
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
		this.createAccount = this.createAccount.bind(this);
		this.sendTransaction = this.sendTransaction.bind(this);

	}

	componentDidMount() {
		this.getAccount();
		this.getIssuerName();

//		this.issueClaim2();
//	this.viewClaim();
//		this.viewClaim();
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

	async getBalance() {
		const address = new Crypto.Address('ATRTKMGPyFZ19XyKmN8yATsHtv5AKpcCZa');

//		const rest = new RestClient();
//		rest.getBalance(address).then(res => {
//			console.log(res)
//		})

//		const node = 'ws://polaris1.ont.io';
		const node = 'ws://127.0.0.1';

		const WS_PORT = '20335';
		const url = `${node}:${WS_PORT}`;
	  const client = new WebsocketClient(url, false, false);
		client.getBalance(address).then(res => {
			console.log(res)
		})
	}

	async createAccount() {
		var wallet = Wallet.create('MyWallet');
		console.log('createAccount wallet', wallet);

//		var privateKey = Crypto.PrivateKey.random();
		var privateKey = new Crypto.PrivateKey('8b25062b2303d820a1bec22a02ff8bb4b9cd961f5a0c4e700eeb8ab1734119f1');
		var password = 'password';
		var label = 'MyAccount';

		var account = Account.create( privateKey, password, label );
		console.log('createAccount account', account);

		wallet.addAccount(account)
		console.log('createAccount wallet addAccount', wallet);

		this.setState({
			account: account
		});

	}

	async sendTransaction() {

//		const from = this.state.account.address;
		const from = new Crypto.Address('AYQ8aSzJSm7VPCLRe3rPNp1VF3Yo2K1kMe');

		const to = new Crypto.Address('ATRTKMGPyFZ19XyKmN8yATsHtv5AKpcCZa')

		const amount = 1;

		const assetType = 'ONG';

		const gasPrice = '500';
		const gasLimit = '20000';

		const payer = from;
		const tx = OntAssetTxBuilder.makeTransferTx(assetType, from, to, amount, gasPrice, gasLimit, payer);
		console.log('sendTransaction tx makeTransferTx', tx);

//		const rest = new RestClient(CONST.TEST_ONT_URL.REST_URL);
//		console.log('sendTransaction rest', rest);

//		rest.sendRawTransaction(tx.serialize()).then(res => {
//			console.log(res)
//		})

//			const node = 'ws://polaris1.ont.io';
			const node = 'ws://127.0.0.1';

			const WS_PORT = '20335';
			const url = `${node}:${WS_PORT}`;
			const client = new WebsocketClient(url, false, false);
			client.sendRawTransaction(tx.serialize()).then(res => {
				console.log(res)
			})
	}

	async registerOntId() {

//		const privateKeyOfIdentity = Crypto.PrivateKey.random();
	 	var privateKeyOfIdentity = new Crypto.PrivateKey('09eb1b1782676e17a98561eb54513097487186219acb0cf57150f6929d4cddaf');
		console.log('registerOntId privateKeyOfIdentity', privateKeyOfIdentity);

		var passwordOfIdentity = 'password';
		var labelOfIdentity = 'MyIdentity';

		var identity = Identity.create(privateKeyOfIdentity, passwordOfIdentity, labelOfIdentity);
		console.log('registerOntId identity', identity);

		var publicKeyOfIdentity = privateKeyOfIdentity.getPublicKey();
		console.log('registerOntId publicKeyOfIdentity', publicKeyOfIdentity);

//		const privateKeyOfAccount = Crypto.PrivateKey.random();
	 	var privateKeyOfAccount = new Crypto.PrivateKey('8b25062b2303d820a1bec22a02ff8bb4b9cd961f5a0c4e700eeb8ab1734119f1');
		console.log('registerOntId privateKeyOfAccount', privateKeyOfAccount);

		var passwordOfAccount = 'password'
		var labelOfAccount = 'MyAccount'

		var account = Account.create(privateKeyOfAccount, passwordOfAccount, labelOfAccount)
		console.log('registerOntId account', account);

		var gasPrice = '500';
		var gasLimit = '20000';

		var tx = OntidContract.buildRegisterOntidTx(identity.ontid, publicKeyOfIdentity, gasPrice, gasLimit);
		console.log('registerOntId tx buildRegisterOntidTx', tx);

		console.log('registerOntId tx signTransaction', tx);

		var address = new Crypto.Address('AYQ8aSzJSm7VPCLRe3rPNp1VF3Yo2K1kMe');
		tx.payer = address;
		TransactionBuilder.signTransaction(tx, privateKeyOfAccount);

		console.log('registerOntId tx.payer', tx.payer);

		TransactionBuilder.addSign(tx, privateKeyOfIdentity);
		console.log('registerOntId tx addSign', tx);

		var rest = new RestClient(CONST.TEST_ONT_URL.REST_URL);
		console.log('registerOntId rest', rest);

		rest.sendRawTransaction(tx.serialize()).then(res => {
			console.log('registerOntId res', res)
		})
}

	async attestClaim() {

  	const restUrl = 'http://polaris1.ont.io:20334';
		const socketUrl = 'ws://polaris1.ont.io:20335';

		const privateKey = Crypto.PrivateKey.random();
		const publicKey = privateKey.getPublicKey();
    const account = Account.create(privateKey, '123456', '');
    const identity = Identity.create(privateKey, '123456', '');
    const ontid =  identity.ontid;
    const address = account.address;
    const publicKeyId = ontid + '#keys-1';

    const adminPrivateKey = new Crypto.PrivateKey('7c47df9664e7db85c1308c080f398400cb24283f5d922e76b478b5429e821b97');
    const adminAddress = new Crypto.Address('AdLUBSSHUuFaak9j169hiamXUmPuCTnaRz');

		let serialized: string;
		let signed: string;
//		const ontid = 'did:ont:AN88DMMBZr5X9ChpMHX3LqRvQHqGxk2c3r';
//		const publicKeyId = ontid + '#keys-1';

	// Register ONT ID

		const tx = OntidContract.buildRegisterOntidTx(ontid, publicKey, '500', '30000');
		tx.payer = adminAddress;
		TransactionBuilder.signTransaction(tx, adminPrivateKey);
		TransactionBuilder.addSign(tx, privateKey);

		var client2 = new RestClient(CONST.TEST_ONT_URL.REST_URL);
		await client2.sendRawTransaction(tx.serialize(), false, true);

		client2.sendRawTransaction(tx.serialize()).then(res => {
			console.log('registerOntId res', res)
		})

		// Sign claim
		const signature = null;
		const useProof = false;

		console.log('1');
		const claim = new Claim({
		    messageId: '1',
		    issuer: ontid,
		    subject: ontid,
		    issueAt: 1525800823
		}, signature, useProof);
		claim.version = '0.7.0';
		claim.context = 'https://example.com/template/v1';
		claim.content = {
		    Name: 'Bob Dylan',
		    Age: '22',
		};

		console.log('2');
		var result = await claim.sign(restUrl, publicKeyId, privateKey);
		console.log('result');

		signed = claim.serialize();

		console.log('claim.signature', claim.signature);

		// verify claim
		const msg = Claim.deserialize(signed);
		const verifyClaimResult = await msg.verify(restUrl, false);
		console.log('verify claim result', verifyClaimResult);

		const verifyClaimMissingAttest = await msg.verify(restUrl, true);
		console.log('verify claim missing attest', verifyClaimMissingAttest);

		const res = await claim.attest(socketUrl, '500', '20000', adminAddress, adminPrivateKey);
		console.log(res);

		const signed2 = claim.serialize();

		const msg2 = Claim.deserialize(signed2);
		const result2 = await msg2.verify(restUrl, false);

		console.log('verify claim attest', result2);
		// attest claims
//		const socketUrl = 'ws://polaris1.ont.io:20335';
//		const restUrl = 'http://polaris1.ont.io:20334';
//		const payer = account.address;


//		const gasPrice = '500';
//		const gasLimit = '20000';
//		const privateKeyOfAccount = new Crypto.PrivateKey('4a8d6d61060998cf83acef4d6e7976d538b16ddeaa59a96752a4a7c0f7ec4860');

//		const payer = new Crypto.Address('ANTPrAEzLK7mnVNKUTTp7MQTnbD7evr8W6');

//		await claim.sign(restUrl, publicKeyId, privateKeyOfAccount);

//		const adminPrivateKey = new Crypto.PrivateKey('7c47df9664e7db85c1308c080f398400cb24283f5d922e76b478b5429e821b97');
//    const adminAddress = new Crypto.Address('AdLUBSSHUuFaak9j169hiamXUmPuCTnaRz');

//		const signed = claim.serialize();

//		const msg = Claim.deserialize(signed);
//		const result = await msg.verify(restUrl, false);

//		console.log('signed', signed);
//		console.log('result', result);
//		console.log('claim', claim);

//		const res = await claim.attest(socketUrl, gasPrice, gasLimit, adminAddress, adminPrivateKey);

	}

	async viewDDO() {

		const result = await client.api.identity.getIdentity();
    const ddo = await client.api.identity.getDDO({identity : result});
		console.log('identity', result);
		console.log('viewDDO', ddo);

	}

	async verifyClaim() {

		const signature = null;
		const useProof = false;
		const claim = new Claim({
		    messageId: '1',
		    issuer: 'did:ont:AJTMXN8LQEFv3yg8cYKWGWPbkz9KEB36EM',
		    subject: 'did:ont:AUEKhXNsoAT27HJwwqFGbpRy8QLHUMBMPz',
		    issueAt: 1525800823
		}, signature, useProof);

		claim.version = '0.7.0';
		claim.context = 'https://example.com/template/v1';
		claim.content = {
		    Name: 'Alice',
		    Age: '22',
		};

//		const url = 'http://polaris1.ont.io:20335';
//		const result = await claim.getStatus(url);

		const restUrl = 'http://polaris1.ont.io:20334'
		const result = await claim.getStatus(restUrl);
		console.log(result);
//		const url = 'http://127.0.0.1:20334';
//		const result = await claim.getStatus(url);
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

		// Issue claim by message signing
		var message = JSON.stringify(claim);
		const result = await this.signMessage(message);

    console.log('issueClaim result', result);
		console.log('issueClaim data', result.data);
		console.log('issueCLaim publicKey', result.publicKey);

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
//		this.issueClaim(this.state.sender, this.state.recipient, claim);

		this.issueClaim(this.state.sender, this.state.recipient,claim);
	}

	render() {
//		if(!this.state.name){return (<div>Loading</div>)}

		return (
			<div>
			<h3>Issue Certificates</h3>
			<p>You are {this.state.name}</p>

			<div><button onClick={this.getBalance}>Get Balance</button></div>

			<div><button onClick={this.createAccount}>Create Account</button></div>

			<div><button onClick={this.sendTransaction}>Send Transaction</button></div>

			<div><button onClick={this.registerOntId}>Register New ONT ID</button></div>

			<div><button onClick={this.attestClaim}>Attest Claim</button></div>

			<div><button onClick={this.verifyClaim}>Verify Claim</button></div>

			<div><button>Non ONT ID Academic Credential</button></div>

			<div><button>ONT ID Academic Credential</button></div>

			{/* Non ONT ID Academic Credential*/}
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
