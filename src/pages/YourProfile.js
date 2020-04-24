import React from 'react';
import '../App.css';

import { client } from 'ontology-dapi';

import { getAccount } from '../utils/ontology';

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

		try {
		    const res = await getAccount();
		    console.log(res)
				console.log('account', res);
	  		this.setState({account: res});

				for (let i = 0; i < profiles.length; i++) {
	  				if (profiles[i]['account'] === res) {
	  					this.setState({
	  						name: profiles[i].name,
	  						email: profiles[i].email,
								publicKey: profiles[i].publicKey,
	  						image: profiles[i].image
	  					});
	  				}
	  		}

		} catch(err) {
		    console.log(err)
		}
/*
		// If mobile
		const params = {
		    dappName: 'My dapp',
		    dappIcon: '' // some url points to the dapp icon
		}

		try {
		    const res = await client.api.asset.getAccount(params);
		    console.log(res.result)
				console.log('account', res.result);
	  		this.setState({account: res.result});

				for (let i = 0; i < profiles.length; i++) {
	  				if (profiles[i]['account'] === res.result) {
	  					this.setState({
	  						name: profiles[i].name,
	  						email: profiles[i].email,
	  						image: profiles[i].image
	  					});
	  				}
	  		}

		} catch(err) {
		    console.log(err)
		}

*/
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
            <div><b>Image</b>: <img width="150px" src={this.state.image} alt="profile"/></div>
          </div>
        </div>

      </div>

		);
	}
}
