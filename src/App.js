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

    console.log('onSignMessage');

    fetch('./files/test.txt')
		.then((r) => r.text())
		.then((data) =>{
			console.log(data);
			this.state.message = data;
	    this.setState({message: data});
			this.signMessage(data);
		})

	}

	async signMessage(message) {
		console.log(message);
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

  async onVerifyMessage() {
    const message = 'This certificate is issued to Erick Pinos on 3/1/20 for completing Blockchain 101';
    const data = '011293104ae3051f2ecb291fc4a6bebcea86f999b8b7efcdf4cb0c01446d7574557876607412ee8afe8bcdbfa8f68bc0fecb776f9a9ff499be6c7024b2f4901fc3';
    const publicKey = await client.api.asset.getPublicKey();

    const signature: Signature = {
      data,
      publicKey
    };

    try {
      const result = await client.api.message.verifyMessage({ message, signature });
      alert('onVerifyMessage finished, result:' + result);
    } catch (e) {
      alert('onVerifyMessage canceled');
      // tslint:disable-next-line:no-console
      console.log('onVerifyMessage error:', e);
    }
  }

  render() {
//		if (typeof this.state.name !== 'undefined') {
//			console.log("this.state.name: ", this.state.name);
//		} else {
//			console.log("this.state.name: Not Pulled Yet");
//		}

//		var test = this.state.name;

	  if(!this.state.name){return (<div>Switch to an Issuer wallet</div>)}

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
				<h3>Issue Certificates</h3>
				<p>You are {this.state.name}</p>
				<button onClick={this.onSignMessage}>Click Me</button>
				<h3>Verify Certificates</h3>
				<button onClick={this.onVerifyMessage}>Click Me</button>
			</div>
		);
	}
}

export default App;
