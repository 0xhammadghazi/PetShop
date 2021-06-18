import React from "react";

const Admin = ({ handleSubmit, uploadImage }) => {
  return (
    <form id="form" onSubmit={handleSubmit}>
      <h3>Create Pet</h3>
      <input placeholder="Pet Name" type="text" id="name" required />
      <input placeholder="Pet Age" type="text" id="age" required />
      <input placeholder="Pet Breed" type="text" id="breed" required />
      <input placeholder="Pet Location" type="text" id="location" required />
      <input placeholder="Pet Price" type="text" id="price" required />
      <input placeholder="Mint Address" type="text" id="mintAddress" required />
      <input id="uploadInput" type="file" onChange={uploadImage} required />
      <button>Create</button>
      <hr />
    </form>
  );
};

export default Admin;
