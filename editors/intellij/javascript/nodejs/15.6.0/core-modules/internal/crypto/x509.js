'use strict';

const {
  ObjectSetPrototypeOf,
  SafeMap,
  Symbol,
} = primordials;

const {
  parseX509,
  X509_CHECK_FLAG_ALWAYS_CHECK_SUBJECT,
  X509_CHECK_FLAG_NEVER_CHECK_SUBJECT,
  X509_CHECK_FLAG_NO_WILDCARDS,
  X509_CHECK_FLAG_NO_PARTIAL_WILDCARDS,
  X509_CHECK_FLAG_MULTI_LABEL_WILDCARDS,
  X509_CHECK_FLAG_SINGLE_LABEL_SUBDOMAINS,
} = internalBinding('crypto');

const {
  PublicKeyObject,
  isKeyObject,
} = require('internal/crypto/keys');

const {
  customInspectSymbol: kInspect,
} = require('internal/util');

const {
  validateBoolean,
  validateObject,
  validateString,
} = require('internal/validators');

const { inspect } = require('internal/util/inspect');

const { Buffer } = require('buffer');

const {
  isArrayBufferView,
} = require('internal/util/types');

const {
  codes: {
    ERR_INVALID_ARG_TYPE,
    ERR_INVALID_ARG_VALUE,
  }
} = require('internal/errors');

const {
  JSTransferable,
  kClone,
  kDeserialize,
} = require('internal/worker/js_transferable');

const {
  kHandle,
} = require('internal/crypto/util');

const kInternalState = Symbol('kInternalState');

function isX509Certificate(value) {
  return value[kInternalState] !== undefined;
}

function getFlags(options = {}) {
  validateObject(options, 'options');
  const {
    subject = 'always',  // Can be 'always' or 'never'
    wildcards = true,
    partialWildcards = true,
    multiLabelWildcards = false,
    singleLabelSubdomains = false,
  } = { ...options };
  let flags = 0;
  validateString(subject, 'options.subject');
  validateBoolean(wildcards, 'options.wildcards');
  validateBoolean(partialWildcards, 'options.partialWildcards');
  validateBoolean(multiLabelWildcards, 'options.multiLabelWildcards');
  validateBoolean(singleLabelSubdomains, 'options.singleLabelSubdomains');
  switch (subject) {
    case 'always': flags |= X509_CHECK_FLAG_ALWAYS_CHECK_SUBJECT; break;
    case 'never': flags |= X509_CHECK_FLAG_NEVER_CHECK_SUBJECT; break;
    default:
      throw new ERR_INVALID_ARG_VALUE('options.subject', subject);
  }
  if (!wildcards) flags |= X509_CHECK_FLAG_NO_WILDCARDS;
  if (!partialWildcards) flags |= X509_CHECK_FLAG_NO_PARTIAL_WILDCARDS;
  if (multiLabelWildcards) flags |= X509_CHECK_FLAG_MULTI_LABEL_WILDCARDS;
  if (singleLabelSubdomains) flags |= X509_CHECK_FLAG_SINGLE_LABEL_SUBDOMAINS;
  return flags;
}

class X509Certificate extends JSTransferable {
  [kInternalState] = new SafeMap();

  constructor(buffer) {
    if (typeof buffer === 'string')
      buffer = Buffer.from(buffer);
    if (!isArrayBufferView(buffer)) {
      throw new ERR_INVALID_ARG_TYPE(
        'buffer',
        ['string', 'Buffer', 'TypedArray', 'DataView'],
        buffer);
    }
    super();
    this[kHandle] = parseX509(buffer);
  }

  [kInspect](depth, options) {
    if (depth < 0)
      return this;

    const opts = {
      ...options,
      depth: options.depth == null ? null : options.depth - 1
    };

    return `X509Certificate ${inspect({
      subject: this.subject,
      subjectAltName: this.subjectAltName,
      issuer: this.issuer,
      infoAccess: this.infoAccess,
      validFrom: this.validFrom,
      validTo: this.validTo,
      fingerprint: this.fingerprint,
      fingerprint256: this.fingerprint256,
      keyUsage: this.keyUsage,
      serialNumber: this.serialNumber,
    }, opts)}`;
  }

  [kClone]() {
    const handle = this[kHandle];
    return {
      data: { handle },
      deserializeInfo: 'internal/crypto/x509:InternalX509Certificate'
    };
  }

  [kDeserialize]({ handle }) {
    this[kHandle] = handle;
  }

  get subject() {
    let value = this[kInternalState].get('subject');
    if (value === undefined) {
      value = this[kHandle].subject();
      this[kInternalState].set('subject', value);
    }
    return value;
  }

  get subjectAltName() {
    let value = this[kInternalState].get('subjectAltName');
    if (value === undefined) {
      value = this[kHandle].subjectAltName();
      this[kInternalState].set('subjectAltName', value);
    }
    return value;
  }

  get issuer() {
    let value = this[kInternalState].get('issuer');
    if (value === undefined) {
      value = this[kHandle].issuer();
      this[kInternalState].set('issuer', value);
    }
    return value;
  }

  get infoAccess() {
    let value = this[kInternalState].get('infoAccess');
    if (value === undefined) {
      value = this[kHandle].infoAccess();
      this[kInternalState].set('infoAccess', value);
    }
    return value;
  }

  get validFrom() {
    let value = this[kInternalState].get('validFrom');
    if (value === undefined) {
      value = this[kHandle].validFrom();
      this[kInternalState].set('validFrom', value);
    }
    return value;
  }

  get validTo() {
    let value = this[kInternalState].get('validTo');
    if (value === undefined) {
      value = this[kHandle].validTo();
      this[kInternalState].set('validTo', value);
    }
    return value;
  }

  get fingerprint() {
    let value = this[kInternalState].get('fingerprint');
    if (value === undefined) {
      value = this[kHandle].fingerprint();
      this[kInternalState].set('fingerprint', value);
    }
    return value;
  }

  get fingerprint256() {
    let value = this[kInternalState].get('fingerprint256');
    if (value === undefined) {
      value = this[kHandle].fingerprint256();
      this[kInternalState].set('fingerprint256', value);
    }
    return value;
  }

  get keyUsage() {
    let value = this[kInternalState].get('keyUsage');
    if (value === undefined) {
      value = this[kHandle].keyUsage();
      this[kInternalState].set('keyUsage', value);
    }
    return value;
  }

  get serialNumber() {
    let value = this[kInternalState].get('serialNumber');
    if (value === undefined) {
      value = this[kHandle].serialNumber();
      this[kInternalState].set('serialNumber', value);
    }
    return value;
  }

  get raw() {
    let value = this[kInternalState].get('raw');
    if (value === undefined) {
      value = this[kHandle].raw();
      this[kInternalState].set('raw', value);
    }
    return value;
  }

  get publicKey() {
    let value = this[kInternalState].get('publicKey');
    if (value === undefined) {
      value = new PublicKeyObject(this[kHandle].publicKey());
      this[kInternalState].set('publicKey', value);
    }
    return value;
  }

  toString() {
    let value = this[kInternalState].get('pem');
    if (value === undefined) {
      value = this[kHandle].pem();
      this[kInternalState].set('pem', value);
    }
    return value;
  }

  // There's no standardized JSON encoding for X509 certs so we
  // fallback to providing the PEM encoding as a string.
  toJSON() { return this.toString(); }

  get ca() {
    let value = this[kInternalState].get('ca');
    if (value === undefined) {
      value = this[kHandle].checkCA();
      this[kInternalState].set('ca', value);
    }
    return value;
  }

  checkHost(name, options) {
    validateString(name, 'name');
    return this[kHandle].checkHost(name, getFlags(options));
  }

  checkEmail(email, options) {
    validateString(email, 'email');
    return this[kHandle].checkEmail(email, getFlags(options));
  }

  checkIP(ip, options) {
    validateString(ip, 'ip');
    return this[kHandle].checkIP(ip, getFlags(options));
  }

  checkIssued(otherCert) {
    if (!isX509Certificate(otherCert))
      throw new ERR_INVALID_ARG_TYPE('otherCert', 'X509Certificate', otherCert);
    return this[kHandle].checkIssued(otherCert[kHandle]);
  }

  checkPrivateKey(pkey) {
    if (!isKeyObject(pkey))
      throw new ERR_INVALID_ARG_TYPE('pkey', 'KeyObject', pkey);
    if (pkey.type !== 'private')
      throw new ERR_INVALID_ARG_VALUE('pkey', pkey);
    return this[kHandle].checkPrivateKey(pkey[kHandle]);
  }

  verify(pkey) {
    if (!isKeyObject(pkey))
      throw new ERR_INVALID_ARG_TYPE('pkey', 'KeyObject', pkey);
    if (pkey.type !== 'public')
      throw new ERR_INVALID_ARG_VALUE('pkey', pkey);
    return this[kHandle].verify(pkey[kHandle]);
  }

  toLegacyObject() {
    return this[kHandle].toLegacy();
  }
}

class InternalX509Certificate extends JSTransferable {
  [kInternalState] = new SafeMap();

  constructor(handle) {
    super();
    this[kHandle] = handle;
  }
}

InternalX509Certificate.prototype.constructor = X509Certificate;
ObjectSetPrototypeOf(
  InternalX509Certificate.prototype,
  X509Certificate.prototype);

module.exports = {
  X509Certificate,
  InternalX509Certificate,
  isX509Certificate,
};