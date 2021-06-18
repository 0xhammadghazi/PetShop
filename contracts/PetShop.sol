// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract PetShop is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint256 public totalSupply;

    string private _baseTokenURI;
    address public _owner;

    //to store token price
    mapping(uint256 => uint256) public tokenPrice;

    //whether token is up for sale or no
    mapping(uint256 => bool) public tokenAvailable;

    constructor(
        string memory name_,
        string memory symbol_,
        string memory baseURI_
    ) ERC721(name_, symbol_) {
        _owner = msg.sender;
        _baseTokenURI = baseURI_;
    }

    modifier onlyOwner() {
        require(_owner == msg.sender, "Access Denied!");
        _;
    }

    receive() external payable {
        revert();
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function createPet(
        address to_,
        uint256 price_,
        string memory tokenURI_
    ) public onlyOwner returns (uint256) {
        //id of first ever token would be 0
        uint256 newTokenId = _tokenIds.current();
        totalSupply = _tokenIds.current();

        _safeMint(to_, newTokenId);
        _setTokenURI(newTokenId, tokenURI_);

        //setting token price
        tokenPrice[newTokenId] = price_;

        tokenAvailable[newTokenId] = true;
        _tokenIds.increment();
        return newTokenId;
    }

    function buyPet(uint256 tokenId_) public payable {
        require(_exists(tokenId_), "No such token exists");
        require(msg.value == tokenPrice[tokenId_], "Invalid amount");
        require(tokenAvailable[tokenId_], "Not for sale");

        // transfer funds to owner
        payable(ownerOf(tokenId_)).transfer(msg.value);

        // transfer pet to new user (clears approvals too)
        _safeTransfer(
            ownerOf(tokenId_),
            msg.sender,
            tokenId_,
            "Congratulations"
        );
        tokenAvailable[tokenId_] = false;
    }

    function deletePet(uint256 tokenId_) public virtual returns (uint256) {
        // burn tokenId
        _burn(tokenId_);

        // deleted tokenId
        return tokenId_;
    }
}
