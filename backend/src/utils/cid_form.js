// src/utils/cid_form.js
// require('dotenv').config();
const axios = require('axios');

async function uploadJsonToPinata(jsonObject) {
  const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';

  const pinataApiKey = process.env.PINATA_API_KEY;
  const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY;

  try {
    const response = await axios.post(url, jsonObject, {
      headers: {
        'pinata_api_key': pinataApiKey,
        'pinata_secret_api_key': pinataSecretApiKey,
      },
    });

    const cid = response?.data?.IpfsHash;
    if (!cid) {
      // provide a clear error if response shape is unexpected
      throw new Error('Pinata response missing IpfsHash');
    }

    // console.log('Uploaded to Pinata. CID:', cid);
    return cid;
  } catch (error) {
    // log helpful, small message in tests and CI
    console.error('Error uploading to Pinata:', error && error.message ? error.message : error);
    throw error;
  }
}

module.exports = { uploadJsonToPinata };
