import React from 'react';
import '../App.css';

import { client } from 'ontology-dapi';

import Certificate from '../components/Certificate.js';

var profiles = require('../data/profiles.js');

client.registerClient({});

export default class ViewCertificates extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			claims: [],
			publicKey: '',
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
				var claimJson = data.records[i].fields['claim'];
				console.log('getAirtableClaims claimJson', claimJson);
				if(this.isJsonString(claimJson)) {
					var claim = JSON.parse(claimJson);
					console.log('getAirtableClaims claim', claim);
					claims.push({'type': 'airtableCertificate', 'certificate': claim});
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

	componentDidMount() {
		this.getPublicKey();
//		this.getLocalCertificates();
		this.getAirtableClaims();
	}

	render() {

		console.log('render claims', this.state.claims, 'length', this.state.claims.length);

		return(
			<div>

      <h3>View Certificates</h3>

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
