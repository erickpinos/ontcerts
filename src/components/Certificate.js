import React from "react";
import '../App.css';

import { client } from 'ontology-dapi';
import { Claim, Crypto } from 'ontology-ts-sdk';

import { str2hexstr } from '../../src/utils/utils.js';

var profiles = require('../data/profiles.js');

const restUrl = 'http://polaris1.ont.io:20334';

export default class Certificate extends React.Component {
	constructor(props) {
    super(props);

		this.state = {
			'claimDeserialized': '',
			'claimSerialized': this.props.certificate.certificate,
			'certificateType': this.props.certificate.type,
			'testBlockchain': '',
			'testSignature': ''
    };
		this.verifyClaim = this.verifyClaim.bind(this);

  }
	componentDidMount() {
		try {
			this.setState({
				'claimDeserialized': Claim.deserialize(this.state.claimSerialized)
			});
		} catch(e) {
			console.log(e);
		}
	}

	async verifyClaim() {

		this.setState({
			testBlockchain: 'testing',
			testSignature: 'testing'
		});

		const claim = this.state.claimDeserialized;

		// Test 1: Test if the claim is stored on the blockchain.
		const testBlockchainResult = await claim.verify(restUrl, true);
		console.log('verifyClaim testBlockchainResult', testBlockchainResult);
		if (testBlockchainResult == true) {
			this.setState({testBlockchain: 'passed'});
		} else {
			this.setState({testBlockchain: 'failed'});
		}

		// Test 2: Test that the claim has a valid signature.
		const privateKey = new Crypto.PrivateKey('4a8d6d61060998cf83acef4d6e7976d538b16ddeaa59a96752a4a7c0f7ec4860');
		const pk = privateKey.getPublicKey();

		const strs = this.state.claimSerialized.split('.');

		const signData = str2hexstr(strs[0] + '.' + strs[1]);
		const testSignatureResult = pk.verify(signData, claim.signature);
		console.log('verifyClaim testSignatureResult', testSignatureResult);
		if (testSignatureResult == true) {
			this.setState({testSignature: 'passed'});
		} else {
			this.setState({testSignature: 'failed'});
		}
	}

  render() {

		try {
			const claim = this.state.claimDeserialized;
	    const certificateType = this.state.certificateType;


			try {
				var certContents = Object.keys(claim.content).map(function(key) {
					return (<div id={key}><span className="font-weight-bold">{key}</span> {JSON.stringify(claim.content[key])}</div>)
				});
			} catch(e) {
				console.log(e);
			}

			var issuedAt = new Date(claim.metadata.issuedAt);

			return (
		    <div className="row justify-content-center">
		  		<div className="col-lg-6 col-10">
		  			<div className="card">
		  			<div className="card-body text-left">

						<div key={certificateType}><span className="font-weight-bold">Type</span> {certificateType} </div>

						<div key={claim.metadata.issuer}><span className="font-weight-bold">Issuer</span> {claim.metadata.issuer} </div>
						<div key={issuedAt}><span className="font-weight-bold">Issued On</span> {issuedAt.toUTCString()} </div>

						{certContents}

		  			<button onClick={() => this.verifyClaim()}>Verify Certificate</button>
						{this.state.testBlockchain != '' && (
							<React.Fragment>
			          <p>Blockchain test: {this.state.testBlockchain}</p>
			          <p>Signature test: {this.state.testSignature}</p>
							</React.Fragment>
						)}
		  			</div>
		  			</div>
		  		</div>
		  	</div>
		  );
		} catch(e) {
			return (<div>Invalid Certificate</div>)
		}
	}
}
