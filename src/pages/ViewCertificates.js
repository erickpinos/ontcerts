import React from 'react';
import '../App.css';

import { Claim } from 'ontology-ts-sdk';

import Certificate from '../components/Certificate.js';

import { getAccount, getIdentity } from '../utils/ontology';

export default class ViewCertificates extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			claims: [],
			account: '',
			identity: '',
			provider: ''
		};
	}

	getAirtableClaims() {

		const base = 'https://api.airtable.com/v0/app9EPqqBKTlihZgU/Claims?api_key=';
    const apiKey = process.env.REACT_APP_AIRTABLE_API_KEY;

    fetch(base + apiKey)
    .then((resp) => resp.json())
    .then(data => {
			console.log('getAirtableClaims data', data);

			var claims = [];

			for (let i = 0; i < data.records.length; i++) {
				var claimSerialized = data.records[i].fields['claim'];
				console.log('getAirtableClaims claimSerialized', claimSerialized);

				const claim = Claim.deserialize(claimSerialized);
				console.log('getAirtableClaims claim', claim);

				// check if claim belongs to this address
				console.log('getAirtableClaims this.state.identity', this.state.identity);
				console.log('getAirtableClaims claim.metadata.issuer', claim.metadata.issuer);
				console.log('getAirtableClaims claim.metadata.subject', claim.metadata.subject);

				if (claim.metadata.subject === this.state.identity || claim.metadata.issuer === this.state.identity) {
					claims.push({'type': 'Online', 'certificate': claimSerialized});
				}
			}

			console.log('getAirtableClaims claims', claims);
	    this.setState({ claims: claims });

	   }).catch(err => {
	   	console.log(err);
	   });
	}

	async componentDidMount() {
		console.log('mount');
		this.getAirtableClaims();
/*		this.setState ({
			account: await getAccount(),
			identity: await getIdentity()
		});*/
		this.setState ({
			account: await getAccount(),
			identity: await getIdentity()
		});
		console.log('testViewCertificates');
	}

	render() {

		console.log('render claims', this.state.claims, 'length', this.state.claims.length);

		return(
			<div>
			<div className="row">
			<div className="col">
      <h3>View Certificates</h3>
			<p>ONTcerts v1. This type of certificate is an ONT ID claim issued by and to a custodian ONT ID address. Thus, the 'Issuer' and 'Subject' addresses are the same.
			The recipient of this particular type of certificate is designated from within the claim contents, not from the Subject field.</p>
			</div>
			</div>

			<div className='certificates'>

				{this.state.claims && (
					<React.Fragment>
						{this.state.claims.map((currElement, index) => <Certificate key={index} certificate={currElement} />)}
					</React.Fragment>
				)}

			</div>

			</div>
		);
	}
}
