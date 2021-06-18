import React from "react";

const PetList = ({ buyPet, deletePet, petList, account }) => {
  return (
    <div className="flex-container">
      {petList.map((petList, index) => (
        <div key={index} className="petList">
          <p id="petName">
            <b>{petList.name}</b>
          </p>
          <img src={petList.image} width="250" height="250" />
          <p>
            <b>Age: </b>
            {petList.age}
          </p>
          <p>
            <b>Breed: </b>
            {petList.breed}
          </p>
          <p>
            <b>Location: </b>
            {petList.location}
          </p>
          <p>
            <b>Price: </b>
            {petList.price}
          </p>
          <p id={petList.forSale ? "available" : "unavailable"}>
            <b>Availability: </b>
            {petList.availability}
          </p>
          <a href={`https://etherscan.io/address/${petList.owner}`}>
            Owner Address
          </a>
          {petList.owner !== account && petList.forSale === true ? (
            <button id={petList.tokenID} onClick={buyPet}>
              Buy
            </button>
          ) : null}
          {petList.owner === account ? (
            <button id={petList.tokenID} onClick={deletePet}>
              Delete
            </button>
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default PetList;
