import { client } from 'ontology-dapi';

client.registerClient({});

export async function getAccount() {
  try {
    const result = await client.api.asset.getAccount();
    console.log('utils/ontology.js getAccount', result);
    return result;
  } catch(e) {
    console.log(e);
  }
}
