import React from "react";
import '../App.css';

import { Claim } from 'ontology-ts-sdk';

import { getAccount, getIdentity, testBlockchain,
	testSignature } from '../utils/ontology';

export default class Certificate extends React.Component {
	constructor(props) {
    super(props);

		this.state = {
			'account': '',
			'identity': '',
			'claimDeserialized': '',
			'claimSerialized': this.props.certificate.certificate,
			'certificateType': this.props.certificate.type,
			'testBlockchain': '',
			'testSignature': ''
    };
		this.verifyClaim = this.verifyClaim.bind(this);

  }

	async componentDidMount() {
		this.setState({
			account: await getAccount(),
			identity: await getIdentity()
		});
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

		const testBlockchainResult = await testBlockchain(this.state.claimSerialized);
		if (testBlockchainResult === true) {
	    this.setState({testBlockchain: 'passed'});
		} else {
	    this.setState({testBlockchain: 'failed'});
	  }

		const testSignatureResult = await testSignature(this.state.claimSerialized);
		if (testSignatureResult === true) {
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
				var certContents = Object.keys(claim.content).map(function(key, index) {
					return (<div key={index} id={key}><span className="font-weight-bold">{key}</span> {JSON.stringify(claim.content[key])}</div>)
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

						{claim.metadata.issuer === this.state.identity && (
							<div><span className="font-weight-bold">Issued By You</span></div>
						)}

						{claim.content['Recipient ONT ID'] === this.state.identity && (
							<div><span className="font-weight-bold">Issued To You</span></div>
						)}

						<div><span className="font-weight-bold">Stored</span> {certificateType} </div>

						<div><span className="font-weight-bold">Issuer</span> {claim.metadata.issuer} </div>
						<div><span className="font-weight-bold">Subject</span> {claim.metadata.subject} </div>
						<div><span className="font-weight-bold">Issued On</span> {issuedAt.toUTCString()} </div>

						{certContents}

		  			<button onClick={() => this.verifyClaim()}>Verify Certificate</button>
						{this.state.testBlockchain !== '' && (
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
