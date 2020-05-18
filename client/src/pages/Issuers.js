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
							{profiles.map(profile => (
								<div class="card m-4">
									<div class="card-text">Name: {profile.fields.name}</div>
									<div>Email: {profile.fields.email}</div>
									<div>Account: {profile.fields.account}</div>
									<div>Logo: <img src={profile.fields.image[0].url} alt="profile" width="250px"/></div>
						    </div>
              ))}
        </div>
      </div>
			<h6><i>Interested in becoming a verified issuer? Ask in the #development channel of the <a href="https://discord.com/invite/4TQujHj" target="_blank">Ontology Discord</a>.</i></h6>
			</div>
		);
}
}
