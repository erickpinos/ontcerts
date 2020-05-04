import React from "react";
import '../App.css';

import { Claim } from 'ontology-ts-sdk';

import { getAccount, getIdentity, testBlockchain,
	testSignature } from '../utils/ontology';

import { getIssuerByAccount } from '../utils/airtable';

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
			'testSignature': '',
			'issuerName': ''
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

			const issuer = await getIssuerByAccount(this.state.claimDeserialized.metadata.issuer);

			this.setState({
				issuerName: issuer.fields.name
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

		const testSignatureResult = await testSignature(this.state.claimSerialized, this.state.claimDeserialized.metadata.issuer);
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

			console.log('issuer', claim.metadata.issuer);

			return (
		    <div className="row justify-content-center">
		  		<div className="col-lg-6 col-10">
		  			<div className="card">
		  			<div className="card-body text-left">

						{claim.metadata.issuer === this.state.identity && (
							<div><span className="font-weight-bold">Issued By You</span></div>
						)}

						{claim.metadata.subject === this.state.identity && (
							<div><span className="font-weight-bold">Issued To You</span></div>
						)}

						<div><span className="font-weight-bold">Stored</span> {certificateType} </div>
						<div><span className="font-weight-bold">Claim ID</span> {claim.metadata.messageId} </div>
						<div><span className="font-weight-bold">Issuer</span> {claim.metadata.issuer} </div>
						<div><span className="font-weight-bold">Issuer Name</span> {this.state.issuerName} </div>
						<div><span className="font-weight-bold">Subject</span> {claim.metadata.subject} </div>
						<div><span className="font-weight-bold">Issued On</span> {issuedAt.toUTCString()} </div>

						{certContents}

		  			<button onClick={() => this.verifyClaim()}>Verify Certificate</button>
						{this.state.testBlockchain !== '' && (
							<React.Fragment>
			          <p>Blockchain test: {this.state.testBlockchain}</p>
			          <p>Signature test: {this.state.testSignature}</p>
								{this.state.testSignature === 'testing' && (
									<p>Testing if this certificate has a valid signature from {claim.metadata.issuer} </p>
								)}
								{this.state.testSignature === 'failed' && (
									<p>This certificate did not come from {claim.metadata.issuer} or it has been tampered with.</p>
								)}
								{this.state.testSignature === 'passed' && (
									<p>This certificate came from {claim.metadata.issuer} and has not been tampered with.</p>
								)}
							</React.Fragment>
						)}
		  			</div>
		  			</div>
		  		</div>
		  	</div>
		  );
		} catch(e) {
			console.log('Certificate render error', e);
			return (<div>Invalid Certificate</div>);
		}
	}
}
