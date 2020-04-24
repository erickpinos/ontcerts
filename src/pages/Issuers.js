import React from 'react';
import '../App.css';

import { client } from 'ontology-dapi';

var profiles = require('../data/profiles.js');

client.registerClient({});

export default function Issuers() {

		if(!profiles){return (<div>Loading</div>)}

		console.log(profiles);
		return (
			<div className="Issuers">
      <div className="row">
        <div className="col">
          <h3>Profiles</h3>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <table style={{margin: '0 auto'}}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
								<th>Account</th>
								<th>Public Key</th>
								<th>Image</th>
	            </tr>
            </thead>
            <tbody>
							{profiles.map(profile => (
								<tr>
									<td>{profile.name}</td>
									<td>{profile.email}</td>
									<td>{profile.account}</td>
									<td>{profile.publicKey}</td>
									<td><img src={profile.image} alt="profile" width="100px"/></td>
						    </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
			</div>
		);
}
