const { create } = require("ipfs-http-client");
const ipfs = create({ host: "ipfs.infura.io", port: 5001, protocol: "https" }); // Connect to IPFS via INFURA

export default ipfs;
