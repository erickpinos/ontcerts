import { client } from 'ontology-dapi';
import { Claim, Crypto } from 'ontology-ts-sdk';
import { str2hexstr } from '../utils/utils';

const restUrl = 'http://polaris1.ont.io:20334';

client.registerClient({});

export async function getAccount() {
  try {
    const result = await client.api.asset.getAccount();
    console.log('getAccount', result);
    return result;
  } catch(e) {
    console.log(e);
  }
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
