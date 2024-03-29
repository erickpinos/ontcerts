import Airtable from 'airtable';

const API_KEY = process.env.REACT_APP_AIRTABLE_API_KEY;

const BASE_ID_ONTCERTS = 'app9EPqqBKTlihZgU';

export const AirtableOntCerts = new Airtable({ apiKey: API_KEY }).base(BASE_ID_ONTCERTS);

export async function getIssuerByAccount(account) {
  const result = await AirtableOntCerts('Issuers').select({
    filterByFormula: `{account} = '${account}'`,
  }).all();

  return result[0];
}
