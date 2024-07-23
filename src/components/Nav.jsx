import React from 'react';
import "./Nav.css";
import { Link } from "react-router-dom";
import { ReactSVG } from "react-svg";
import polygonmatic from "../assests/polygon-matic.svg"
import ether from "../assests/ether-crypto.svg"

function Nav({ connectWallet, account, network, setShowModal, loading }) {

  return (

    <nav className="border-gray-200 bg-gray-700 dark:bg-gray-700 dark:border-gray-700 transition ease-in-out hover:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between p-4">
          <div className="flex cursor-pointer items-center space-x-3 rtl:space-x-reverse">
            <Link to='/' className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white no-underline">Ignitus Networks</Link>
          </div>

          <div className="flex justify-between w-full max-w-md">
            <Link to="/home" className="px-3 no-underline text-gray-200 text-lg font-semibold transition-colors duration-300 hover:text-white hover:font-bold">Marketplace</Link>
            <Link to="/create" className="px-3 no-underline text-gray-200 text-lg font-semibold transition-colors duration-300 hover:text-white hover:font-bold">Create</Link>
            {!account ? (
              <button onClick={connectWallet} type="button" className="connectWallet border-[0.5px] h-9 text-white bg-gradient-to-r from-purple-700 to-pink-800 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-md text-center me-2 mb-2">
                Connect Wallet
                </button>) : (
              <button type="button" className="connectWallet border-[0.5px] h-9 text-white bg-gradient-to-r from-purple-700 to-pink-800 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-md text-center me-2 mb-2" >
                {network == "Seph"?(<div id="network" onClick={()=>{setShowModal(true)}}>
                <div className="networkN">Sepolia</div>
                <div>{<ReactSVG src={ether}/>}</div>
                </div>):network == "Poly Amoy"?(<div id="network" onClick={()=>{setShowModal(true)}}>
                <div className="networkN">{network}</div>
                <div>{<ReactSVG src={polygonmatic}/>}</div>
                </div>):network == "Poly ZkEVM"?(<div id="network" onClick={()=>{setShowModal(true)}}>
                <div className="networkN">Poly Zk</div>
                <div>{<ReactSVG src={polygonmatic}/>}</div>
                </div>):(<></>)}
                {account.slice(0, 6) + "..." + account.slice(38, 42)}
                </button>)}

          </div>
        </div>
      </div>
    </nav>



  )
}

export default Nav