import React from "react";
import '../App.css';

import { Claim } from 'ontology-ts-sdk';

import {Nav, Tab, ProgressBar, ListGroup} from 'react-bootstrap';

import { getAccount, getIdentity } from '../utils/ontology';

import { verify, verifyExpiration, verifyKeyOwnership, verifyNotRevoked,
	verifySignature, verifyMatchingClaimId, verifyAttestStatus } from '../utils/verify';

import { getIssuerByAccount } from '../utils/airtable';

import degreeIcon from '../images/degree-icon.png';

export default class Certificate extends React.Component {
	constructor(props) {
    super(props);

		this.state = {
			'account': '',
			'v1': '',
			'v2': '',
			'v3': '',
			'v4': '',
			'v5': '',
			'v6': '',
			'progress': 0,
			'progressVariant': 'success',
			'progressAnimation': true,
			'key': 'basic',
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
			'verifyAttestStatus': '',
			'txLink': this.props.certificate.txLink
    };
		this.verifyClaim = this.verifyClaim.bind(this);
   this.handleSelect = this.handleSelect.bind(this);
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

	handleSelect(key) {
//    alert('selected ' + key);
    this.setState({ key });
		if (key === 'verify') {
			this.verifyClaim();
		}
	}

	async verifyClaim() {
		this.setState({
	    verify: 'testing',
			progress: 5,
			progressVariant: 'success',
			progressAnimation: true,
			v1: 'font-weight-bold',
			v2: '',
			v3: '',
			v4: '',
			v5: '',
			v6: '',
			verifyExpiration: '',
			verifyKeyOwnership: '',
			verifyNotRevoked: '',
			verifySignature: '',
			verifyMatchingClaimId: '',
			verifyAttestStatus: ''
	  });

		const verifyExpirationResult = await verifyExpiration(this.state.claimSerialized)
		if (verifyExpirationResult === true) {
			this.setState({
				verifyExpiration: JSON.stringify(verifyExpirationResult),
				progress: 20,
				v1: '',
				v2: 'font-weight-bold',
				v3: '',
				v4: '',
				v5: '',
				v6: ''
			})
		};
		if (verifyExpirationResult === false) {
			this.setState({
				verifyExpiration: 'false',
				progress: 5,
				progressVariant: 'danger',
				progressAnimation: false,
				verify: 'failed'
			})
			return;
		};

		const verifyKeyOwnershipResult = await verifyKeyOwnership(this.state.claimSerialized)
		if (verifyKeyOwnershipResult === true) {
			this.setState({
				verifyKeyOwnership: JSON.stringify(verifyKeyOwnershipResult),
				progress: 30,
				v1: '',
				v2: '',
				v3: 'font-weight-bold',
				v4: '',
				v5: '',
				v6: ''
			})
		};
		if (verifyKeyOwnershipResult === false) {
			this.setState({
				verifyKeyOwnership: 'false',
				progress: 20,
				progressVariant: 'danger',
				progressAnimation: false,
				verify: 'failed'
			})
			return;
		};

		const verifyNotRevokedResult = await verifyNotRevoked(this.state.claimSerialized)
		if (verifyNotRevokedResult === true) {
			this.setState({
				verifyNotRevoked: JSON.stringify(verifyNotRevokedResult),
				progress: 40,
				v1: '',
				v2: '',
				v3: '',
				v4: 'font-weight-bold',
				v5: '',
				v6: ''
			})
		};
		if (verifyNotRevokedResult === false) {
			this.setState({
				verifyNotRevoked: 'false',
				progress: 30,
				progressVariant: 'danger',
				progressAnimation: false,
				verify: 'failed'
			})
			return;
		};

		const verifySignatureResult = await verifySignature(this.state.claimSerialized)
		if (verifySignatureResult === true) {
			this.setState({
				verifySignature: JSON.stringify(verifySignatureResult),
				progress: 60,
				v1: '',
				v2: '',
				v3: '',
				v4: '',
				v5: 'font-weight-bold',
				v6: ''
			})
		};
		if (verifySignatureResult === false) {
			this.setState({
				verifySignature: 'false',
				progress: 40,
				progressVariant: 'danger',
				progressAnimation: false,
				verify: 'failed'
			})
			return;
		};


		const verifyMatchingClaimIdResult = await verifyMatchingClaimId(this.state.claimSerialized)
		if (verifyMatchingClaimIdResult === true) {
			this.setState({
				verifyMatchingClaimId: JSON.stringify(verifyMatchingClaimIdResult),
				progress: 80,
				v1: '',
				v2: '',
				v3: '',
				v4: '',
				v5: '',
				v6: 'font-weight-bold'
			})
		};
		if (verifyMatchingClaimIdResult === false) {
			this.setState({
				verifyMatchingClaimId: 'false',
				progress: 60,
				progressVariant: 'danger',
				progressAnimation: false,
				verify: 'failed'
			})
			return;
		};

		const verifyAttestStatusResult = await verifyAttestStatus(this.state.claimSerialized)
		if (verifyAttestStatusResult === true) {
			this.setState({
				verifyAttestStatus: JSON.stringify(verifyAttestStatusResult),
				progress: 100,
				v1: '',
				v2: '',
				v3: '',
				v4: '',
				v5: '',
				v6: ''
			})
		};
		if (verifyAttestStatusResult === false) {
			this.setState({
				verifyAttestStatus: 'false',
				progress: 80,
				progressVariant: 'danger',
				progressAnimation: false,
				verify: 'failed'
			})
			return;
		};

		this.setState({
			progressAnimation: false,
			verify: 'passed'
		})
{/*
		const verifyResult = await verify(this.state.claimSerialized, this.state.claim.metadata.issuer);
		if (verifyResult === true) {
	    this.setState({verify: 'passed'});
		} else {
	    this.setState({verify: 'failed'});
	  }
*/}

	}

  render() {

		try {
			const claim = this.state.claim;
	    const certificateType = this.state.certificateType;

			try {
				var certContents = Object.keys(claim.content).map(function(key, index) {
					return (<li className="list-group-item" key={index} id={key}><span className="font-weight-bold">{key}</span> {JSON.stringify(claim.content[key])}</li>)
				});
			} catch(e) {
				console.log(e);
			}

			var issuedAt = new Date(claim.metadata.issuedAt);

			var date = issuedAt.toUTCString();

			date = new Date(date); //will convert to present timestamp offset
			date = new Date(date.getTime() + (date.getTimezoneOffset() * 60 * 1000));
			console.log(date);

			console.log('issuer', claim.metadata.issuer);

			return (

<div className="row justify-content-center">

	<div className="col-lg-8 col-12">

		<div className="card m-3">

			<Tab.Container id="certificate-tabs" defaultActiveKey={this.state.key} onSelect={this.handleSelect}>

				<div className="card-header">
	      	<Nav variant="tabs">
						<Nav.Item>
					  	<Nav.Link eventKey="basic">Basic</Nav.Link>
					  </Nav.Item>
					  <Nav.Item>
					  	<Nav.Link eventKey="more">More</Nav.Link>
					  </Nav.Item>
						<Nav.Item>
					  	<Nav.Link eventKey="verify">Verify</Nav.Link>
					  </Nav.Item>
					</Nav>
				</div>

				<div className="card-body">
					<Tab.Content>

	        	<Tab.Pane eventKey="basic">
							<div class="row justify-content-center no-gutters">

								<div class="col-3 justify-content-center">
									<img src={degreeIcon} class="card-img p-md-3" />
								</div>

								<div class="col-md-9">
									<div className="text-left">
										<ul class="list-group list-group-flush">
											{certContents}
											<li class="list-group-item"><span className="font-weight-bold">Issuer</span> {claim.metadata.issuer}</li>
											<li class="list-group-item"><span className="font-weight-bold">Subject</span> {claim.metadata.subject}</li>
											<li class="list-group-item"><span className="font-weight-bold">Issued On</span> {issuedAt.toLocaleString('en-US', { timeZone: 'America/New_York', timeZoneName: "short"})}</li>
										</ul>
									</div>
								</div>

							</div>
		        </Tab.Pane>

		        <Tab.Pane eventKey="more">
							<div className="text-left">
							<ul class="list-group list-group-flush">
								<li class="list-group-item"><pre>{JSON.stringify(claim, null, 2)}</pre></li>
							</ul>
							</div>
	        	</Tab.Pane>

						<Tab.Pane eventKey="verify">
							<div className="text-left">
							{this.state.verify !== '' && (
								<React.Fragment>
									{this.state.verify === 'testing' && (
										<h3 class="alert alert-primary" role="alert">Running Tests...</h3>
									)}
									{this.state.verify === 'failed' && (
										<h3 class="alert alert-danger" role="alert">Tests Failed</h3>
									)}
										{this.state.verify === 'passed' && (
										<h3 class="alert alert-success" role="alert">Tests Passed</h3>
									)}

									<ProgressBar variant={this.state.progressVariant} animated={this.state.progressAnimation} now={this.state.progress} />

									<ListGroup>
										<ListGroup.Item><span className={this.state.v1}>verifyExpiration:</span> {this.state.verifyExpiration}</ListGroup.Item>
										<ListGroup.Item><span className={this.state.v2}>verifyKeyOwnership:</span> {this.state.verifyKeyOwnership}</ListGroup.Item>
										<ListGroup.Item><span className={this.state.v3}>verifyNotRevoked:</span> {this.state.verifyNotRevoked}</ListGroup.Item>
										<ListGroup.Item><span className={this.state.v4}>verifySignature:</span> {this.state.verifySignature}</ListGroup.Item>
										<ListGroup.Item><span className={this.state.v5}>verifyMatchingClaimId:</span> {this.state.verifyMatchingClaimId}</ListGroup.Item>
										<ListGroup.Item><span className={this.state.v6}>verifyAttestStatus:</span> {this.state.verifyAttestStatus}</ListGroup.Item>
									</ListGroup>

									{this.state.verify === 'testing' && (
										<p className='m-3'>Testing if this certificate has a valid signature from {claim.metadata.issuer} </p>
									)}
									{this.state.verify === 'failed' && (
										<p className='m-3'>This certificate did not come from {claim.metadata.issuer} or it has been tampered with.</p>
									)}
										{this.state.verify === 'passed' && (
										<p className='m-3'>This certificate came from {claim.metadata.issuer} and has not been tampered with.</p>
									)}
										</React.Fragment>
									)}
								</div>
							</Tab.Pane>

			      </Tab.Content>
					</div>

				</Tab.Container>
				<div class="card-footer text-muted">
					{this.state.txLink && (
			    	<a href={this.state.txLink} target="_blank">View on ONT Block Explorer</a>
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
