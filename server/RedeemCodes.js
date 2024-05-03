class RedeemCodes {
  constructor() {
    this.codes = {};
  }

  generate(clientId, type) {
    const code = crypto.randomUUID();
    this.codes[code] = { clientId, type };
    return code;
  }

  redeem(code) {
    if (Object.keys(this.codes).includes(code)) {
      const obj = this.codes[code];
      delete this.codes[code];
      return obj;
    }
    return null;
  }
}

module.exports = RedeemCodes;
