import React from 'react';
import '../App.css';
import gettingStarted0 from '../images/getting-started-0.png'
import gettingStarted1 from '../images/getting-started-1.png'
import gettingStarted2 from '../images/getting-started-2.png'
import gettingStarted3 from '../images/getting-started-3.png'
import gettingStarted4 from '../images/getting-started-4.png'
import gettingStarted5 from '../images/getting-started-5.png'
import gettingStarted6 from '../images/getting-started-6.png'
import gettingStarted7 from '../images/getting-started-7.png'
import gettingStarted8 from '../images/getting-started-8.png'
import gettingStarted9 from '../images/getting-started-9.png'
import gettingStarted10 from '../images/getting-started-10.png'
import gettingStarted11 from '../images/getting-started-11.png'
import gettingStarted12 from '../images/getting-started-12.png'
import gettingStarted13 from '../images/getting-started-13.png'
import gettingStarted14 from '../images/getting-started-14.png'
import gettingStarted15 from '../images/getting-started-15.png'
import gettingStarted16 from '../images/getting-started-16.png'
import gettingStarted17 from '../images/getting-started-17.png'
import gettingStarted18 from '../images/getting-started-18.png'
import gettingStarted19 from '../images/getting-started-19.png'

export default class GettingStarted extends React.Component {

		constructor(props) {
			super(props);
			this.state = {
			};
		}

		componentDidMount() {

		}

		render() {

		return (
			<div className="Getting Started">
	      <div className="row">
	        <div className="col justify-content-left text-left">
						<h6><i>Getting stuck? Ask for help in the #development channel of the <a href="https://discord.com/invite/4TQujHj" target="_blank">Ontology Discord</a>.</i></h6>
						<div class="p-4"></div>

						<h5>Step 0: <a href="https://chrome.google.com/webstore/detail/cyano-wallet/dkdedlpgdmmkkfjabffeganieamfklkm" target="_blank">Install Cyano Wallet</a></h5>
						<img src={gettingStarted0} width="100%"/>
						<div class="p-4"></div>

						<h5>Step 1: Create a new account.</h5>
						<img src={gettingStarted1} width="100%"/>
						<div class="p-4"></div>

						<h5>Step 2: Make a password and save.</h5>
						<img src={gettingStarted2} width="100%"/>
						<div class="p-4"></div>

						<h5>Step 3: Copy down your mnemonic phrase and private key somewhere safe where it can't be seen by others!.</h5>
						<img src={gettingStarted3} width="100%"/>
						<div class="p-4"></div>

						<h5>Step 4: Go to settings</h5>
						<img src={gettingStarted4} width="100%"/>
						<div class="p-4"></div>

						<h5>Step 5: Switch Net to "Test-Net" and Node address to "polaris1.ont.io".</h5>
						<img src={gettingStarted5} width="100%"/>
						<div class="p-4"></div>

						<h5>Step 6: Go to <a>developer.ont.io</a> and apply for free testnet ONT&ONG.</h5>
						<img src={gettingStarted6} width="100%"/>
						<div class="p-4"></div>

						<h5>Step 7: Enter your wallet address. Your application should be processed almost immediately.</h5>
						<img src={gettingStarted7} width="100%"/>
						<div class="p-4"></div>

						<h5>Step 8: Back in Cyano Wallet, go to the Identity tab.</h5>
						<img src={gettingStarted8} width="100%"/>
						<div class="p-4"></div>

						<h5>Step 9: Select "New Identity"</h5>
						<img src={gettingStarted9} width="100%"/>
						<div class="p-4"></div>

						<h5>Step 10: Make a password and save.</h5>
						<img src={gettingStarted10} width="100%"/>
						<div class="p-4"></div>

						<h5>Step 11: This is a separate mnemonic phrase and private key specifically for your ONT ID. Save it somewhere safe. You will need the private key for the next step.</h5>
						<img src={gettingStarted11} width="100%"/>
						<div class="p-4"></div>

						<h5>Step 12: Go back to Accounts.</h5>
						<img src={gettingStarted12} width="100%"/>
						<div class="p-4"></div>

						<h5>Step 13: Go to the "Switch Accounts" tab.</h5>
						<img src={gettingStarted13} width="100%"/>
						<div class="p-4"></div>

						<h5>Step 14: Add a new Account.</h5>
						<img src={gettingStarted14} width="100%"/>
						<div class="p-4"></div>

						<h5>Step 15: Select Import Private Key.</h5>
						<img src={gettingStarted15} width="100%"/>
						<div class="p-4"></div>

						<h5>Step 16: Enter the private key from your ONT ID address you saved in Step 11. Make a password and save the account.</h5>
						<img src={gettingStarted16} width="100%"/>
						<div class="p-4"></div>

						<h5>Step 17: Enter the private key from your ONT ID address you saved in Step 11.</h5>
						<img src={gettingStarted17} width="100%"/>
						<div class="p-4"></div>

						<h5>Step 18: Go back to <a>developer.ont.io</a> and apply for free testnet ONT&ONG for the second address.</h5>
						<img src={gettingStarted6} width="100%"/>
						<div class="p-4"></div>

						<h5>Step 19: Make sure your address has ONT & ONG and that your Connected Wallet and Connected DID are both the same.</h5>
						<img src={gettingStarted19} width="100%"/>
						<div class="p-4"></div>

						<h5>Step 20: You are now ready to <a href="/issue-certificate">issue an ONT certificate here.</a></h5>
						<div class="p-4"></div>

	        </div>
	      </div>
			</div>
		);
	}
}
