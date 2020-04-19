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

  return (

    <div className="row justify-content-center">
  		<div className="col-lg-6 col-10">
  			<div className="card certcertificates">
  			<div className="card-body">
  				<img className="cert-logo" src={benLogo} />
  				<h3 className="cert-type">{this.props.certificate['claim']['certType']}</h3>
  				<p className="cert-intro">{this.props.certificate['claim']['certIntro']}</p>
  				<h4 className="cert-recipient">{this.props.certificate['claim']['certRecipient']}</h4>
  				<p className="cert-for">{this.props.certificate['claim']['certFor']}</p>
  				<h4 className="cert-topic">{this.props.certificate['claim']['certTopic']}</h4>
  				<p className="cert-date">{this.props.certificate['claim']['certDate']}</p>
  				<p className="cert-spacer"></p>
  				<h4 className="cert-sign-sig">{this.props.certificate['claim']['certSignSig']}</h4>
  				<p className="cert-sign-name">{this.props.certificate['claim']['certSignName']}</p>
  				<p className="cert-sign-title">{this.props.certificate['claim']['certSignTitle']}</p>
  			<button onClick={() => this.onVerifyMessage(JSON.stringify(this.props.certificate['claim']),this.props.certificate['signature']['publicKey'],this.props.certificate['signature']['data'])}>Verify Certificate</button>
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
