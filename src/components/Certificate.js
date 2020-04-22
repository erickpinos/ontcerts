import React from "react";
import '../App.css';

import { client } from 'ontology-dapi';
import { Claim, Crypto } from 'ontology-ts-sdk';

var profiles = require('../data/profiles.js');

const restUrl = 'http://polaris1.ont.io:20334';

export default class Certificate extends React.Component {
	constructor(props) {
    super(props);

		this.state = {
			'claimSerialized': this.props.certificate.certificate,
			'claimDeserialized': Claim.deserialize(this.props.certificate.certificate),
      'verified': 'unknown',
			'testBlockchain': '',
			'testSignature': '',
      'verifiedFrom': 'unknown'
    };

		this.verifyClaim = this.verifyClaim.bind(this);

  }

	async verifyClaim(msg) {

		const claim = this.state.claimDeserialized;

		// Test 1: Test if the claim is stored on the blockchain.
		const testBlockchainResult = await claim.verify(restUrl, true);
		console.log('verifyClaim testBlockchainResult', testBlockchainResult);
		if (testBlockchainResult == true) {
			this.setState({testBlockchain: 'passed'});
		} else {
			this.setState({testBlockchain: 'failed'});
		}

		const privateKey = new Crypto.PrivateKey('4a8d6d61060998cf83acef4d6e7976d538b16ddeaa59a96752a4a7c0f7ec4860');
		const pk = privateKey.getPublicKey();

		const strs = this.state.claimSerialized.split('.');

		const signData = this.str2hexstr(strs[0] + '.' + strs[1]);
		const testSignatureResult = pk.verify(signData, claim.signature);
		console.log('verifyClaim testSignatureResult', testSignatureResult);
		if (testSignatureResult == true) {
			this.setState({testSignature: 'passed'});
		} else {
			this.setState({testSignature: 'failed'});
		}

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

  render() {

    const certificate = this.props.certificate;
		const deserializedMsg = Claim.deserialize(certificate.certificate);

		console.log('this.props.certificate', this.props.certificate);

		try{
			var certContents = Object.keys(deserializedMsg.content).map(function(key) {
				return (<div id={key}><span className="font-weight-bold">{key}</span> {JSON.stringify(deserializedMsg.content[key])}</div>)
			});
		} catch(e) {
			console.log(e);
		}

		console.log('ifthishasbeendeserialized', deserializedMsg);
			var dateTime = new Date(deserializedMsg.metadata.issueAt);
			console.log(dateTime);

			return (
		    <div className="row justify-content-center">
		  		<div className="col-lg-6 col-10">
		  			<div className="card">
		  			<div className="card-body text-left">

						<div key={certificate.type}><span className="font-weight-bold">Type</span> {certificate.type} </div>

						<div key={deserializedMsg.metadata.issuer}><span className="font-weight-bold">Issuer</span> {deserializedMsg.metadata.issuer} </div>
						<div key={dateTime}><span className="font-weight-bold">Issued On</span> {dateTime.toUTCString()} </div>

						{certContents}

		  			<button onClick={() => this.verifyClaim(this.props.certificate.certificate)}>Verify Certificate</button>
		  			{(this.state.verified != '') && (
		        <React.Fragment>
		          <p>Who claims to have issued this claim? {this.state.verifiedFrom}</p>
		          <p>Has this claim been tampered with? {this.state.verified}</p>
		        </React.Fragment>
		      )}
		  			</div>
		  			</div>
		  		</div>
		  	</div>
		  );
		}
	}
