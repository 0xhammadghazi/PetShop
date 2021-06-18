import React from "react";

import "./App.css";
import Web3 from "web3";
import { useState } from "react";
import ipfs from "./ipfs";
import PetShopContract from "./contracts/PetShop.json";

import Admin from "./components/Admin";
import PetList from "./components/PetList";
import Header from "./components/Header";
import Warning from "./components/Warning";

let web3;
let contract;
let account;
let petArray = [];
const petShopAddress = "0x2Ca1624acA2E4dba1c792c367AA3DB38bcF78A61";
function App() {
  var imageBuffer;
  const [petList, setPetList] = useState([]);
  const [contractOwner, setContractOwner] = useState(null);
  const [network, setNetwork] = useState(null);

  //setting web3 provider on page load
  window.addEventListener("load", async () => {
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.enable();
        loadBlockchainData();
      } catch (error) {
        if (error.code === 4001) {
          alert("Request to access account denied!");
        }
      }
    } else if (window.web3) {
      web3 = new Web3(window.web3.currentProvider);
      loadBlockchainData();
    } else {
      alert(
        "Please install an Ethereum-compatible browser or extension like MetaMask to use this dApp!"
      );
    }
  });

  //below event will be fired by metamask whenever user will change it's metamask account
  window.ethereum.on("accountsChanged", function () {
    window.location.reload();
  });

  // detect Network account change
  window.ethereum.on("networkChanged", function () {
    window.location.reload();
  });

  async function loadBlockchainData() {
    let network = await web3.eth.net.getNetworkType();
    //If network is not ropsten then alert user and don't query/fetch data from blockchain
    if (network !== "ropsten") {
      //to convert first letter of network into Upper case
      network =
        network.charAt(0).toUpperCase() + network.substr(1).toLowerCase();
      setNetwork(network);
    } else {
      contract = new web3.eth.Contract(PetShopContract.abi, petShopAddress);
      account = await web3.eth.getAccounts();
      account = account[0];
      setContractOwner(await contract.methods._owner().call());
      let totalSupply = await contract.methods.totalSupply().call();
      for (let i = 0; i <= totalSupply; i++) {
        try {
          //here i=token id in smart contract
          await getPetData(i);
        } catch {
          //if token id doesn't exist
        }
      }
      setPetList([...petArray]);
    }
  }

  async function getPetData(tokenId) {
    let uri = await contract.methods.tokenURI(tokenId).call();
    let response = await fetch(uri); //fetching json data from ipfs
    let responseText = await response.text();
    //converting text into an object
    let responseObj = JSON.parse(responseText);

    //adding new properties in response object
    let price = await contract.methods.tokenPrice(tokenId).call();
    price = web3.utils.fromWei(price, "ether"); //converting price from wei to ether
    responseObj.price = price + " Ether";
    responseObj.owner = await contract.methods.ownerOf(tokenId).call();
    responseObj.forSale = await contract.methods.tokenAvailable(tokenId).call();
    responseObj.tokenID = tokenId;
    if (responseObj.forSale) {
      responseObj.availability = "In Stock";
    } else {
      responseObj.availability = "SOLD OUT";
    }
    petArray.push(responseObj);
  }

  function captureImage(event) {
    event.preventDefault();
    const image = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(image); //Read Provided File
    reader.onloadend = () => {
      //onloadend is triggered when the read operation is finished
      imageBuffer = Buffer(reader.result); //Convert data into buffer
    };
  }

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const imageObject = await ipfs.add(imageBuffer); // Upload buffer to IPFS, it returns an object
      const imageHash = `https://ipfs.infura.io/ipfs/${imageObject.path}`; //path property contains IPFS CID
      const metaData = {
        name: document.getElementById("name").value,
        age: document.getElementById("age").value,
        breed: document.getElementById("breed").value,
        location: document.getElementById("location").value,
        image: imageHash,
      };
      const metaDataObject = await ipfs.add(JSON.stringify(metaData)); //Upload JSON to IPFS, returns an object.
      const metaDataHash = metaDataObject.path; //path property contains IPFS CID

      //now calling smart contract function
      await contract.methods
        .createPet(
          document.getElementById("mintAddress").value,
          document.getElementById("price").value,
          metaDataHash //metaDataHash contains IPFS JSON CID, which servers as a uri for our token
        )
        .send({
          from: account,
        });
      let tokenID = await contract.methods.totalSupply().call();
      document.getElementById("form").reset();
      await getPetData(tokenID);
      setPetList([...petArray]);
    } catch {
      document.getElementById("form").reset();
      alert("Operation Failed! Try Again");
    }
  }

  async function buyPet(e) {
    try {
      let tokenID = e.target.id;
      let price = await contract.methods.tokenPrice(tokenID).call();
      await contract.methods.buyPet(tokenID).send({
        from: account,
        value: price,
      });
      for (let i = 0; i < petArray.length; i++) {
        if (petArray[i].tokenID == tokenID) {
          petArray[i].owner = account;
          petArray[i].forSale = false;
          petArray[i].availability = "SOLD OUT";
          break;
        }
      }
      setPetList([...petArray]);
    } catch {
      alert("Transaction Failed! Try Again");
    }
  }

  async function deletePet(e) {
    try {
      let tokenID = e.target.id;
      await contract.methods.deletePet(tokenID).send({
        from: account,
      });
      for (let i = 0; i < petArray.length; i++) {
        if (petArray[i].tokenID == tokenID) {
          petArray.splice(i, 1);
          break;
        }
      }
      setPetList([...petArray]);
    } catch {
      alert("Operation Failed! Try Again");
    }
  }

  return (
    <div className="App">
      <Header />
      <Warning network={network} />
      {contractOwner === account ? (
        <Admin handleSubmit={onSubmit} uploadImage={captureImage} />
      ) : null}
      <PetList
        buyPet={buyPet}
        deletePet={deletePet}
        petList={petList}
        account={account}
      />
    </div>
  );
}

export default App;
