import React from 'react';
import '../App.css';

import { AirtableOntCerts } from '../utils/airtable';

import { client } from 'ontology-dapi';

import { issueClaim } from '../utils/ontology';

client.registerClient({});

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
			certInstitutionName: 'BEN',
			certSubject: 'Erick Pinos',
			certCourseName: 'ERC20 Token',
			certFinalGrade: 'Pass',
			profiles: ''
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
		const account = await client.api.asset.getAccount();
		this.setState({sender: account});
	}

	async getIssuerName() {
		const account = await client.api.asset.getAccount();
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
		const identity = await client.api.identity.getIdentity();
		this.setState({identity: identity});
	}

	async issueClaim(claim) {

		const result = await issueClaim(claim);
		console.log('issueClaim result', result);

		this.addClaimToAirtable(result);

		this.setState({serializedJSON: result});
	}

	async addClaimToAirtable(claimSerialized) {
	  await AirtableOntCerts('Claims').create([
	    {
				fields: {'claim': claimSerialized}
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
		claimContent['Institution Name'] = this.state.certInstitutionName;
		claimContent['Recipient ONT ID'] = this.state.certSubject;
		claimContent['Course Name'] = this.state.certCourseName;
		claimContent['Final Grade'] = this.state.certFinalGrade;

		this.issueClaim(claimContent);
	}

	render() {
//		if(!this.state.name){return (<div>Loading</div>)}

		// Types
		return (
			<div>
			<h3>Issue Certificates</h3>
			<p>Issuing a Certificate Costs 0.01 ONG</p>
			<p>You are {this.state.name}</p>

			<form onSubmit={this.handleSubmit}>

			<div className="form-group">
				<div className="form-group">
					<label>Institution Name:</label>
					<div>
						<textarea name="certInstitutionName" value={this.state.certInstitutionName} onChange={this.handleChange} required/>
					</div>
				</div>

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

		{ (this.state.serializedJSON !== '') && (
			<div className="row justify-content-center">
				<div className="col-12" style={{wordWrap: 'break-word'}}>
					<h3>Resulting Serialized JSON</h3>
					<code>
							{this.state.serializedJSON}
					</code>
					<p>Save this serialized JSON somewhere safe. Your credential will be lost without it.</p>
				</div>
			</div>
			)
		}
			</div>
		);
	}
}
