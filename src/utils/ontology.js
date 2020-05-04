import { client } from 'ontology-dapi';
//import { client as clientWeb } from 'ontology-dapi';
//import { client as clientMobile } from 'cyanobridge';
import { Address, Claim, Crypto, Merkle, PublicKeyStatus, Message,
RestClient, DDO, OntidContract, TransactionBuilder, Parameter, ParameterType, AbiInfo,
Signature } from 'ontology-ts-sdk';
//import { retrievePublicKey, retrievePublicKeyState } from 'ontology-ts-sdk/src/claim/message';
import { reverseHex, str2hexstr, hexstr2str, StringReader, ab2str } from '../utils/utils';

import abiJson from '../data/attestClaim';
const abiInfo = AbiInfo.parseJson(JSON.stringify(abiJson));
const contractHash = abiInfo.getHash().replace('0x', '');
const contractAddress = new Crypto.Address(reverseHex(contractHash));

const restUrl = 'http://polaris1.ont.io:20334';
const socketUrl = 'ws://polaris1.ont.io:20335';

client.registerClient({});

export async function getAccount() {
  try {
    return await client.api.asset.getAccount();
  } catch(e) {
    console.log('getAccount error', e);
  }
}

export async function getPublicKey() {
  try {
    return await client.api.asset.getPublicKey();
  } catch(e) {
    console.log('getPublicKey error', e);
  }
}

export async function getIdentity() {
  try {
    return await client.api.identity.getIdentity();
  } catch(e) {
    console.log('getIdentity error', e)
  }
}

export async function signMessage(message) {
  const result = await client.api.message.signMessage({ message });
  console.log('signMessage result', result);
  return result;
}

export async function callSmartContract(scriptHash, operation, gasPrice, gasLimit, requireIdentity, parametersRaw) {

    console.log('callSmartContract scriptHash', scriptHash);
    console.log('callSmartContract operation', operation);
    console.log('callSmartContract gasPrice', gasPrice);
    console.log('callSmartContract gasLimit', gasLimit);
    console.log('callSmartContract requireIdentity', requireIdentity);
    console.log('callSmartContract parametersRaw', parametersRaw);
  const args = parametersRaw.map((raw) => ({ type: raw.type, value: convertValue(raw.value, raw.type) }));
  console.log('callSmartContract args', args);
  try {
    const result = await client.api.smartContract.invoke({
      scriptHash,
      operation,
      args,
      gasPrice,
      gasLimit,
      requireIdentity
    });
    console.log('callSmartContract finished, result:' + JSON.stringify(result));
    return result;
  } catch (e) {
    alert('callSmartContract canceled');
    console.log('callSmartContract error:', e);
  }
}

function convertValue(value: string, type: ParameterType) {
  switch (type) {
    case 'Boolean':
      return Boolean(value);
    case 'Integer':
      return Number(value);
    case 'ByteArray':
      return value;
    case 'String':
      return client.api.utils.strToHex(value);
  }
}

export async function issueClaim(claimContent, payerPrivateKeyString, issuerPrivateKeyString, subjectOntid) {

  const timestamp = Date.now();

  const payerPrivateKey = new Crypto.PrivateKey(payerPrivateKeyString);
  const payerPublicKey = payerPrivateKey.getPublicKey();
  const payerAddress = Crypto.Address.fromPubKey(payerPublicKey);

  const issuerPrivateKey = new Crypto.PrivateKey(issuerPrivateKeyString);
  const issuerPublicKey = issuerPrivateKey.getPublicKey();
  const issuerOntid = Crypto.Address.generateOntid(issuerPublicKey);
//  const issuerOntid = 'did:ont:AdLUBSSHUuFaak9j169hiamXUmPuCTnaRz';
  const issuerPublicKeyId = issuerOntid + '#keys-1';

  // Write claim
  const signature = undefined;
  const useProof = false;

  const claim = new Claim({
      messageId: issuerOntid + timestamp,
      issuer: issuerOntid,
      subject: subjectOntid,
      issuedAt: timestamp
  }, signature, useProof);
  claim.version = '0.7.0';
  claim.context = 'https://example.com/template/v1';
  claim.content = claimContent;

  console.log('issueClaim claim unsigned', claim);

  // Sign claim with ontology-dapi
  var msgForDapi = claim.serialize();
  console.log('issueClaim msgForDapi', msgForDapi);

  const dapiSign = await signMessage(msgForDapi);
  console.log('issueClaim dapi signed', dapiSign);
//  claim.signature = Crypto.Signature.deserializeHex(dapiSign.data);
  let signatureDapi = Crypto.Signature.deserializeHex(dapiSign.data);
  const publicKeyStringReader = new StringReader(dapiSign.publicKey);
  signatureDapi.publicKeyId = Crypto.PublicKey.deserializeHex(publicKeyStringReader);

  console.log('issueClaim claim signatureDapi', signatureDapi);

  // Sign claim with ontology-ts-sdk
  await claim.sign(restUrl, issuerPublicKeyId, issuerPrivateKey);

  console.log('issueClaim claim signatureTS', claim.signature);

  console.log('issueClaim claim signed', claim);

//  await retrievePublicKey(publicKeyId, url);


  // Attest claim
  const gasFee = '500';
  const gasLimit = '20000';

//  const attestResult = await claim.attest(socketUrl, gasFee, gasLimit, payerAddress, payerPrivateKey);
//  console.log('issueClaim attestResult', attestResult);
//		txhash "00fbe7b186c9fef8861c9d5ce83a53fc9a0f82b82aaa94c55fc054bc08c021af";

  const dapiAttestResult = await buildCommitRecordTx(claim.metadata.messageId, claim.metadata.issuer, claim.metadata.subject, gasFee, gasLimit, payerAddress);

  console.log('issueClaim claim attested', claim);

  console.log('issueClaim dapiAttestResult', dapiAttestResult);
  console.log('issueClaim dapiAttestResult.transaction', dapiAttestResult.transaction);

  const contract = '36bb5c053b6b839c8f6b923fe852f91239b9fccc';
// proof for ts-sdk
//   const proof = await Merkle.constructMerkleProof(restUrl, attestResult.Result.TxHash, contract);
  const proof = await Merkle.constructMerkleProof(restUrl, dapiAttestResult.transaction, contract);

  claim.proof = proof;
  console.log('issueClaim claim with proof clamtomatch', claim);

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

  const result = await claim.verify(restUrl, true);
  console.log('testBlockchain result', result);
  const resultSig = await claim.verify(restUrl, false);
  console.log('testBlockchain signature result', resultSig);
  const resultAttest = await claim.getStatus(restUrl);
  console.log('testBlockchain getStatus', resultAttest);

  const resultAttest2 = await getStatus(claim, restUrl);
  console.log('testBlockchain getStatus', resultAttest2);

  return result;
}

export async function verifyExpiration(claimSerialized) {
  const claim = Claim.deserialize(claimSerialized);
  console.log('testSignature verifyExpiration', claim.verifyExpiration());
  return claim.verifyExpiration();
}

export async function verifyKeyOwnership(claimSerialized) {
  const claim = Claim.deserialize(claimSerialized);
  console.log('testSignature verifyKeyOwnership', claim.verifyKeyOwnership());
  return claim.verifyKeyOwnership();
}

export async function verifyNotRevoked(claimSerialized) {
  const claim = Claim.deserialize(claimSerialized);
  const signature = claim.signature;

  const state = await retrievePublicKeyState(signature.publicKeyId, restUrl);
  console.log('testSignature state', state);

  if (state === Crypto.PublicKeyStatus.REVOKED) {
    console.log('testSignature PublicKeyStatus.REVOKED revoked');
    return false
  } else {
    console.log('testSignature PublicKeyStatus.REVOKED not revoked');
    return true
  }
}

export async function verifySignature(claimSerialized) {
  const claim = Claim.deserialize(claimSerialized);

  const signature = claim.signature;

  const publicKey = await retrievePublicKey(signature.publicKeyId, restUrl);
  const msg = claim.serializeUnsigned(signature.algorithm, signature.publicKeyId);
  const msgHex = str2hexstr(msg);
  console.log('testSignature publicKey.verify', publicKey.verify(msgHex, signature));
  return publicKey.verify(msgHex, signature);

}

export async function verifyMatchingClaimId(claimSerialized) {
  const claim = Claim.deserialize(claimSerialized);

  const attesterId = claim.metadata.issuer;
  const claimId = claim.metadata.messageId;
  if (claimId === undefined) {
      throw new Error('Claim id not specified.');
  }
//    return result.status === Status.ATTESTED && result.issuerId === attesterId;

  const client = new RestClient(restUrl);
  const tx = buildGetRecordStatusTx(claimId);

  const response = await client.sendRawTransaction(tx.serialize(), true);

  const result = GetStatusResponse.deserialize(response);
  // console.log('status: ' + JSON.stringify(result));

  console.log('testBlockchain getStatus custom result', result);
  console.log('testBlockchain getStatus testing is issuerId matches this attesterid', result.issuerId === attesterId);
  return result.issuerId === attesterId;
}

export async function verifyAttestStatus(claimSerialized) {
  const claim = Claim.deserialize(claimSerialized);

  const attesterId = claim.metadata.issuer;
  const claimId = claim.metadata.messageId;
  if (claimId === undefined) {
      throw new Error('Claim id not specified.');
  }
//    return result.status === Status.ATTESTED && result.issuerId === attesterId;

  const client = new RestClient(restUrl);
  const tx = buildGetRecordStatusTx(claimId);

  const response = await client.sendRawTransaction(tx.serialize(), true);

  const result = GetStatusResponse.deserialize(response);
  // console.log('status: ' + JSON.stringify(result));

  console.log('testBlockchain getStatus custom result', result);
  return result.status === '01';
}

export async function testSignature(claimSerialized, claimIssuer) {

  const claim = Claim.deserialize(claimSerialized);

//  console.log('testSignature claimSerialized', claimSerialized);
  console.log('testSignature claim', claim);
  console.log('testSignature claim.verify', await claim.verify(restUrl, false));

  // Test that the claim has a valid signature.
//  const privateKey = new Crypto.PrivateKey('7c47df9664e7db85c1308c080f398400cb24283f5d922e76b478b5429e821b97');
//  const pk = privateKey.getPublicKey();
//  const privateKey = new Crypto.PrivateKey(privateKeyString);
//  const publicKey = privateKey.getPublicKey();
//  const publicAddress = Crypto.Address.fromPubKey(publicKey);
  console.log('testSignature claimIssuer', claimIssuer);
  console.log('testSignature claim.signature.publicKeyId', claim.signature.publicKeyId);
  const accountString = await getAccount();
  console.log('testSignature accountString', accountString);
  const publicKeyString = await getPublicKey();
//  console.log('testSignature PublicKeyStatus.fromHexLabel', new Crypto.PublicKeyStatus.fromHexLabel(claim.signature.publicKeyId));
  console.log('testSignature publicKeyString', publicKeyString);
  const publicKey = new Crypto.PublicKey(publicKeyString);
  console.log('testSignature publicKey', publicKey);

  const strs = claimSerialized.split('.');

  const signData = str2hexstr(strs[0] + '.' + strs[1]);
  const result = publicKey.verify(signData, claim.signature);
  console.log('testSignature result', result);
//  return result;

  const signature = claim.signature;
  const url = restUrl;

  if (signature !== undefined && signature.publicKeyId !== undefined) {
    try {
      console.log('testSignature verifyExpiration', claim.verifyExpiration());
      console.log('testSignature verifyKeyOwnership', claim.verifyKeyOwnership());

      const state = await retrievePublicKeyState(signature.publicKeyId, url);
      console.log('testSignature state', state);

      if (state === Crypto.PublicKeyStatus.REVOKED) {
        console.log('testSignature PublicKeyStatus.REVOKED revoked');
      } else {
        console.log('testSignature PublicKeyStatus.REVOKED not revoked');
      }

      const publicKey = await retrievePublicKey(signature.publicKeyId, url);
      const msg = claim.serializeUnsigned(signature.algorithm, signature.publicKeyId);
      const msgHex = str2hexstr(msg);
      console.log('testSignature publicKey.verify', publicKey.verify(msgHex, signature));
      return publicKey.verify(msgHex, signature);
    } catch (e) {
      console.log(e)
    }
  } else {
    console.log('no signature');
  }
}

/**
 * Gets the public key associated with ONT ID from blockchain.
 *
 * @param publicKeyId The ID of a signature public key
 * @param url Restful endpoint of Ontology node
 */
export async function retrievePublicKey(publicKeyId: string, url: string) {
    const ontId = extractOntId(publicKeyId);
    const keyId = extractKeyId(publicKeyId);

    const client = new RestClient(url);
    const tx = OntidContract.buildGetDDOTx(ontId);
    const response = await client.sendRawTransaction(tx.serialize(), true);

    if (response.Result && response.Result.Result) {
        const ddo = DDO.deserialize(response.Result.Result);

        const publicKey = ddo.publicKeys.find((pk) => pk.id === keyId);

        if (publicKey === undefined) {
            throw new Error('Not found');
        }

        return publicKey.pk;
    } else {
        throw new Error('Not found');
    }
}

/**
 * Gets the state of public key associated with ONT ID from blockchain.
 *
 * @param publicKeyId The ID of a signature public key
 * @param url Restful endpoint of Ontology node
 */
export async function retrievePublicKeyState(publicKeyId: string, url: string) {
    const ontId = extractOntId(publicKeyId);
    const keyId = extractKeyId(publicKeyId);

    const client = new RestClient(url);
    const tx = OntidContract.buildGetPublicKeyStateTx(ontId, keyId);
    const response = await client.sendRawTransaction(tx.serialize(), true);
    if (response.Result && response.Result.Result) {
        return Crypto.PublicKeyStatus.fromHexLabel(response.Result.Result);
    } else {
        throw new Error('Not found');
    }
}

/**
 * Extracts ONT ID from public key Id.
 *
 * @param publicKeyId The ID of a signature public key
 */
export function extractOntId(publicKeyId: string): string {
    const index = publicKeyId.indexOf('#keys-');

    if (index === -1) {
        throw new Error('Is not a publicKeId.');
    }

    return publicKeyId.substr(0, index);
}

/**
 * Extracts key id from public key Id.
 *
 * @param publicKeyId The ID of a signature public key
 */
export function extractKeyId(publicKeyId: string): number {
    const index = publicKeyId.indexOf('#keys-');

    if (index === -1) {
        throw new Error('Is not a publicKeId.');
    }

    // return num2hexstring(
    //     Number(publicKeyId.substr(index + '#keys-'.length))
    // );
    return Number(publicKeyId.substr(index + '#keys-'.length));
}

/**
 * Gets status of the claim attest.
 *
 * @param url Restful endpoint of Ontology node
 */
async function getStatus(claim, url: string) {
    const attesterId = claim.metadata.issuer;
    const claimId = claim.metadata.messageId;
    if (claimId === undefined) {
        throw new Error('Claim id not specified.');
    }
//    return result.status === Status.ATTESTED && result.issuerId === attesterId;

    const client = new RestClient(url);
    const tx = buildGetRecordStatusTx(claimId);

    const response = await client.sendRawTransaction(tx.serialize(), true);

    const result = GetStatusResponse.deserialize(response);
    // console.log('status: ' + JSON.stringify(result));

    console.log('testBlockchain getStatus custom result', result);
    console.log('testBlockchain getStatus result.issuerId', result.issuerId);
    console.log('testBlockchain getStatus result.status', result.status);
    console.log('testBlockchain getStatus testing is issuerId matches this attesterid', result.issuerId === attesterId);
    return result.status === '01' && result.issuerId === attesterId;
//    return result.status === Status.ATTESTED && result.issuerId === attesterId;
}

/**
 * Queries the state of attest.
 *
 * @param claimId Unique id of the claim
 */
export function buildGetRecordStatusTx(claimId: string) {
    const f = abiInfo.getFunction('GetStatus');
    const p1 = new Parameter(f.parameters[0].getName(), ParameterType.ByteArray, str2hexstr(claimId));
    const tx = TransactionBuilder.makeInvokeTransaction(f.name, [p1], contractAddress);
    return tx;
}

/**
 * Helper class for deserializing GetStatus response.
 * fixme: Ontology node changed the response
 */
export class GetStatusResponse {
    static deserialize(r: any): GetStatusResponse {
        const response = new GetStatusResponse();

        if (r.Result !== undefined && r.Result.Result === '') {
            response.status = Status.NOTFOUND;
            return response;
        }
        const sr = new StringReader(r.Result.Result);
        sr.read(1); // data type
        sr.readNextLen(); // data length
        sr.read(1); // data type
        const claimId = hexstr2str(sr.readNextBytes());
        sr.read(1); // data type
        const issuerId = hexstr2str(sr.readNextBytes());
        sr.read(1); // data type
        const subjectId = hexstr2str(sr.readNextBytes());
        sr.read(1); // data type
        let status = sr.readNextBytes();
        response.claimId = claimId;
        response.issuerId = issuerId;
        response.subjectId = subjectId;
        if (!status) {// status is revoked
            status = '00';
        }
        response.status = status;
//        response.status =  status as Status;
        return response;
    }

    claimId: string;
    issuerId: string;
    subjectId: string;
    status: Status;
    // status: Status;
    // attesterId: string;
    // time: string;
}

/*
export enum Status {
    REVOKED = '00',
    ATTESTED = '01',
    NOTFOUND = '-1'
}

*/


/**
 * Attests the claim.
 *
 * @param claimId Unique id of the claim
 * @param issuer Issuer's ONT ID
 * @param subject Subject's ONT ID
 * @param gasPrice Gas price
 * @param gasLimit Gas limit
 * @param payer Payer's address
 */
export async function buildCommitRecordTx(claimId: string, issuer: string, subject: string,
                                    gasPrice: string, gasLimit: string, payer: Address)  {
    const f = abiInfo.getFunction('Commit');
    if (issuer.substr(0, 3) === 'did') {
        issuer = str2hexstr(issuer);
    }
    if (subject.substr(0, 3) === 'did') {
        subject = str2hexstr(issuer);
    }
    console.log('buildCommitRecordTx issuer', issuer);
    console.log('buildCommitRecordTx subject', subject);
    console.log('buildCommitRecordTx claimId', str2hexstr(claimId));

    const p1 = new Parameter(f.parameters[0].getName(), ParameterType.ByteArray, str2hexstr(claimId));
    const p2 = new Parameter(f.parameters[1].getName(), ParameterType.ByteArray, issuer);
    const p3 = new Parameter(f.parameters[2].getName(), ParameterType.ByteArray, subject);

//    let tx = new Transaction();
//    tx = makeInvokeTransaction(f.name, [p1, p2, p3], contractAddress, gasPrice, gasLimit, payer);


    const parametersRaw = [p1, p2, p3];
//    callSmartContract(contractAddress, f.name, gasPrice, gasLimit, false, parametersRaw);
    return await callSmartContract(contractHash, f.name, gasPrice, gasLimit, false, parametersRaw);

//    return tx;
}

{/*
export async function getAccount() {

  var result = '';

  try {
    var clientWeb = require('ontology-dapi').client;
    clientWeb.registerClient({});

    var clientWebResult = await clientWeb.api.asset.getAccount();

    result = clientWebResult;

    return result;

  } catch(e) {
    console.log(e)
  }

  try {
    var clientMobile = require('cyanobridge').client;
    clientMobile.registerClient({});

    const params = {dappName: 'My dapp', dappIcon: ''};

    var clientMobileResult = await clientMobile.api.asset.getAccount(params);

//    result = clientMobileResult.result;

    return Promise.resolve(clientMobileResult.result);

  } catch(e) {
    console.log(e)
  }
}
*/}
