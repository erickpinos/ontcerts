import { Crypto, AbiInfo, Parameter, ParameterType, TransactionBuilder, Claim, RestClient, DDO, OntidContract } from 'ontology-ts-sdk';
import { reverseHex, str2hexstr, hexstr2str, StringReader } from '../utils/utils';

// ONT ID Contract Info
import abiJson from '../data/attestClaim';
const abiInfo = AbiInfo.parseJson(JSON.stringify(abiJson));
const contractHash = abiInfo.getHash().replace('0x', '');
const contractAddress = new Crypto.Address(reverseHex(contractHash));

// ONT Node URL Info
const restUrl = 'http://polaris1.ont.io:20334';

const axios = require('axios').default;

export async function verify(claimSerialized) {

  const data = {
    claimSerialized
  }

  var result = '';

  console.log('test here first', result);

  let res = await axios.post("/verify", data);

  console.log('axios res', res);
  console.log('axios /verify res.data', res.data);
  result = res.data;

  console.log('lalatest result', result);
  return result;
/*
  console.log('verify claim', claim);

  const resultVerifySignatureAndAttestStatus = await claim.verify(restUrl, true);
  console.log('verify resultVerifySignatureAndAttestStatus', resultVerifySignatureAndAttestStatus);

  const resultVerifySignature = await claim.verify(restUrl, false);
  console.log('verify resultVerifySignature', resultVerifySignature);

  const resultVerifyGetStatus = await claim.getStatus(restUrl);
  console.log('verify resultVerifyGetStatus', resultVerifyGetStatus);

  const resultVerifyGetStatusCustom = await getStatus(claim, restUrl);
  console.log('verify resultVerifyGetStatusCustom', resultVerifyGetStatusCustom);

  const resultVerifyExpiration = await verifyExpiration(claim);
  console.log('verify resultVerifyExpiration', resultVerifyExpiration);

  const resultVerifyKeyOwnership = await verifyKeyOwnership(claim);
  console.log('verify resultVerifyKeyOwnership', resultVerifyKeyOwnership);

  const resultVerifyNotRevoked = await verifyNotRevoked(claim);
  console.log('verify resultVerifyNotRevoked', resultVerifyNotRevoked);

  const resultVerifyMatchingClaimId = await verifyMatchingClaimId(claim);
  console.log('verify resultVerifyMatchingClaimId', resultVerifyMatchingClaimId);

  const resultVerifyAttestStatus = await verifyAttestStatus(claim);
  console.log('verify resultVerifyAttestStatus', resultVerifyAttestStatus);

*/
//  return resultVerifySignatureAndAttestStatus;
}

export async function verifyExpiration(claimSerialized) {
//  console.log('verifyExpiration', claim.verifyExpiration());
//  return claim.verifyExpiration();

  const data = {
    claimSerialized
  }

  console.log('verifyExpiration data', data)
  let res = await axios.post("/verify/verifyExpiration", data);
  console.log('verifyExpiration res', res);
  const result = res.data;
  return result;
}

export async function verifyKeyOwnership(claimSerialized) {
//  console.log('verifyKeyOwnership', claim.verifyKeyOwnership());
//  return claim.verifyKeyOwnership();

const data = {
  claimSerialized
}

let res = await axios.post("/verify/verifyKeyOwnership", data);
const result = res.data;
return result;

}

export async function verifyNotRevoked(claimSerialized) {
/*
  const signature = claim.signature;

  const state = await retrievePublicKeyState(signature.publicKeyId, restUrl);

  if (state === Crypto.PublicKeyStatus.REVOKED) {
    console.log('verifyNotRevoked', false);
    return false
  } else {
    console.log('verifyRevoked', true);
    return true
  }
*/

const data = {
  claimSerialized
}

let res = await axios.post("/verify/verifyNotRevoked", data);
const result = res.data;
return result;

}

export async function verifySignature(claimSerialized) {
/*
  const signature = claim.signature;

  const publicKey = await retrievePublicKey(signature.publicKeyId, restUrl);
  const msg = claim.serializeUnsigned(signature.algorithm, signature.publicKeyId);
  const msgHex = str2hexstr(msg);
//  console.log('testSignature publicKey', publicKey);
//  console.log('testSignature publicKey.verify', publicKey.verify(msgHex, signature));
  return publicKey.verify(msgHex, signature);
*/
const data = {
  claimSerialized
}

let res = await axios.post("/verify/verifySignature", data);
const result = res.data;
return result;

}

export async function verifyMatchingClaimId(claimSerialized) {
/*
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

//  console.log('testBlockchain getStatus custom result', result);
//  console.log('testBlockchain getStatus testing is issuerId matches this attesterid', result.issuerId === attesterId);
  return result.issuerId === attesterId;
*/
const data = {
  claimSerialized
}

let res = await axios.post("/verify/verifyMatchingClaimId", data);
const result = res.data;
return result;

}

export async function verifyAttestStatus(claimSerialized) {
/*
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

//  console.log('testBlockchain getStatus custom result', result);
  return result.status === '01';
*/
const data = {
  claimSerialized
}

let res = await axios.post("/verify/verifyAttestStatus", data);
const result = res.data;
return result;

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
