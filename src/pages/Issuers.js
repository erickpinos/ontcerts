import React from 'react';
import '../App.css';

export default class Issuers extends React.Component {

		constructor(props) {
			super(props);
			this.state = {
				identity: ''
			};
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
		}

		render() {
			const profiles = this.state.profiles;
		if(!profiles){return (<div>Loading</div>)}

		console.log(profiles);

		return (
			<div className="Issuers">
      <div className="row">
        <div className="col">
          <h3>Verified Issuers</h3>
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
								<th>Image</th>
	            </tr>
            </thead>
            <tbody>
							{profiles.map(profile => (
								<tr>
									<td>{profile.fields.name}</td>
									<td>{profile.fields.email}</td>
									<td>{profile.fields.account}</td>
									<td><img src={profile.fields.image[0].url} alt="profile" width="100px"/></td>
						    </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
			</div>
		);
}
}
