import { client } from 'ontology-dapi';
//import { client as clientWeb } from 'ontology-dapi';
//import { client as clientMobile } from 'cyanobridge';
import { Address, Claim, Crypto, Merkle, PublicKeyStatus, Message,
RestClient, DDO, OntidContract, TransactionBuilder, Parameter, ParameterType, AbiInfo,
Signature } from 'ontology-ts-sdk';
//import { retrievePublicKey, retrievePublicKeyState } from 'ontology-ts-sdk/src/claim/message';
import { reverseHex, str2hexstr, hexstr2str, StringReader, ab2str } from '../utils/utils';
import { verify } from '../utils/verify';

// ONT ID Contract Info
import abiJson from '../data/attestClaim';
const abiInfo = AbiInfo.parseJson(JSON.stringify(abiJson));
const contractHash = abiInfo.getHash().replace('0x', '');
const contractAddress = new Crypto.Address(reverseHex(contractHash));

const axios = require('axios').default;

// ONT Node URL Info
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
  try {
    const result = await client.api.message.signMessage({ message });
    console.log('signMessage result', result);
    return result;
  } catch(e) {
    console.log('signMessage error', e)
  }
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


export async function issueClaimDapi(claimContent, subjectOntid) {

  // Admin Key
  const adminPrivateKey = Crypto.PrivateKey.deserializeWIF('Kx6uDnwAdhKdcaTPi81Rac1MzpD4QbKTJxt7xSVCmXuEjoHtPeS8');
  console.log('issueClaimDapi adminPrivateKey', adminPrivateKey);

  const issuerAccount = await getAccount();
  console.log('issueClaimDapi issuerAccount', issuerAccount);

  const issuerPublicKey = await getPublicKey();
  console.log('issueClaimDapi issuerPublicKey', issuerPublicKey);

//  const issuerOntid = await getIdentity();
  const issuerOntid = 'did:ont:' + issuerAccount;
//  console.log('issueClaimDapi issuerOntid2', issuerOntid2);
  console.log('issueClaimDapi issuerOntid', issuerOntid);

  const issuerPublicKeyId = issuerOntid + '#keys-1';
  console.log('issueClaimDapi issuerPublicKeyId', issuerPublicKeyId);

  let claim = await writeClaim(issuerOntid, subjectOntid, claimContent);
//  let claimTS = await writeClaim(issuerOntid, subjectOntid, claimContent);

  console.log('issueClaimDapi claim unsigned', claim);
//  console.log('issueClaimDapi claimTS unsigned', claimTS);

  const algorithm = adminPrivateKey.algorithm.defaultSchema;
  console.log('issuerClaimDapi algorithm', algorithm);

  // Sign claim with ontology-dapi
  const msgForDapi = claim.serializeUnsigned(algorithm, issuerPublicKeyId);
  console.log('issueClaimDapi msgForDapi', msgForDapi);
  const dapiSign = await signMessage(msgForDapi);
  console.log('issueClaimDapi dapiSign', dapiSign);
//  claim.signature = Crypto.Signature.deserializeHex(dapiSign.data);
  let signatureDapi = Crypto.Signature.deserializeHex(dapiSign.data);
  const publicKeyStringReader = new StringReader(dapiSign.publicKey);
//  signatureDapi.publicKeyId = Crypto.PublicKey.deserializeHex(publicKeyStringReader);
  signatureDapi.publicKeyId = issuerPublicKeyId;


  claim.signature = signatureDapi;

//  await claim.sign(restUrl, issuerPublicKeyIdTS, issuerPrivateKeyTS);

  // Sign claim with ontology-ts-sdk
//  await claimTS.sign(restUrl, issuerPublicKeyIdTS, issuerPrivateKeyTS);

  console.log('issueClaimDapi claim signatureDapi', claim.signature);
//  console.log('issueClaimDapi claim signatureTS', claimTS.signature);

  console.log('issueClaimDapi claim signed', claim);
//  console.log('issueClaimDapi claimTS signed', claimTS);

//  await retrievePublicKey(publicKeyId, url);

  // Attest claim
  const gasFee = '500';
  const gasLimit = '20000';

//  const attestResult = await claim.attest(socketUrl, gasFee, gasLimit, payerAddress, payerPrivateKey);
//  console.log('issueClaim attestResult', attestResult);
//		txhash "00fbe7b186c9fef8861c9d5ce83a53fc9a0f82b82aaa94c55fc054bc08c021af";

  const payerAddress = await getAccount();

  const dapiAttestResult = await buildCommitRecordTx(claim.metadata.messageId, claim.metadata.issuer, claim.metadata.subject, gasFee, gasLimit, payerAddress);

  console.log('issueClaim claim attested', claim);

  console.log('issueClaim dapiAttestResult', dapiAttestResult);
  console.log('issueClaim dapiAttestResult.transaction', dapiAttestResult.transaction);

  const contract = '36bb5c053b6b839c8f6b923fe852f91239b9fccc';
// proof for ts-sdk
//  const proof = await Merkle.constructMerkleProof(restUrl, dapiAttestResult.transaction, contractAddress);

  var proof = '';

  const data = {
    dapiAttestResultTransaction: dapiAttestResult.transaction,
    contractAddress: contractAddress
  }

  const test = 'test';
  const test2 = 'test2';

  const data2 = {
    test,
    test2
  }

  console.log('issueClaim axios');

  await axios.post("/proof", data, { // receive two parameter endpoint url ,form data
     })
     .then(res => { // then print response status
       console.log('axios res', res);
       console.log('axios res.data', res.data);
       proof = res.data;
     })

  claim.proof = proof;
  console.log('issueClaim claim with proof clamtomatch', claim);

  const signed = claim.serialize();
  console.log('issueClaim claim serialized', signed);

  const msg = Claim.deserialize(signed);

  console.log('issueClaim msg deserialized claimtomatch', msg);

//  const verifyResult = await verify(msg);
  const verifyResult = await verify(signed);

  console.log('issueClaim verifyResult', verifyResult);

  return [signed, dapiAttestResult.transaction];
}

export async function getBlockHeight(claimSerialized) {
  const claim = Claim.deserialize(claimSerialized);
  console.log('getBlockHeight claim', claim);
  console.log('getBlockHeight', claim.proof.BlockHeight);
  return claim.proof.BlockHeight;
}

export async function getTxHash(claimSerialized) {
  const claim = Claim.deserialize(claimSerialized);
  console.log('getTxnHash claim', claim);
  console.log('getTxnHash', claim.proof.TxnHash);
  return claim.proof.TxnHash;
}

export async function issueClaimTS(claimContent, payerPrivateKeyString, issuerPrivateKeyString, subjectOntid) {
  const payerPrivateKey = new Crypto.PrivateKey(payerPrivateKeyString);
  const payerPublicKey = payerPrivateKey.getPublicKey();
  const payerAddress = Crypto.Address.fromPubKey(payerPublicKey);

  const issuerPrivateKey = new Crypto.PrivateKey(issuerPrivateKeyString);
  const issuerPublicKey = issuerPrivateKey.getPublicKey();
  const issuerOntid = Crypto.Address.generateOntid(issuerPublicKey);
  const issuerPublicKeyId = issuerOntid + '#keys-1';

  // Write claim
  const claim = writeClaim(issuerOntid, subjectOntid, claimContent);

  // Sign claim
  await claim.sign(restUrl, issuerPublicKeyId, issuerPrivateKey);

  console.log('issueClaim claim signed', claim);
  console.log('issueClaimTs claim.signature', claim.signature);

  // Attest claim
  const gasFee = '500';
  const gasLimit = '20000';

  const attestResult = await claim.attest(socketUrl, gasFee, gasLimit, payerAddress, payerPrivateKey);
  console.log('issueClaim attestResult', attestResult);

  console.log('issueClaim claim attested', claim);

  // Store proof and serialize claim
  const proof = await Merkle.constructMerkleProof(restUrl, attestResult.Result.TxHash, contractAddress);

  claim.proof = proof;
  console.log('issueClaim claim with proof clamtomatch', claim);

  const signed = claim.serialize();
  console.log('issueClaim claim serialized', signed);


  const msg = Claim.deserialize(signed);
//  console.log('issueClaim msg deserialized claimtomatch', msg);
  const verifyResult = await verify(msg);
  console.log('issueClaim verifyResult', verifyResult);

  return signed;
}

export function writeClaim(issuer, subject, content) {
  const timestamp = Date.now();
//  const timestamp = 1589612511102;
  const signature = undefined;
  const useProof = true;
//  const useProof = false;

  const claim = new Claim({
      messageId: issuer + '@' + timestamp,
      issuer: issuer,
      subject: subject,
      issuedAt: timestamp
  }, signature, useProof);
  claim.version = '0.7.0';
  claim.context = 'https://example.com/template/v1';
  claim.content = content;

  console.log('writeClaim claim', claim);
  return claim;
}

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
    console.log('buildCommitRecordTx gasPrice', gasPrice);
    console.log('buildCommitRecordTx gasLimit', gasLimit);
    console.log('buildCommitRecordTx payer', payer);

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
