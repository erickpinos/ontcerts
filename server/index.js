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
  console.log('express proof', proof);
//  res.set('Content-Type', 'application/json');

  res.send(proof);
//  res.send('{"message": "test from the custom server!"}');

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
