var express = require('express');
var app = express();
var multer = require('multer')
var cors = require('cors');

const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const ontologyTsSdk = require('ontology-ts-sdk');

const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 5000;

// ONT Node URL Info
const restUrl = 'http://polaris1.ont.io:20334';
const socketUrl = 'ws://polaris1.ont.io:20335';

const { verify, verifyExpiration, verifyKeyOwnership, verifyNotRevoked,
	verifySignature, verifyMatchingClaimId, verifyAttestStatus } = require('./verify');

const { getDDO, addAttributes, getDocument, getAttributes, registerOntId,
regIdWithAttributes, removeAttribute } = require('./identity');

// Multi-process to utilize all CPU cores.
if (!isDev && cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
  });

} else {
  const app = express();

  app.use(cors());

  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, '../client/build')));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Answer API requests.
  app.get('/api', function (req, res) {
    res.set('Content-Type', 'application/json');
    const test = 'test';
    res.send('{"message":'+JSON.stringify(req.body)+'}');
  });

  // Answer API requests.
  app.post('/proof', async function (req, res) {
//    res.set('Content-Type', 'application/json');

  console.log('express req.body', req.body);
//  const test = req.body;
//  console.log('express', test);
//  const test2 = req.body.test2;
//  console.log('express', test2);
  const dapiAttestResultTransaction = req.body.dapiAttestResultTransaction;
  const contractAddress = req.body.contractAddress;

  const proof = await ontologyTsSdk.Merkle.constructMerkleProof(restUrl, dapiAttestResultTransaction, contractAddress);
//  console.log('express proof', proof);
//  res.set('Content-Type', 'application/json');

  res.send(proof);
//  res.send('{"message": "test from the custom server!"}');

  });

  app.post('/verify', async function (req, res) {
		console.log("test--------------------------------------------------");
    const result = await verify(req.body.claimSerialized);
    res.send(result);
  });

  app.post('/verify/verifyExpiration', async function (req, res) {
    console.log('/verify/verifyExpiration');
    const result = await verifyExpiration(req.body.claimSerialized);
    console.log('/verify/verifyExpiration result', result);
    res.send(result);
  });

  app.post('/verify/verifyKeyOwnership', async function (req, res) {
    const result = await verifyKeyOwnership(req.body.claimSerialized);
    res.send(result);
  });

  app.post('/verify/verifyNotRevoked', async function (req, res) {
    const result = await verifyNotRevoked(req.body.claimSerialized);
    res.send(result);
  });

  app.post('/verify/verifySignature', async function (req, res) {
    const result = await verifySignature(req.body.claimSerialized);
    res.send(result);
  });

  app.post('/verify/verifyMatchingClaimId', async function (req, res) {
    const result = await verifyMatchingClaimId(req.body.claimSerialized);
    res.send(result);
  });

  app.post('/verify/verifyAttestStatus', async function (req, res) {
    const result = await verifyAttestStatus(req.body.claimSerialized);
    res.send(result);
  });

	app.post('/identity/getDDO', async function (req, res) {
		console.log('req.body', req.body);
    const result = await getDDO(req.body.identity);
    res.send(result);
  });

	app.post('/identity/getDocument', async function (req, res) {
		console.log('req.body', req.body);
    const result = await getDocument(req.body.identity);
    res.send(result);
  });

	app.post('/identity/addAttributes', async function (req, res) {
		console.log('req.body', req.body);
    const result = await addAttributes(req.body.identity, req.body.payerAddress, req.body.attributes);
    res.send(result);
  });

	app.post('/identity/getAttributes', async function (req, res) {
		console.log('req.body', req.body);
		const result = await getAttributes(req.body.identity);
		res.send(result);
	});

	app.post('/identity/registerOntId', async function (req, res) {
		console.log('req.body', req.body);
		const result = await registerOntId();
		res.send(result);
	});


	app.post('/identity/regIdWithAttributes', async function (req, res) {
		console.log('req.body', req.body);
	  const result = await regIdWithAttributes(req.body.attributes);
	  res.send(result);
	});

	app.post('/identity/removeAttribute', async function (req, res) {
		console.log('req.body', req.body);
	  const result = await removeAttribute();
	  res.send(result);
	});

  app.use(express.static(path.resolve(__dirname, '../client/public')));

  // All remaining requests return the React app, so it can handle routing.
  app.get('*', function(request, response) {
    response.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });

  app.listen(PORT, function () {
    console.error(`Node ${isDev ? 'dev server' : 'cluster worker '+process.pid}: listening on port ${PORT}`);
  });
}
