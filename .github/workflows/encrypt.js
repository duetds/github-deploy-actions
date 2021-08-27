/**
 * DUET ENCRYPTION CONFIGURATION
 */
const CryptoJS = require('crypto-js');
const Yargs = require('yargs');
const replace = require('replace-in-file');
const namedArgs = Yargs.usage(
  'Usage: node ./.github/workflows/encrypt.js $DUET_TOKEN <passphrase>'
).argv;
const contents = namedArgs._[0].toString();
const password = namedArgs._[1].toString();

/**
 * Salt and encrypt prototype contents with a password.
 * Inspired by https://github.com/adonespitogo
 */
var keySize = 256;
var iterations = 1000;

function encrypt(msg, password) {
  var salt = CryptoJS.lib.WordArray.random(128 / 8);
  var key = CryptoJS.PBKDF2(password, salt, {
    keySize: keySize / 32,
    iterations: iterations
  });

  var iv = CryptoJS.lib.WordArray.random(128 / 8);
  var encrypted = CryptoJS.AES.encrypt(msg, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC
  });

  // Salt, iv will be hex 32 in length.
  // Append them to the ciphertext for use in decryption.
  var encryptedMsg = salt.toString() + iv.toString() + encrypted.toString();
  return encryptedMsg;
}

// Encrypt input.
var encrypted = encrypt(contents, password);
var hmac = CryptoJS.HmacSHA256(
  encrypted,
  CryptoJS.SHA256(password).toString()
).toString();
var encryptedMessage = hmac + encrypted;

// Set options for search and replace.
const options = {
  files: './dist/index.html',
  from: /{{DUET_TOKEN}}/g,
  to: encryptedMessage
};

// Finally replace variables with encrypted strings.
try {
  const results = replace.sync(options);
} catch (error) {
  console.error('Error encrypting Duet prototype', error);
}
