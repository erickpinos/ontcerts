import React from 'react';
import '../App.css';

import { client } from 'ontology-dapi';
import { Claim } from 'ontology-ts-sdk';

import Certificate from '../components/Certificate.js';

import { getAccount, getIdentity } from '../utils/ontology';

client.registerClient({});

export default class ViewCertificates extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			claims: [],
			publicKey: '',
			account: '',
			identity: ''
		};
	}


	getLocalCertificates() {

		var certificates = this.state.certificates;

		for (let i = 0; i < 5; i++) {
			try {
				var certificate = require("../signed_certificates/certificate" + i + ".json");
				certificates.push({'type': 'localCertificate', 'certificate': certificate});
			} catch(e) {
				console.log(e);
			}
		}

		this.setState({
			claims: certificates
		});
	}

	isJsonString(str) {
	    try {
	        JSON.parse(str);
	    } catch (e) {
	        return false;
	    }
	    return true;
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
				console.log('getAirtableClaims claims.content["Recipient ONT ID"]', claim.content['Recipient ONT ID']);
				console.log('getAirtableClaims this.state.account', this.state.account);

				console.log('getAirtableClaims claims.metadata.issuer', claim.metadata.issuer);

				if (claim.content['Recipient ONT ID'] === this.state.account || claim.metadata.issuer === this.state.identity) {
					claims.push({'type': 'Online', 'certificate': claimSerialized});
				}
			}

			console.log('getAirtableClaims claims', claims);
	    this.setState({ claims: claims });

	   }).catch(err => {
	   	console.log(err);
	   });
	}

	async getPublicKey() {
		const publicKey = await client.api.asset.getPublicKey();
		console.log('the public key is', publicKey);
		this.setState({publicKey: publicKey});
	}

	async componentDidMount() {
		this.getPublicKey();
//		this.getLocalCertificates();
		this.getAirtableClaims();
		this.setState ({
			account: await getAccount(),
			identity: await getIdentity()
		});
	}

	render() {

		console.log('render claims', this.state.claims, 'length', this.state.claims.length);

		return(
			<div>

      <h3>View Certificates</h3>
			<p>OntCert v1. This type of claim is issued by and recieved by the same ONT ID address.
			The recipient ONT ID address is designated from within the claim contents, not from the 'subject' Address.
			Claims must be issued directly from within the ONTcerts app.</p>

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
