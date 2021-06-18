import React from "react";

const Warning = ({ network }) => {
  return (
    <div id="warning">
      {network ? (
        <div>
          You are on the {network} network. To use this Dapp, please switch to
          Ropsten network.
        </div>
      ) : null}
    </div>
  );
};

export default Warning;
