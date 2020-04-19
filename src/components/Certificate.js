import React from "react";
import '../App.css';

import benLogo from '../images/ben-logo.png';

import { client } from 'ontology-dapi';

var profiles = require('../data/profiles.js');

export default class Certificate extends React.Component {
	constructor(props) {
    super(props);

		this.state = {
      'verified': 'unknown',
      'verifiedFrom': 'unknown'
    };

    this.onVerifyMessage = this.onVerifyMessage.bind(this);

  }

  async onVerifyMessage(message, publicKey, data) {

    console.log('onVerifyMessage started');
    console.log('message', message);
    console.log('data', data);
    console.log('publicKey', publicKey);

		const signature: Signature = {
			data,
			publicKey
		};

    console.log('signature', signature);

		try {
			const result = await client.api.message.verifyMessage({ message, signature });
//			alert('onVerifyMessage finished, result:' + result);
      console.log('onVerifyMessage finished');
      console.log('result', result);
			if (result == true) {
				this.setState({verified: 'no'});

        for (let i = 0; i < profiles.length; i++) {
	  				if (profiles[i]['publicKey'] === publicKey) {
              this.setState({
                verifiedFrom: profiles[i]['name']
              });
	  				}
	  		}

			} else if (result == false) {
        this.setState({verified: 'yes'});
        for (let i = 0; i < profiles.length; i++) {
	  				if (profiles[i]['publicKey'] === publicKey) {
              this.setState({
                verifiedFrom: profiles[i]['name']
              });
	  				}
	  		}
      }
		} catch (e) {
			alert('onVerifyMessage canceled');
			// tslint:disable-next-line:no-console
			console.log('onVerifyMessage error:', e);
		}
	}

  render() {

    const certificate = this.props.certificate;
		console.log('this.props.certificate', this.props.certificate);
//		console.log('this.props.certificate.certificate.Claim', certificate.certificate);

//		var deepClone = JSON.parse(JSON.stringify(certificate));

//  	var deepClone = JSON.parse(JSON.stringify(certificate.certificate.Claim));
//		console.log('this.props.certificate.certificate.Claim in json', JSON.parse(certificate.certificate.Claim));
//		console.log('this.props.', deepClone.certificate.Claim);

//		var obj = JSON.parse(deepClone.certificate.Claim);
//		console.log('this.props.2', obj);

//		var test = '{"metadata":{"messageId":"1","issuer":"did:ont:AdLUBSSHUuFaak9j169hiamXUmPuCTnaRz","subject":"did:ont:AdLUBSSHUuFaak9j169hiamXUmPuCTnaRz","issueAt":1525800823},"signature":{"algorithm":{"label":"SHA256withECDSA","hex":1,"labelJWS":"ES256"},"value":"e46febaec8dfa603144555148d574123ff535042364b72024f263b74ffa7f6751c1a28efceb2391aedbd1e5c55ec6229e5e9a7e2a5fe828340a678f1dff0e575","publicKeyId":"did:ont:AdLUBSSHUuFaak9j169hiamXUmPuCTnaRz#keys-1"},"useProof":false,"version":"0.7.0","context":"https://example.com/template/v1","content":{"Test":{"certType":"Certificate of Completion","certIntro":"This certificate is awarded to","certRecipient":"Erick Pinos","certFor":"for successfully completing the BEN lesson","certTopic":"Launch an ERC20 Token","certDate":"February 14, 2020","certSignSig":"Erick Pinos","certSignName":"Erick Pinos","certSignTitle":"President"}}}'


//		var testObj = JSON.parse(test);
//		console.log('this.props', testObj);

		try{
			var certContents = Object.keys(certificate.certificate.content).map(function(key) {
				return (<div id={key}><span className="font-weight-bold">{key}</span> {JSON.stringify(certificate.certificate.content[key])}</div>)
			});
		} catch(e) {
			console.log(e);
		}

/*
		if (!certificate.certificate['Claim'].metadata) {
			return ( null )
		}
*/

			var dateTime = new Date(certificate.certificate.metadata.issueAt);
			console.log(dateTime);

			return (
		    <div className="row justify-content-center">
		  		<div className="col-lg-6 col-10">
		  			<div className="card">
		  			<div className="card-body text-left">
{/*		  				<img className="cert-logo" src={benLogo} /> */}

						<div key={certificate.type}><span className="font-weight-bold">Type</span> {certificate.type} </div>

						<div key={certificate.certificate.metadata.issuer}><span className="font-weight-bold">Issuer</span> {certificate.certificate.metadata.issuer} </div>
						<div key={dateTime}><span className="font-weight-bold">Issued On</span> {dateTime.toUTCString()} </div>

						{certContents}

		  			<button onClick={() => this.onVerifyMessage(JSON.stringify(this.props.certificate.certificate['claim']),this.props.certificate.certificate['signature']['publicKey'],this.props.certificate['signature']['data'])}>Verify Certificate</button>
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


/* Full Certificate Format
<div className="row justify-content-center">
	<div className="col-lg-6 col-10">
		<div className="card certcertificates">
		<div className="card-body">
			<img className="cert-logo" src={benLogo} />
			<h3 className="cert-type">{this.props.certificate.certificate['claim']['certType']}</h3>
			<p className="cert-intro">{this.props.certificate.certificate['claim']['certIntro']}</p>
			<h4 className="cert-recipient">{this.props.certificate.certificate['claim']['certRecipient']}</h4>
			<p className="cert-for">{this.props.certificate.certificate['claim']['certFor']}</p>
			<h4 className="cert-topic">{this.props.certificate.certificate['claim']['certTopic']}</h4>
			<p className="cert-date">{this.props.certificate.certificate['claim']['certDate']}</p>
			<p className="cert-spacer"></p>
			<h4 className="cert-sign-sig">{this.props.certificate.certificate['claim']['certSignSig']}</h4>
			<p className="cert-sign-name">{this.props.certificate.certificate['claim']['certSignName']}</p>
			<p className="cert-sign-title">{this.props.certificate.certificate['claim']['certSignTitle']}</p>
		<button onClick={() => this.onVerifyMessage(JSON.stringify(this.props.certificate.certificate['claim']),this.props.certificate.certificate['signature']['publicKey'],this.props.certificate['signature']['data'])}>Verify Certificate</button>
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
*/
