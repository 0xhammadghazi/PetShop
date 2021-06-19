# Pet Shop
* [Pet Shop Dapp](https://pippetshop.surge.sh/) is a decentralized application, built over Ethereum blockchain. 
* Each pet is a NFT i.e. unique. Token standard used is ERC-721.
* IPFS is used to store ERC-721 (Pet's) metadata (image and other data).
* The frontend of the Pet Shop Dapp is built using React.

##  How it works:

* Only contract creator can create/mint new pet/nft. Pet's metadata will be created and pushed to IPFS on the fly. Upon creation, pet will be available for purchase.
* User can buy pet against ether. Once a pet is purchased, it is marked as sold, and, it can not be resold then. Since, it's a shop, not a market place.
* Pet owner can delete his/her pet if they wish. Upon deletion, it will be burned.

## Important Information:
* Install the metamask plugin or use a Wallet-enabled browser such as Brave.
* Create an account on Ropsten Test Network in order to interact with the Pet Shop Dapp.
