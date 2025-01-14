import Navbar from "./Navbar";
import NFTTile from "./NFTTile";
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState } from "react";
import { GetIpfsUrlFromPinata } from "../utils";

export default function Marketplace() {
const sampleData = [
    {
        "name": "NFT#1",
        "description": "Vidit's First NFT",
        "website":"http://axieinfinity.io",
        "image":"https://white-crude-albatross-877.mypinata.cloud/files/bafybeiaf5wbl47fec67mmlky2xk6z63wthwrhw2hgf3u2cfngnof7ucjuy?X-Algorithm=PINATA1&X-Date=1735396641&X-Expires=30&X-Method=GET&X-Signature=194edd0a8c2ef6a6cd6ed8db994a454734caadee8e2a1a86d50244f48e3ab86d",
        "price":"0.03ETH",
        "currentlySelling":"True",
        "address":"0xe81Bf5A757CB4f7F82a2F23b1e59bE45c33c5b13",
    },
    {
        "name": "NFT#2",
        "description": "Vidit's Second NFT",
        "website":"http://axieinfinity.io",
        "image":"https://white-crude-albatross-877.mypinata.cloud/files/bafkreigtij3mwg6o2472qxsmcvvuyldtb5oszm3peo7oufbnprojcoj37y?X-Algorithm=PINATA1&X-Date=1735396277&X-Expires=30&X-Method=GET&X-Signature=3f5fb7106a167ffb1a96dc44a8e0ecccb0965d4b409eb7943fb53fdb10a7d5e2" ,//https://gateway.pinata.cloud/ipfs/QmdhoL9K8my2vi3fej97foiqGmJ389SMs55oC5EdkrxF2M",
        "price":"0.03ETH",
        "currentlySelling":"True",
        "address":"0xe81Bf5A757C4f7F82a2F23b1e59bE45c33c5b13",
    },
    {
        "name": "NFT#3",
        "description": "Vidit's Third NFT",
        "website":"http://axieinfinity.io",
        "image":"https://white-crude-albatross-877.mypinata.cloud/files/bafkreiacpxuowuwrmqzyiruk5iwfjbfnozjtpp464opuiqx34rlhwuifii?X-Algorithm=PINATA1&X-Date=1735412494&X-Expires=30&X-Method=GET&X-Signature=bb4ccd06c396517c43a4bac3c504d593cdbd4d8e8cf828ff2b66f93e2459fa3a",
        "price":"0.03ETH",
        "currentlySelling":"True",
        "address":"0xe81Bf5A757C4f7F82a2F23b1e59bE45c33c5b13",
    },
    {
        "name": "NFT#4",
        "description": "Vidit's fourth NFT",
        "website":"http://axieinfinity.io",
        "image":"https://white-crude-albatross-877.mypinata.cloud/files/bafybeiafe6v6lpttl5onyfizx63tho2r5ttyeyodul2dqmoyksrgkwuwym?X-Algorithm=PINATA1&X-Date=1735397173&X-Expires=30&X-Method=GET&X-Signature=877d0110c7d73fbfe8478d95567910738fbf16003c408d4c9ee1e227a7a5b267",
        "price":"0.03ETH",
        "currentlySelling":"True",
        "address":"0xe81Bf5A757C4f7F82a2F23b1e59bE45c33c5b13",
    },
    {
        "name": "NFT#5",
        "description": "Vidit's fifth NFT",
        "website":"http://axieinfinity.io",
        "image":"https://white-crude-albatross-877.mypinata.cloud/files/bafkreiex4nrazv4cf6pljihoz6ikw5b3mvnlsgfqu3qkmfsufope3wnnem?X-Algorithm=PINATA1&X-Date=1735397209&X-Expires=30&X-Method=GET&X-Signature=c60520f0370e5def609e5583f86b1b251287b6a0cc3bbad1e126f1925a6903a8",
        "price":"0.03ETH",
        "currentlySelling":"True",
        "address":"0xe81Bf5A757C4f7F82a2F23b1e59bE45c33c5b13",
    },
    {
        "name": "NFT#6",
        "description": "Vidit's sixth NFT",
        "website":"http://axieinfinity.io",
        "image":"https://white-crude-albatross-877.mypinata.cloud/files/bafkreiadwo4zuf7b4xvadl24k5bhykjwa5uf5qkovxsczdugjanxeckvgi?X-Algorithm=PINATA1&X-Date=1735397242&X-Expires=30&X-Method=GET&X-Signature=d8d7ebc688e0890f6df6136d01ccde9010864fc58cfb7f4c533aa6d6b893ce70",
        "price":"0.03ETH",
        "currentlySelling":"True",
        "address":"0xe81Bf5A757C4f7F82a2F23b1e59bE45c33c5b13",
    }
];
const [data, updateData] = useState(sampleData);
const [dataFetched, updateFetched] = useState(false);

async function getAllNFTs() {
    const ethers = require("ethers");
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    //Pull the deployed contract instance
    let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)
    //create an NFT Token
    let transaction = await contract.getAllNFTs()

    //Fetch all the details of every NFT from the contract and display
    const items = await Promise.all(transaction.map(async i => {
        var tokenURI = await contract.tokenURI(i.tokenId);
        console.log("getting this tokenUri", tokenURI);
        tokenURI = GetIpfsUrlFromPinata(tokenURI);
        let meta = await axios.get(tokenURI);
        meta = meta.data;

        let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
        let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.image,
            name: meta.name,
            description: meta.description,
        }
        return item;
    }))

    updateFetched(true);
    updateData(items);
}

if(!dataFetched)
    getAllNFTs();

return (
    <div>
        <Navbar></Navbar>
        <div className="flex flex-col place-items-center mt-20">
            <div className="md:text-xl font-bold text-white">
                Top NFTs
            </div>
            <div className="flex mt-5 justify-between flex-wrap max-w-screen-xl text-center">
                {data.map((value, index) => {
                    return <NFTTile data={value} key={index}></NFTTile>;
                })}
            </div>
        </div>            
    </div>
);

}