import { client } from 'ontology-dapi';
import { client as clientWeb } from 'ontology-dapi';
import { client as clientMobile } from 'cyanobridge';
import { Claim, Crypto, Merkle } from 'ontology-ts-sdk';
import { str2hexstr } from '../utils/utils';

const restUrl = 'http://polaris1.ont.io:20334';
const socketUrl = 'ws://polaris1.ont.io:20335';

//client.registerClient({});

export async function getProvider() {

  console.log('getProvider start');
  var result = '';

  try {
    clientWeb.registerClient({});

    const resultWeb = await clientWeb.api.provider.getProvider();
    console.log('getProvider resultWeb', resultWeb);
    result = resultWeb.name;
  } catch(e) {
    console.log('getProvider resultWeb failed');
    console.log(e)
  }

  try {
    clientMobile.registerClient({});
    const resultMobile = await clientMobile.api.provider.getProvider();
    console.log('getProvider resultMobile', resultMobile);
    result = resultMobile.name;
  } catch(e) {
    console.log('getProvider resultMobile failed');
    console.log(e)
  }

  console.log('getProvider result', result);

  return result;
}

export async function getAccount() {
  console.log("navigator Browser CodeName: ", navigator.appCodeName);
  console.log("navigator Browser Name: ", navigator.appName);
  console.log("navigator Browser Version: ", navigator.appVersion);
  console.log("navigator Cookies Enabled: ", navigator.cookieEnabled);
  console.log("navigator Browser Language: ", navigator.language);
  console.log("navigator Browser Online: ", navigator.onLine);
  console.log("navigator Platform: ", navigator.platform);
  console.log("navigator User-agent header: ", navigator.userAgent);
  try {
    const result = await client.api.asset.getAccount();
    console.log('getAccount', result);
    return result;
  } catch(e) {
    console.log(e);
  }
}

export async function getIdentity() {
  try {
    const result = await client.api.identity.getIdentity();
    console.log('getIdentity', result);
    return result;
  } catch(e) {
    console.log(e);
  }
}

export async function issueClaim(claimContent) {
  const timestamp = Date.now();

  const adminPrivateKey = new Crypto.PrivateKey('7c47df9664e7db85c1308c080f398400cb24283f5d922e76b478b5429e821b97');
  const adminAddress = new Crypto.Address('AdLUBSSHUuFaak9j169hiamXUmPuCTnaRz');

  const ontid = 'did:ont:AeXrnQ7jvo3HbSPgiThkgJ7ifPQkzXhtpL';
  const publicKeyId = ontid + '#keys-1';
  const privateKey = new Crypto.PrivateKey('4a8d6d61060998cf83acef4d6e7976d538b16ddeaa59a96752a4a7c0f7ec4860');

  // Write claim
  const signature = undefined;
  const useProof = true;

  const claim = new Claim({
      messageId: '2020/04/22',
      issuer: ontid,
      subject: ontid,
      issuedAt: timestamp
  }, signature, useProof);
  claim.version = '0.7.0';
  claim.context = 'https://example.com/template/v1';
  claim.content = claimContent;

  // Sign claim

  console.log('issueClaim claim unsigned', claim);
  await claim.sign(restUrl, publicKeyId, privateKey);

  console.log('issueClaim claim signed', claim);

  // Attest claim
  const gasFee = '500';
  const gasLimit = '20000';

  const attestResult = await claim.attest(socketUrl, gasFee, gasLimit, adminAddress, adminPrivateKey);
  console.log('issueClaim attestResult', attestResult);
//		txhash "00fbe7b186c9fef8861c9d5ce83a53fc9a0f82b82aaa94c55fc054bc08c021af";

  console.log('issueClaim claim attested', claim);

  const contract = '36bb5c053b6b839c8f6b923fe852f91239b9fccc';
  const proof = await Merkle.constructMerkleProof(restUrl, attestResult.Result.TxHash, contract);

  claim.proof = proof;
  console.log('issueClaim claim wtih proof clamtomatch', claim);

  const signed = claim.serialize();
  console.log('issueClaim claim serialized', signed);

  const msg = Claim.deserialize(signed);

  console.log('issueClaim msg deserialized claimtomatch', msg);

  const testBlockchainResult = await testBlockchain(signed);
  console.log('issueClaim testBlockchainResult', testBlockchainResult);

  const testSignatureResult = await testSignature(signed);
  console.log('issueClaim testSignatureResult', testSignatureResult);

  return signed;
}

export async function testBlockchain(claimSerialized) {

  const claim = Claim.deserialize(claimSerialized);

  console.log('testBlockchain claim', claim);

  // Test if the claim is stored on the blockchain.
  const result = await claim.verify(restUrl, true);
  console.log('verifyClaim testBlockchain result', result);
  return result;
}

export async function testSignature(claimSerialized) {

  const claim = Claim.deserialize(claimSerialized);

  console.log('testSignature claimSerialized', claimSerialized);
  console.log('testSignature claim', claim);

  // Test that the claim has a valid signature.
  const privateKey = new Crypto.PrivateKey('4a8d6d61060998cf83acef4d6e7976d538b16ddeaa59a96752a4a7c0f7ec4860');
  const pk = privateKey.getPublicKey();

  const strs = claimSerialized.split('.');

  const signData = str2hexstr(strs[0] + '.' + strs[1]);
  const result = pk.verify(signData, claim.signature);
  console.log('verifyClaim testSignature result', result);
  return result;
}
