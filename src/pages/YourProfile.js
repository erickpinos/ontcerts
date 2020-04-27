import React from 'react';
import '../App.css';

import { getAccount } from '../utils/ontology';

export default class YourProfile extends React.Component {
	constructor(props) {
		super(props);

    this.state = {
			name: '',
			account: '',
			publicKey: '',
			email: '',
			image: '',
			profiles: ''
		}

	}

	componentDidMount() {

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

		 this.getProfile();

	}

	async getProfile() {

		const profiles = this.state.profiles;

		try {
		    const res = await getAccount();
		    console.log(res)
				console.log('account', res);
	  		this.setState({account: res});

				for (let i = 0; i < profiles.length; i++) {
	  				if (profiles[i]['fields']['account'] === res) {
	  					this.setState({
	  						name: profiles[i].fields.name,
	  						email: profiles[i].fields.email,
								publicKey: profiles[i].fields.publicKey,
	  						image: profiles[i].fields.image
	  					});
	  				}
	  		}

		} catch(err) {
		    console.log(err)
		}

  	}

    render() {

			const profiles = this.state.profiles;

      if(!profiles){return (<div>Loading</div>)}


		console.log(profiles);
		return (

      <div className="Profile">

        <div className="row">
          <div className="col-12">
            <h3>Your Profile</h3>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-md-4 text-left">
            <div><b>Name</b>: {this.state.name}</div>
            <div><b>Email</b>: {this.state.email}</div>
            <div><b>Account</b>: {this.state.account}</div>
            <div><b>Public Key</b>: {this.state.publicKey}</div>
            <div><b>Image</b>: <img width="150px" src={this.state.image} alt="profile"/></div>
          </div>
        </div>

      </div>

		);
	}
}
