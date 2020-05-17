import React from "react";
import '../App.css';

import { Claim } from 'ontology-ts-sdk';

import { getAccount, getIdentity } from '../utils/ontology';

import { verify, verifyExpiration, verifyKeyOwnership, verifyNotRevoked,
	verifySignature, verifyMatchingClaimId, verifyAttestStatus } from '../utils/verify';

import { getIssuerByAccount } from '../utils/airtable';

export default class Certificate extends React.Component {
	constructor(props) {
    super(props);

		this.state = {
			'account': '',
			'identity': '',
			'claimSerialized': this.props.certificate.claimSerialized,
			'claim': this.props.certificate.certificate,
			'certificateType': this.props.certificate.type,
			'verify': '',
			'issuerName': '',
			'verifyExpiration': '',
			'verifyKeyOwnership': '',
			'verifyNotRevoked': '',
			'verifySignature': '',
			'verifyMatchingClaimId': '',
			'verifyAttestStatus': ''
    };
		this.verifyClaim = this.verifyClaim.bind(this);

  }

	async componentDidMount() {
		this.setState({
			account: await getAccount(),
			identity: await getIdentity()
		});
		try {
			const issuer = await getIssuerByAccount(this.state.claim.metadata.issuer);

			this.setState({
				issuerName: issuer.fields.name
			});
		} catch(e) {
			console.log(e);
		}
	}

	async verifyClaim() {
		this.setState({
	    verify: 'testing',
	  });

		const verifyResult = await verify(this.state.claimSerialized, this.state.claim.metadata.issuer);
		if (verifyResult === true) {
	    this.setState({verify: 'passed'});
		} else {
	    this.setState({verify: 'failed'});
	  }

		this.setState({verifyExpiration: JSON.stringify(await verifyExpiration(this.state.claimSerialized))});
		this.setState({verifyKeyOwnership: JSON.stringify(await verifyKeyOwnership(this.state.claimSerialized))});
		this.setState({verifyNotRevoked: JSON.stringify(await verifyNotRevoked(this.state.claimSerialized))});
		this.setState({verifySignature: JSON.stringify(await verifySignature(this.state.claimSerialized))});
		this.setState({verifyMatchingClaimId: JSON.stringify(await verifyMatchingClaimId(this.state.claimSerialized))});
		this.setState({verifyAttestStatus: JSON.stringify(await verifyAttestStatus(this.state.claimSerialized))});
	}

  render() {

		try {
			const claim = this.state.claim;
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
						{this.state.verify !== '' && (
							<React.Fragment>
								<p>verifyExpiration: {this.state.verifyExpiration}</p>
								<p>verifyKeyOwnership: {this.state.verifyKeyOwnership}</p>
								<p>verifyNotRevoked: {this.state.verifyNotRevoked}</p>
								<p>verifySignature: {this.state.verifySignature}</p>
								<p>verifyMatchingClaimId: {this.state.verifyMatchingClaimId}</p>
								<p>verifyAttestStatus: {this.state.verifyAttestStatus}</p>
								<p>Verification Status: {this.state.verify}</p>
								{this.state.verify === 'testing' && (
									<p>Testing if this certificate has a valid signature from {claim.metadata.issuer} </p>
								)}
								{this.state.verify === 'failed' && (
									<p>This certificate did not come from {claim.metadata.issuer} or it has been tampered with.</p>
								)}
								{this.state.verify === 'passed' && (
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
