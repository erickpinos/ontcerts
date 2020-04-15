import React from 'react';
import '../App.css';

import { client } from 'ontology-dapi';

var profiles = require('../data/profiles.js');

client.registerClient({});

export default class YourProfile extends React.Component {
	constructor(props) {
		super(props);

    this.state = {
			name: '',
			account: '',
			publicKey: '',
			email: '',
			image: ''
		}

	}

	async getProfile() {

      const account = await client.api.asset.getAccount();
      console.log('account', account);
  		this.setState({account: account});

  		const publicKey = await client.api.asset.getPublicKey();
  		console.log('publicKey', publicKey);
  		this.setState({publicKey: publicKey});

  		for (let i = 0; i < profiles.length; i++) {
  				if (profiles[i]['account'] === account) {
  					this.setState({
  						name: profiles[i].name,
  						email: profiles[i].email,
  						image: profiles[i].image
  					});
  				}
  		}

  	}

  	componentDidMount() {

  		this.getProfile();

  	}

    render() {

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
            <div><b>Image</b>: <img width="150px" src={this.state.image}/></div>
          </div>
        </div>

      </div>

		);
	}
}
