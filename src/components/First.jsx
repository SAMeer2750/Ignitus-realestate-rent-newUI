import React from 'react';
import Ar from '../assests/Ar.svg';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
// import { TonConnectButton } from '@tonconnect/ui-react';

function First() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2500,
    };

    return (
        <div className="text-white flex flex-col md:flex-row justify-around items-center pt-15 min-h-screen bg-gray-900">
            <div className="mb-16 max-w-xl">
                <h1 className="font-semibold text-5xl mb-8">
                    Create and Watch Video <br />
                    <span className="font-thin text-sky-400">Video NFTs</span>
                </h1>
                <Slider {...settings}>
                    <div className="text-xl font-thin">
                        <span className='text-sky-400 font-bold'>Welcome to RealEstate Rent </span>– innovative concept that leverages blockchain technology and decentralized finance (DeFi) to revolutionize the traditional real estate rental market. By integrating Web3 principles, this project aims to offer a more transparent, efficient, and secure way of renting properties. 
                    </div>
                    <div className="text-xl font-thin">
                        <span className='text-sky-400 font-bold'>Blockchain-Based Property Listings:</span> Property owners can list their rental properties on a blockchain platform, ensuring all listings are transparent, tamper-proof, and easily verifiable.
                    </div>
                    <div className="text-xl font-thin">
                        <span className='text-sky-400 font-bold'>Decentralized Identity Verification:</span>  Renters and property owners use decentralized identity (DID) systems to verify their identities. This adds an extra layer of security and reduces the risk of fraud.Reputation systems can be built on blockchain, allowing renters and owners to build trust through their rental history.
                    </div>
                    <div className="text-xl font-thin">
                        <span className='text-sky-400 font-bold'>Tokenization of Real Estate:</span> Properties can be tokenized, allowing fractional ownership. This makes it easier for investors to buy shares in rental properties and receive rental income proportional to their investment.Token holders can trade their shares on secondary markets, providing liquidity and enabling easy entry and exit.

                    </div>
                    <div className="text-xl font-thin">
                        <span className='text-sky-400 font-bold'>Transparent and Fair Dispute Resolution:</span>   A decentralized dispute resolution system can be established to handle conflicts between renters and property owners. This system can use community voting or decentralized arbitration to ensure fair outcomes.All actions and resolutions are recorded on the blockchain for transparency.
                    </div>
                </Slider>
            </div>
            <div>
                <img src={Ar} alt="AR Illustration" className="h-[490px]" />
            </div>
        </div>
    );
};

export default First;