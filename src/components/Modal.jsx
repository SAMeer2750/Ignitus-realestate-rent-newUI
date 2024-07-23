import './Modal.css'; // Create and style this CSS file as needed
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { ReactSVG } from "react-svg";
import polygonmatic from "../assests/polygon-matic.svg"
import ether from "../assests/ether-crypto.svg"
import DotLoader from 'react-spinners/DotLoader';

const Modal = ({ nft, onClose, factoryContract, network, account, tokenAbi, signer, provider }) => {

  const [isOwner, setIsOwner] = useState(false);
  const [id, setId] = useState();
  const [days, setDays] = useState();
  const [owner, setOwner] = useState("");
  const [rentRecord, setRentRecord] = useState([]);
  const [available, setAvailable] = useState(0);
  const [allRented, setAllRented] = useState(false)
  const [rentalStatus, setRentalStatus] = useState({});
  const [price, setPrice] = useState(0)
  const [ETHvalue, setETHvalue] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true);
    getOwnerOfCollection(nft.address)
    getRentRecord()
    getLatestPriceOfEthInUsd()
    setLoading(false);
  }, [account]);

  const getTokenInstance = async (tokenAddress)=>{
    const tokenInstance = new ethers.Contract(
        tokenAddress,
        tokenAbi,
        signer
      );
    return tokenInstance;
  }

  const getLatestPriceOfEthInUsd = async () => {
    const oneEthInUds = await factoryContract.getLatestPrice();
    setETHvalue(parseInt(oneEthInUds.toString()));
  }

  const getRentInEth = (e)=>{
    const x = (e * 1e8 * 1e18 )/ ETHvalue
    console.log(Math.round(x))
    return Math.round(x)
  } 

  const getRentRecord = async () => {
  const address = nft.address;
  const Rentrecord = [];
  const totalSupply = nft.metadata.totalSupply;
  let availableToken = 0;
  const rentalStatusTemp = {};

  const block = await provider.getBlock('latest');
  const blockTimestamp = block.timestamp;

  for (let id = 0; id < totalSupply; id++) {
    let data = await factoryContract.getRentRecord(address, id);
    if (data.rentedTime == 0) {
      availableToken++;
    } else {
      Rentrecord.push({ data, id });
      rentalStatusTemp[id] = data.rentedTime <= blockTimestamp ? 'Relist' : 'Rented';
    }
  }
  
  setRentRecord(Rentrecord);
  setRentalStatus(rentalStatusTemp);
  setAvailable(availableToken);
  if (availableToken == 0) {
    setAllRented(true);
  }
};

  const getOwnerOfCollection = async(tokenAddress)=>{
    const tokenInstance = await getTokenInstance(tokenAddress)
    const owner = await tokenInstance.ownerOf(0);
    if(owner === account){
      setIsOwner(true)
    }
    setOwner(owner)
  }

  const Rent = async()=>{
    const time = days * 86400
    let rentAmt;
    rentAmt = getRentInEth(price).toString()
    console.log(rentAmt);
    const tx = await factoryContract.rent(
      nft.address,
      id,
      time,
      { gasLimit: 300000, value: rentAmt }
    )
    await tx.wait();
    setDays("")
    setId("")
    getRentRecord()
    setPrice(0)
  }

  const Relist = async (id)=>{
    const tx = await factoryContract.relive(nft.address,id)
    await tx.wait();
    getRentRecord();
  }

  const convertTimestampToDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  }; 

  return (
    <div className="modal-overlay">
      <div className="modal-container bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg p-6">
        
        <div className="modal-header flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">{nft.metadata.name}  #{nft.metadata.symbol.toString()}</h2>
                <h6 className='collection text-gray-600 dark:text-gray-400'>{nft.address.toString().slice(0, 6)+"..."+nft.address.toString().slice(38, 42)}</h6>
          </div>
          
          <button onClick={onClose} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
            &times;
          </button>
        </div>
        <hr />
        <div className="modal-body mt-4">
          <img className="image w-full h-64 object-cover rounded-lg" src={`https://ipfs.io/ipfs/${nft.metadata.imageCID}`} alt="NFT" />
          <div className='right'>
            <div className="details">
            <div className="side">
            <p className="mt-4 text-gray-600 dark:text-gray-400"><strong>Token Standars:</strong> ERC721</p>
            <p className="mt-2 text-gray-600 dark:text-gray-400"><strong>Total Supply:</strong> {nft.metadata.totalSupply}</p>
          </div>
          <div className="side">
            <p className="mt-4 text-gray-600 dark:text-gray-400"><strong>Owner Address:</strong> {owner.toString().slice(0, 6) + "..." + owner.toString().slice(38, 42)}</p>
            <p className="mt-2 text-gray-600 dark:text-gray-400"><strong>Available to rent:</strong> {available.toString()}</p>
          </div>
          </div>
          {
            !isOwner && (price!=0) ? (<>
            <div className="price text-gray-600 dark:text-gray-400">Price: {(getRentInEth(price)/1e18).toFixed(5)} {network == "Seph"?(<div>
                <div className="priceSymbol"><ReactSVG src={ether}/></div>
              </div>):network == "Poly Amoy"?(<div>
                <div className="priceSymbol"><ReactSVG src={polygonmatic}/></div>
              </div>):(<></>)} | {price} USD</div>
            </>):(<></>)
          }
          {!isOwner && !allRented ?(<>
            <div className="rent-section mt-2">
            <div className="flex flex-col space-y-4">
                <div className="input-part">
                    <input
                type="number"
                placeholder="Days"
                value={days}
                onChange={(e) => {
                    setDays(e.target.value);
                    if(network=="Seph"){setPrice((e.target.value)*10)}
                    else if(network=="Poly Amoy"){setPrice((e.target.value)/100)}
                    }
                }
                className="input px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Token ID"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="input px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={Rent}
                className="px-4 py-2 text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700"
              >
                Rent
              </button>
                </div>
            </div>
            <hr />
        <p className="mt-2 text-gray-600 dark:text-gray-400"><strong>Description:</strong> {nft.metadata.description}</p>
          </div>
          </>) : !isOwner && allRented ?(
            <>
            <hr/>
        <p className="mt-2 text-gray-600 dark:text-gray-400"><strong>Description:</strong> {nft.metadata.description}</p>
        <p className='text-gray-600 dark:text-gray-400'>
                All tokens are rented in this collection.
              </p>
            </>
            ):(<>
            <hr/>
            <p className="mt-2 text-gray-600 dark:text-gray-400"><strong>Description:</strong> {nft.metadata.description}</p>
              </>)}
          </div>

        </div>

          <div className="mt-10 rent-records">
          {rentRecord.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-4 border-b border-t border-gray-300 py-2 text-center font-medium text-base text-gray-300"><strong>Token Id</strong></th>
                  <th className="px-4 border-b border-t border-gray-300 py-2 text-center font-medium text-base text-gray-300"><strong>Rented by</strong></th>
                  <th className="px-4 border-b border-t border-gray-300 py-2 text-center font-medium text-base text-gray-300"><strong>Vacate date (m/d/y)</strong></th>
                  {isOwner && (
                    <th className="px-4 border-b border-t border-gray-300 py-2 text-center font-medium text-base text-gray-300"><strong>Action</strong></th>
                  )}
                </tr>
              </thead>
              <tbody>
                {rentRecord.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 border-b border-gray-400 text-center text-sm text-gray-600 dark:text-gray-400">{item.id}</td>
                    <td className="px-4 py-2 border-b border-gray-400 text-center text-sm text-gray-600 dark:text-gray-400">
                      {item.data.rentedBy.toString().slice(0, 6) +
                        "..." +
                        item.data.rentedBy.toString().slice(38, 42)}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-400 text-center text-sm text-gray-600 dark:text-gray-400">
                      {convertTimestampToDate(item.data.rentedTime)}
                    </td>
                    {isOwner && (
                      <td className="px-4 py-2 border-b border-gray-400 text-center text-sm text-gray-600 dark:text-gray-400">
                        {rentalStatus[item.id] === 'Relist' ? (
                          <button onClick={() => Relist(item.id)} className="button-relist update-price">
                            <strong>Relist</strong>
                          </button>
                        ) : rentalStatus[item.id] === 'Rented' ? (
                            <p>Rented</p>
                        ) : (
                          <></>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : ( 
            <p className="text-gray-600 dark:text-gray-400">
              None of the tokens are rented.
            </p>
          )}
        </div>

        <div className="modal-footer mt-6">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium leading-5 text-white transition-transform transform duration-300 bg-gradient-to-r from-blue-500 to-purple-600 border border-transparent rounded-lg shadow-lg hover:scale-105 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
