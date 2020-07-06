const { RestClient, DDO, OntidContract, Crypto, TransactionBuilder, WebsocketClient, Identity, Account } = require('ontology-ts-sdk');

// ONT Node URL Info
//const restUrl = 'http://polaris1.ont.io:20334';
const restUrl = 'http://dappnode1.ont.io:20334';
const socketUrl = 'http://dappnode1.ont.io:20335';

async function getDDO(identity) {

//  const ontId = extractOntId(publicKeyId);
//  const ontId = 'did:ont:AdNdcyA2PJm8JXLSJA6pj4gNQ7h81sPmV1';
//  const ontId = 'did:ont:AYqzuwR3YjgLdo5FvGyQJCvZotFZHCk2jr';
//  const client = new RestClient(restUrl);
  const client = new WebsocketClient(socketUrl);
  console.log('identity', identity);
//  const testIdentity = 'did:ont:TA9aErH6znXRqwr1B7EzCtaiHPEGWNizzX';
  const identity2 = 'did:ont:ALzd1Fy2dxJfK5Ak554oAWpyUTZNsduw8Q';
  const tx = OntidContract.buildGetDDOTx(identity2);
  console.log('tx', tx);
  const response = await client.sendRawTransaction(tx.serialize(), true);
  console.log('response', response);
  if (response.Result && response.Result.Result) {
      const ddo = DDO.deserialize(response.Result.Result);

      if (ddo === undefined) {
          throw new Error('Not found');
      }

      console.log(ddo);
      return ddo;
  } else {
      throw new Error('Not found');
  }

}

async function regIdWithAttributes(attributes) {

		const privateKeyOfIdentity = Crypto.PrivateKey.random();
//	 	var privateKeyOfIdentity = new Crypto.PrivateKey('09eb1b1782676e17a98561eb54513097487186219acb0cf57150f6929d4cddaf');
		console.log('registerOntId privateKeyOfIdentity', privateKeyOfIdentity);

		var passwordOfIdentity = 'password';
		var labelOfIdentity = 'MyIdentity';

		var identity = Identity.create(privateKeyOfIdentity, passwordOfIdentity, labelOfIdentity);
		console.log('registerOntId identity', identity);

		var publicKeyOfIdentity = privateKeyOfIdentity.getPublicKey();
		console.log('registerOntId publicKeyOfIdentity', publicKeyOfIdentity);

//		const privateKeyOfAccount = Crypto.PrivateKey.random();
//	 	var privateKeyOfAccount = new Crypto.PrivateKey('8b25062b2303d820a1bec22a02ff8bb4b9cd961f5a0c4e700eeb8ab1734119f1');
	 	var privateKeyOfAccount = new Crypto.PrivateKey('461bad843146d51bb50b3e89419d2fd068c19c513383909a43a357f282c16db7');
    var publicKeyOfAccount = privateKeyOfAccount.getPublicKey();
    var addressOfAccount = Crypto.Address.fromPubKey(publicKeyOfAccount);

		console.log('registerOntId privateKeyOfAccount', privateKeyOfAccount);

		var passwordOfAccount = 'password'
		var labelOfAccount = 'MyAccount'

		var account = Account.create(privateKeyOfAccount, passwordOfAccount, labelOfAccount)
		console.log('registerOntId account', account);

		var gasPrice = '500';
		var gasLimit = '20000';

		var tx = OntidContract.buildRegIdWithAttributesTx(identity.ontid, attributes, publicKeyOfIdentity, gasPrice, gasLimit, addressOfAccount);

		console.log('registerOntId tx buildRegisterOntidTx', tx);

		console.log('registerOntId tx signTransaction', tx);

		var address = new Crypto.Address('AYqzuwR3YjgLdo5FvGyQJCvZotFZHCk2jr');
		tx.payer = address;
		TransactionBuilder.signTransaction(tx, privateKeyOfAccount);

		console.log('registerOntId tx.payer', tx.payer);

		TransactionBuilder.addSign(tx, privateKeyOfIdentity);
		console.log('registerOntId tx addSign', tx);

		var rest = new RestClient(restUrl);
		console.log('registerOntId rest', rest);

		rest.sendRawTransaction(tx.serialize()).then(res => {
			console.log('registerOntId res', res)
		})
}

async function getAttributes(identity) {
//  const client = new RestClient(restUrl);
  const client = new WebsocketClient(socketUrl);
  console.log('identity', identity);
  const tx = OntidContract.buildGetAttributesTx(identity);
  console.log('tx', tx);
  const response = await client.sendRawTransaction(tx.serialize(), true);
  console.log('response', response);
  return response;
}

async function getDocument(identity) {

//  const ontId = extractOntId(publicKeyId);
//  const ontId = 'did:ont:AdNdcyA2PJm8JXLSJA6pj4gNQ7h81sPmV1';
//  const ontId = 'did:ont:AYqzuwR3YjgLdo5FvGyQJCvZotFZHCk2jr';
  const client = new RestClient(restUrl);
  console.log('identity', identity);
  const tx = OntidContract.buildGetDocumentTx(identity);
  console.log('tx', tx);
  const response = await client.sendRawTransaction(tx.serialize(), true);
  console.log('response', response);
  return response;
}

async function addAttributes(identity, payerAddress, attributes) {

//  const privateKey1 = new Crypto.PrivateKey('7c47df9664e7db85c1308c080f398400cb24283f5d922e76b478b5429e821b95');
//  const pk1 = privateKey1.getPublicKey();
//  const address1 = Crypto.Address.fromPubKey(pk1);
//  const did1 = 'did:ont:' + address1.toBase58();
//  console.log('did1: ' + did1); // did:ont:ALaRqCkXSWaHMDc5sLEEMVMWqCNDFi5eRZ

//const pri4 = new Crypto.PrivateKey('461bad843146d51bb50b3e89419d2fd068c19c513383909a43a357f282c16db7');
//const pri4 = new Crypto.PrivateKey('0f0ba93e23c2e319fd4339fdfb685eb8b0ba929d1ce956d9b9155b27a0eb333f');

//  const pk4 = pri4.getPublicKey();
//  const pk4 = '02bae4e6607f0ac9c2f6493c506e5ae540242b20ac9ff4b7b1160a8e0849077a34';

//  const did4 = Crypto.Address.generateOntid(pk4);
//  const did4 = 'did:ont:ATdDuHfGsRGwWdF6MPUNyEduRMux7fZ1n8';
//  const address4 = Crypto.Address.fromPubKey(pk4);
//  const did4 = 'did:ont:' + address4.toBase58();

//  console.log('address4: ' + address4.toBase58());
// 5a98482e69657c43753c9f79ae59f845f8d423cddaa619aa9d0cabf815236930

  //		const privateKeyOfIdentity = Crypto.PrivateKey.random();
  	 	var privateKeyOfIdentity = new Crypto.PrivateKey('5a98482e69657c43753c9f79ae59f845f8d423cddaa619aa9d0cabf815236930');
//      var privateKeyOfIdentity = new Crypto.PrivateKey('461bad843146d51bb50b3e89419d2fd068c19c513383909a43a357f282c16db7');

  		console.log('addAttributes privateKeyOfIdentity', privateKeyOfIdentity);

  		var passwordOfIdentity = 'password';
  		var labelOfIdentity = 'MyIdentity';

  		var identity = Identity.create(privateKeyOfIdentity, passwordOfIdentity, labelOfIdentity);
  		console.log('addAttributes identity', identity);

  		var publicKeyOfIdentity = privateKeyOfIdentity.getPublicKey();
  		console.log('addAttributes publicKeyOfIdentity', publicKeyOfIdentity);

  //		const privateKeyOfAccount = Crypto.PrivateKey.random();
  //	 	var privateKeyOfAccount = new Crypto.PrivateKey('8b25062b2303d820a1bec22a02ff8bb4b9cd961f5a0c4e700eeb8ab1734119f1');
  	 	var privateKeyOfAccount = new Crypto.PrivateKey('461bad843146d51bb50b3e89419d2fd068c19c513383909a43a357f282c16db7');
    		var publicKeyOfAccount = privateKeyOfAccount.getPublicKey();
    var addressOfAccount = Crypto.Address.fromPubKey(publicKeyOfAccount);

  		console.log('addAttributes privateKeyOfAccount', privateKeyOfAccount);
      console.log('addAttributes publicKeyOfAccount', publicKeyOfAccount);

  		var passwordOfAccount = 'password'
  		var labelOfAccount = 'MyAccount'

  		var account = Account.create(privateKeyOfAccount, passwordOfAccount, labelOfAccount)
  		console.log('addAttributes account', account);

//  console.log('pri4', pri4);
//  console.log('pk4', pk4);
//  console.log('did4', did4);

  const payerPrivateKeyString = '461bad843146d51bb50b3e89419d2fd068c19c513383909a43a357f282c16db7';
  const privateKeyString = 'KwixVAuM4Ctjd7ppR2YoCppRbNxXJXsHAUogPWbGn52rJ1WEmHWF';

  const thisIdentity = 'did:ont:ATdDuHfGsRGwWdF6MPUNyEduRMux7fZ1n8';

//  const client = new RestClient(restUrl);
  const client = new WebsocketClient(socketUrl);

    const payerPrivateKey = new Crypto.PrivateKey(payerPrivateKeyString);
    const payerPublicKey = payerPrivateKey.getPublicKey();
    const thisPayerAddress = Crypto.Address.fromPubKey(payerPublicKey);

    // Attest claim
    var gasPrice = '500';
		var gasLimit = '20000';

    const privateKey = new Crypto.PrivateKey(privateKeyString);
    const publicKey = privateKey.getPublicKey();

//    const payer = 'KyZzUzuMxwErZkbGc3JXPSKe7Dn5CSYTigRt7QrirZcCEvPgG9KU';

    console.log('identity', thisIdentity);
    console.log('payerPrivateKey', payerPrivateKey);
    console.log('payerPublicKey', publicKey);

    console.log('thisPayerAddress', thisPayerAddress);

//    const tx = OntidContract.buildAddAttributeTx(identity, attributes, publicKey, gasPrice, gasLimit, thisPayerAddress);
//  console.log('thisone did4', did4);
  console.log('thisone2 identity', identity);
    const tx = OntidContract.buildAddAttributeTx(identity.ontid, attributes, publicKeyOfIdentity, gasPrice, gasLimit, addressOfAccount);

//    TransactionBuilder.signTransaction(tx, pri4);
  TransactionBuilder.signTransaction(tx, privateKeyOfAccount);
  TransactionBuilder.addSign(tx, privateKeyOfIdentity);

  console.log('tx', tx);
  console.log('tx.sigs', tx.sigs);

  const response = await client.sendRawTransaction(tx.serialize(), false);
  console.log('response', response);
  if (response.Result && response.Result.Result) {

    console.log(response.Result.Notify);
    return response;
  } else {
    throw new Error('Not found');
  }

}

async function registerOntId() {

//		const privateKeyOfIdentity = Crypto.PrivateKey.random();
	 	var privateKeyOfIdentity = new Crypto.PrivateKey('09eb1b1782676e17a98561eb54513097487186219acb0cf57150f6929d4cddaf');
		console.log('registerOntId privateKeyOfIdentity', privateKeyOfIdentity);

		var passwordOfIdentity = 'password';
		var labelOfIdentity = 'MyIdentity';

		var identity = Identity.create(privateKeyOfIdentity, passwordOfIdentity, labelOfIdentity);
		console.log('registerOntId identity', identity);

		var publicKeyOfIdentity = privateKeyOfIdentity.getPublicKey();
		console.log('registerOntId publicKeyOfIdentity', publicKeyOfIdentity);

//		const privateKeyOfAccount = Crypto.PrivateKey.random();
//	 	var privateKeyOfAccount = new Crypto.PrivateKey('8b25062b2303d820a1bec22a02ff8bb4b9cd961f5a0c4e700eeb8ab1734119f1');
	 	var privateKeyOfAccount = new Crypto.PrivateKey('461bad843146d51bb50b3e89419d2fd068c19c513383909a43a357f282c16db7');

		console.log('registerOntId privateKeyOfAccount', privateKeyOfAccount);

		var passwordOfAccount = 'password'
		var labelOfAccount = 'MyAccount'

		var account = Account.create(privateKeyOfAccount, passwordOfAccount, labelOfAccount)
		console.log('registerOntId account', account);

		var gasPrice = '500';
		var gasLimit = '20000';

		var tx = OntidContract.buildRegisterOntidTx(identity.ontid, publicKeyOfIdentity, gasPrice, gasLimit);
		console.log('registerOntId tx buildRegisterOntidTx', tx);

		console.log('registerOntId tx signTransaction', tx);

		var address = new Crypto.Address('AYqzuwR3YjgLdo5FvGyQJCvZotFZHCk2jr');
		tx.payer = address;
		TransactionBuilder.signTransaction(tx, privateKeyOfAccount);

		console.log('registerOntId tx.payer', tx.payer);

		TransactionBuilder.addSign(tx, privateKeyOfIdentity);
		console.log('registerOntId tx addSign', tx);

		var rest = new RestClient(restUrl);
		console.log('registerOntId rest', rest);

		rest.sendRawTransaction(tx.serialize()).then(res => {
			console.log('registerOntId res', res)
		})
}

async function removeAttribute() {
  const socketUrl = 'http://dappnode1.ont.io:20335';

  var privateKeyOfIdentity = new Crypto.PrivateKey('5a98482e69657c43753c9f79ae59f845f8d423cddaa619aa9d0cabf815236930');
  console.log('removeAttribute privateKeyOfIdentity', privateKeyOfIdentity);
  var publicKeyOfIdentity = privateKeyOfIdentity.getPublicKey();
  console.log('removeAttribute publicKeyOfIdentity', publicKeyOfIdentity);
  var passwordOfIdentity = 'password';
  var labelOfIdentity = 'MyIdentity';
  var identity = Identity.create(privateKeyOfIdentity, passwordOfIdentity, labelOfIdentity);
  console.log('removeAttribute identity', identity);

	var privateKeyOfAccount = new Crypto.PrivateKey('461bad843146d51bb50b3e89419d2fd068c19c513383909a43a357f282c16db7');
  console.log('removeAttribute privateKeyOfAccount', privateKeyOfAccount);
  var publicKeyOfAccount = privateKeyOfAccount.getPublicKey();
  console.log('removeAttribute publicKeyOfAccount', publicKeyOfAccount);
  var addressOfAccount = Crypto.Address.fromPubKey(publicKeyOfAccount);
	var passwordOfAccount = 'password'
	var labelOfAccount = 'MyAccount'
  var account = Account.create(privateKeyOfAccount, passwordOfAccount, labelOfAccount)
  console.log('removeAttribute account', account);

	var gasPrice = '500';
	var gasLimit = '20000';

  var key = 'Student';

  var tx = OntidContract.buildRemoveAttributeTx(identity.ontid, key, publicKeyOfIdentity, gasPrice, gasLimit, addressOfAccount);

  tx.payer = addressOfAccount;

  TransactionBuilder.signTransaction(tx, privateKeyOfAccount);
  TransactionBuilder.addSign(tx, privateKeyOfIdentity);

  console.log('tx', tx);
  console.log('tx.sigs', tx.sigs);

  const client = new WebsocketClient(socketUrl);
  const response = await client.sendRawTransaction(tx.serialize(), false);
  console.log('response', response);
  return response;
}

module.exports.getDDO = getDDO;
module.exports.getDocument = getDocument;
module.exports.registerOntId = registerOntId;
module.exports.regIdWithAttributes = regIdWithAttributes;
module.exports.getAttributes = getAttributes;
module.exports.addAttributes = addAttributes;
module.exports.removeAttribute = removeAttribute;
