const NodeCache = require("node-cache");
const blacklist = new NodeCache({ stdTTL: 3600 }); // Token expire dans 1h

exports.addToBlacklist = (token) => {
  blacklist.set(token, true);
};

exports.isBlacklisted = (token) => {
  return blacklist.has(token);
};

exports.addToBlacklist = (token) => {
    console.log("🛑 Token ajouté à la blacklist :", token);
    blacklist.set(token, true);
  };
  