import React from 'react';
import '../App.css';

import { AirtableOntCerts } from '../utils/airtable';

import { issueClaimTS, issueClaimDapi, signMessage, getTxHash } from '../utils/ontology';

import { getAccount, getIdentity } from '../utils/ontology';

export default class IssueCertificate extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			account: '',
			identity: '',
			sender: '',
			subject: '',
			signature: '',
			json: '',
			name: '',
			serializedJSON: '',
			certInstitutionName: 'Blockchain Education Network',
			certSubject: 'did:ont:AeXrnQ7jvo3HbSPgiThkgJ7ifPQkzXhtpL',
			certCourseName: 'Set Up ONT ID',
			certFinalGrade: 'Pass',
			profiles: '',
			submitted: '',
			payerPrivateKey: 'Kx6uDnwAdhKdcaTPi81Rac1MzpD4QbKTJxt7xSVCmXuEjoHtPeS8',
			issuerPrivateKey: 'Kx6uDnwAdhKdcaTPi81Rac1MzpD4QbKTJxt7xSVCmXuEjoHtPeS8',
			txLink: '',
			txHash: ''
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);

		this.issueClaim = this.issueClaim.bind(this);

	}

	componentDidMount() {
		this.getAccount();
		this.getIssuerName();
		this.getIdentity();

			const base = 'https://api.airtable.com/v0/app9EPqqBKTlihZgU/Issuers?api_key=';
			const apiKey = process.env.REACT_APP_AIRTABLE_API_KEY;

			fetch(base + apiKey)
			.then((resp) => resp.json())
			.then(data => {
				console.log('getAirtableIssuers data', data);

				this.setState({profiles: data.records});

			 }).catch(err => {
				console.log(err);
			 });
	}

	async getAccount() {
		const account = await getAccount();
		this.setState({sender: account});
	}

	async getIssuerName() {
		const account = await getAccount();
		console.log('account', account);

		const profiles = this.state.profiles;

		for (let i = 0; i < profiles.length; i++) {
			if (profiles[i].fields['account'] === this.state.sender) {
				this.setState({
					name: profiles[i].fields.name,
				});
			}
		}
	}

	async getIdentity() {
		const identity = await getIdentity();
		this.setState({identity: identity});
	}

	async issueClaim(claim) {

		this.setState({submitted: 'yes'});

		const subject = this.state.certSubject;

		const result = await issueClaimDapi(claim, subject, this.state.issuerPrivateKey);
		console.log('issueClaim result', result);


		const txHash = result[1];

		const txLink = 'https://explorer.ont.io/transaction/' + txHash + '/testnet';

		this.setState({
			txHash: txHash,
			txLink: txLink
		});

		console.log('pre-airtable result[0]', result[0]);
		console.log('pre-airtable txLink', txLink);

		this.addClaimToAirtable(result[0], txLink);

		this.setState({serializedJSON: result[0]});
		this.setState({submitted: 'done'});
	}

	async addClaimToAirtable(claimSerialized, txLink) {
		console.log('airtable claimSerialized', claimSerialized);
		console.log('airtable txLink', txLink);

	  await AirtableOntCerts('Claims').create([
	    {
				fields: {
					'claim': claimSerialized,
					'txLink': txLink
				}
	    }
	  ], function(err, records) {
	    if (err) {
	      console.error(err);
	      return;
	    }
	    records.forEach(function (record) {
	      console.log('addClaimToAirtable record.getId() = ', record.getId());
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
		var claimContent = {};
//		claimContent['Institution Name'] = this.state.certInstitutionName;
//		claimContent['Recipient ONT ID'] = this.state.certSubject;
		claimContent['Course Name'] = this.state.certCourseName;
		claimContent['Final Grade'] = this.state.certFinalGrade;

		this.issueClaim(claimContent);
	}

	render() {
//		if(!this.state.name){return (<div>Loading</div>)}

		// Types
		return (
			<div>

			<div className="row justify-content-center">
				<h3>Issue Certificate</h3>
			</div>

			<div className="row justify-content-center text-left">
				<div className="col-md-8">
					<div>
						<p>Read the <a href="/getting-started">Getting Started</a> guide to get set up to issue certificates on the Ontology blockchain.</p>
						<p>Issuing aN ONT ID certificate costs 0.01 ONG.</p>
						<p>Certificates issued through this website are public and stored on the cloud.</p>
						<p><i>Coming soon: ONT ID deep dives and video tutorials.</i></p>
{/*						<p>Step 1: <a href="https://chrome.google.com/webstore/detail/cyano-wallet/dkdedlpgdmmkkfjabffeganieamfklkm" target="_blank">Install Cyano Wallet</a></p>
						<p>Step 2: Create an asset address through Cyano Wallet.</p>
						<p>Step 3: Get some <a href="https://developer.ont.io/">testnet ONT & ONG</a> from this faucet.</p>
						<p>Step 4: Create an ONT ID address through Cyano Wallet.</p>
						<p>Step 4: Export Your ONT ID address private key and import it as an asset address.</p>
						<p>Step 5: Get some <a href="https://developer.ont.io/">testnet ONT & ONG</a> for your new asset address</p>
						<p>Step 6: Make sure your asset address and ONT ID address are set to the same address.</p>
						<p>Step 7: Issue a certificate below.</p>
						<p>Issuing a certificate costs 0.05 testnet ONG.</p>
*/}

					</div>
				</div>
			</div>

			{ (this.state.submitted === '') && (

			<form onSubmit={this.handleSubmit}>

			<div className="form-group">
{/*
				<div className="form-group">
					<label>Payer Private Key:</label>
					<div>
						<textarea name="payerPrivateKey" value={this.state.payerPrivateKey} onChange={this.handleChange} required/>
					</div>
				</div>

				<div className="form-group">
					<label>Issuer Private Key:</label>
					<div>
						<textarea name="issuerPrivateKey" value={this.state.issuerPrivateKey} onChange={this.handleChange} required/>
					</div>
				</div>
*/}
{/*
				<div className="form-group">
					<label>Institution Name:</label>
					<div>
						<textarea name="certInstitutionName" value={this.state.certInstitutionName} onChange={this.handleChange} required/>
					</div>
				</div>
*/}
				<label>Recipient ONT ID:</label>
					<div>
						<textarea name="certSubject" value={this.state.certSubject} onChange={this.handleChange} required/>
					</div>
				</div>

				<div className="form-group">
					<label>Course Name:</label>
					<div>
						<textarea name="certCourseName" value={this.state.certCourseName} onChange={this.handleChange} required/>
					</div>
				</div>

				<div className="form-group">
					<label>Final Grade:</label>
					<div>
						<textarea name="certFinalGrade" value={this.state.certFinalGrade} onChange={this.handleChange} required/>
					</div>
				</div>

				<div className="form-group">
					<input type="submit" value="Submit" />
				</div>
		</form>
	)
}

		{ (this.state.submitted === 'yes') && (
			<div className="row justify-content-center">
				<p>Submitting, please wait</p>
			</div>
		)
	}

	{ (this.state.submitted === 'done') && (
		<div className="row justify-content-center">
			<div>Submitted. View & verify your certificate in the 'View Certificates' tab.</div>
			<div><a href={this.state.txLink} target="blank">View Transaction on the Ontology Block Explorer</a></div>
			<div>Tx Hash: {this.state.txHash}</div>
		</div>
	)
}

		{ (this.state.serializedJSON !== '') && (
			<div className="row justify-content-center">
				<div className="col-12" style={{wordWrap: 'break-word'}}>
					<h3>Resulting Serialized JSON</h3>
					<code>
							{this.state.serializedJSON}
					</code>
				</div>
			</div>
			)
		}
			</div>
		);
	}
}
