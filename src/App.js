import React from 'react';
import logo from './logo.svg';
import './App.css';

import { client } from 'ontology-dapi';

client.registerClient({});

var issuers = {
	'03f631f975560afc7bf47902064838826ec67794ddcdbcc6f0a9c7b91fc8502583': 'BEN',
	'03a5ad912c8f7df57f5528f4067b8f5b69e371097e43d9acb9325a2dbc0578373e': 'MIT'
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    }

    this.onSignMessage = this.onSignMessage.bind(this);

  }

  async onGetPublicKey() {
    const account = await client.api.asset.getPublicKey();
    console.log('onGetPublicKey: ' + JSON.stringify(account));
    console.log(account);
    console.log(JSON.stringify(account));
		var issuer = issuers[account];
    console.log('the issuer is', issuer);
    this.setState({name: issuer});
    console.log('this.state.name', this.state.name);

//    alert('onGetPublicKey: ' + JSON.stringify(account));
  }

  componentDidMount() {

    this.onGetPublicKey();

//		doAsyncStuff().then((res)=>{this.setState({promiseIsResolved: true})})
  }

  async onSignMessage() {

    const message = 'Test';

		try {
		const result = await client.api.message.signMessage({ message });
	//		tslint:disable-next-line:no-console
			var issuer = issuers[result.publicKey];
			console.log('message signed by ' + issuer);
			console.log('signature:', result);
			console.log('save this signature', result.data);
//			alert('onSignMessage finished, signature:' + result.data);
		} catch (e) {
			alert('onSignMessage canceled');
	//		tslint:disable-next-line:no-console
			console.log('onSignMessage error:', e);
		}
	}

  render() {
//		if (typeof this.state.name !== 'undefined') {
//			console.log("this.state.name: ", this.state.name);
//		} else {
//			console.log("this.state.name: Not Pulled Yet");
//		}

//		var test = this.state.name;

	  if(!this.state.name){return null}

		return (
			<div className="App">
				<header className="App-header" style={{ minHeight: '50vh'}}>
					<img src={logo} className="App-logo" alt="logo" />
					<p className="App-link">ONTcerts</p>
				</header>
				<h3>Issuers</h3>
				<table style={{margin: '0 auto'}}>
				  <thead>
						<tr>
							<th>Issuer</th>
							<th>Public Key</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>BEN</td>
							<td>03f631f975560afc7bf47902064838826ec67794ddcdbcc6f0a9c7b91fc8502583</td>
						</tr>
						<tr>
							<td>MIT</td>
							<td>03a5ad912c8f7df57f5528f4067b8f5b69e371097e43d9acb9325a2dbc0578373e</td>
						</tr>
					</tbody>
				</table>
				<h3>View Certificates</h3>
				<p>You are {this.state.name}</p>
				<button onClick={this.onSignMessage}>Click Me</button>
			</div>
		);
	}
}

export default App;
