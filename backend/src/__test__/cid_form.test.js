// src/__test__/cid_form.test.js
jest.mock('axios'); // must be top-level so jest will mock axios
const axios = require('axios');

describe('uploadJsonToPinata', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    // clear module cache so require() will re-run the module with the currently-configured mocks
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
    process.env.PINATA_API_KEY = 'test-api-key';
    process.env.PINATA_SECRET_API_KEY = 'test-secret-key';
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  test('should upload JSON and return IpfsHash and log CID', async () => {
    // 1) configure axios mock BEFORE requiring the module
    const fakeCid = 'QmTestCid123';
    axios.post.mockResolvedValue({ data: { IpfsHash: fakeCid } });

    // 2) require module after setting mock so it sees the mocked axios
    const { uploadJsonToPinata } = require('../utils/cid_form');

    // spy on console.log
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    const payload = { name: 'test' };
    const result = await uploadJsonToPinata(payload);

    expect(result).toBe(fakeCid);
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(consoleLogSpy).toHaveBeenCalledWith('Uploaded to Pinata. CID:', fakeCid);

    consoleLogSpy.mockRestore();
  });

  test('should throw when axios.post rejects and log error', async () => {
    // configure axios to reject BEFORE requiring the module
    const fakeError = new Error('network failure');
    axios.post.mockRejectedValue(fakeError);

    const { uploadJsonToPinata } = require('../utils/cid_form');

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const payload = { name: 'test' };

    await expect(uploadJsonToPinata(payload)).rejects.toThrow('network failure');
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error uploading to Pinata:', 'network failure');

    consoleErrorSpy.mockRestore();
  });
});
