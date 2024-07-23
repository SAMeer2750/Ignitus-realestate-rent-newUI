import { useState, useEffect } from 'react';
import axios from "axios";
import { ethers } from "ethers";
import Modal from './Modal.jsx';
import './Home.css'
import DotLoader from 'react-spinners/DotLoader';

const Home = ({ factoryContract, tokenAbi, isConnected, account, signer, provider, network }) => {
  const [nfts, setNfts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (factoryContract) {
    console.log("rdtcfyvgbuhinjokml,")
      getAllTokenContracts();
    }
  }, [factoryContract, isConnected, account]);

  useEffect(() => {
    fetchNFTs();
  }, [collections]);

  const getAllTokenContracts = async () => {
    setIsLoading(true);
    const tx = await factoryContract.getAllProperty();
    setCollections(tx);
    setIsLoading(false);
  };

  const getTokenInstance= async (tokenAddress)=>{
    const tokenInstance = new ethers.Contract(
        tokenAddress,
        tokenAbi,
        signer
      );
    return tokenInstance;
  }

  const fetchNFTMetadata = async (tokenURI) => {
    try {
      const response = await axios.get(`https://ipfs.io/ipfs/${tokenURI}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching NFT metadata:", error);
      return null;
    }
  };

  const fetchNFTs = async () => {
    if (collections.length > 0 ) {
      await fetchNFTDetails();
    }
  };

  const fetchNFTDetails = async () => {
    setIsLoading(true);

    const updatedNFTs = await Promise.all(
      collections.map(async (address,index)=>{
          const tokenInstance = await getTokenInstance(address)
          const uri = await tokenInstance.getBaseURI();
          const metadata = await fetchNFTMetadata(uri);
          return {metadata,address};
      })
    )

    console.log("Updated NFTs:", updatedNFTs);
    setNfts(updatedNFTs);
    setIsLoading(false);
  };

  return (
    <>
      <div className="flex justify-center min-h-screen">
        {nfts.length > 0 ? (
          <div className="container mx-auto mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">                {nfts.map((nft, index) => (
              <div key={index} className="bg-gray-100 rounded-lg shadow-md dark:bg-gray-800 hover:transform hover:scale-105 transition-transform duration-300">
                <img
                  className="rounded-t-lg object-cover w-full h-56"
                  src={`https://ipfs.io/ipfs/${nft.metadata.imageCID}`}
                  alt="flower"
                />
                <div className="p-4">
                  <div className="card1">
                    <h5 className="text-xl font-semibold text-blue-600 dark:text-blue-400">{nft.metadata.name.toString()}</h5>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 tokenSymbol">
                      #{nft.metadata.symbol.toString()}
                    </p>
                  </div> 

                <h6 className="text-blue-300 dark:text-blue-300 add"><small>{nft.address.toString().slice(0, 6)+"..."+nft.address.toString().slice(38, 42)}</small></h6>

                <p className="mt-2 text-md text-gray-600 dark:text-gray-400 fraction">
                  {nft.metadata.totalSupply.toString()} Fractions
                </p>

                <button onClick={()=>setSelectedNFT(nft)} className="mt-4 w-full px-4 py-2 text-sm font-medium leading-5 text-white transition-transform transform duration-300 bg-gradient-to-r from-blue-500 to-purple-600 border border-transparent rounded-lg shadow-lg hover:scale-105 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300">
                View
                <svg  
                className="rtl:rotate-180 w-4 h-4 inline-block ml-2 -mt-px"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 14 10"
                fill="none"
                >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
                </svg>
                </button>
              </div>
            </div>
          ))}
            </div>
          </div>
          ) : (
            <main className="container mx-auto mt-8">
              <h2 className="text-center text-xl font-semibold text-gray-800 dark:text-white">Loading.....</h2>
            </main>
          )}
        </div>
        {selectedNFT && (
        <Modal 
          nft={selectedNFT}
          onClose={() => setSelectedNFT(null)} 
          factoryContract={factoryContract}
          network={network}
          account={account}
          tokenAbi={tokenAbi}
          signer={signer}
          provider={provider}
        />
      )}
    </>
  );
};

export default Home;