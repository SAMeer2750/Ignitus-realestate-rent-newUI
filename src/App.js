import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {
  Modal,
  ModalDialog,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  Button,
} from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import Home from "./components/Home.jsx";
import Create from "./components/Create.jsx";
import Nav from "./components/Nav.jsx";
import First from "./components/First.js";
// import Modal from "./components/Modal.jsx";
import { ethers } from "ethers";
import {
  Sepholia_ContractAddress,
  tokenAbi,
  contractFactoryAbi,
  PloyAmoy_ContractAddress,
  PolyZkEVM_ContractAddress,
  networks,
} from "./constant";
import "./App.css";

function App() {
  const [account, setAccount] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [network, setNetwork] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    loadBcData();
    setupAccountChangeHandler();
  }, []);

  async function loadBcData() {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      setProvider(provider);
      const signer = provider.getSigner();
      setSigner(signer);
      const { chainId } = await provider.getNetwork();
      let contractInstance;
      if (chainId === 11155111) {
        contractInstance = new ethers.Contract(
          Sepholia_ContractAddress,
          contractFactoryAbi,
          signer
        );
        setContract(contractInstance);
        setNetwork("Seph");
        console.log(`connected to ${chainId}`);
        console.log(showModal);
      } else if (chainId === 80002) {
        contractInstance = new ethers.Contract(
          PloyAmoy_ContractAddress,
          contractFactoryAbi,
          signer
        );
        setContract(contractInstance);
        setNetwork("Poly Amoy");
        console.log(`connected to ${chainId}`);
        console.log(showModal);
      } else {
        setNetwork("");
        setShowModal(true);
        console.log(showModal);
      }
    }
  }

  async function switchNetwork(networkKey) {
    const networkData = networks[networkKey];
    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [networkData],
      });
      setShowModal(false);
      loadBcData();
    } catch (error) {
      console.log("Failed to switch network", error);
    }
  }

  async function connectWallet() {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const address = await signer.getAddress();
        setAccount(address);
        setIsConnected(true);
        loadBcData();
      } catch (err) {
        console.log(err);
      }
    }
  }

  function handleAccountChange(newAccounts) {
    if (newAccounts.length > 0) {
      const address = newAccounts[0];
      setAccount(address);
      setIsConnected(true);
    } else {
      setAccount(null);
      setIsConnected(false);
    }
  }

  function setupAccountChangeHandler() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountChange);
    }
  }

  return (
    <BrowserRouter>
      <ToastContainer />
      <div className="App font-jersey-25">
        <div className="gradient-bg-welcome">
          <Nav
            connectWallet={connectWallet}
            account={account}
            network={network}
            setShowModal={setShowModal}
          />
          <Routes>
            <Route path="/" element={<First />} />
            <Route path="/create" element={<Create contract={contract} />} />
            <Route
              path="/home"
              element={
                <Home
                  factoryContract={contract}
                  tokenAbi={tokenAbi}
                  isConnected={isConnected}
                  account={account}
                  signer={signer}
                  provider={provider}
                  network={network}
                />
              }
            />
          </Routes>
          {showModal && (
            <Modal
              centered
              size="md"
              show={showModal}
              onHide={() => setShowModal(false)}
            >
              <ModalDialog>
                <ModalHeader closeButton>
                  <ModalTitle>Unsupported Network</ModalTitle>
                </ModalHeader>
                <ModalBody centered>
                  <p>Please switch to a supported network:</p>
                  <Button
                    variant="primary"
                    onClick={() => switchNetwork("sepholia")}
                    className="button-modal"
                  >
                    Switch to Sepholia
                  </Button>

                  <Button
                    variant="primary"
                    onClick={() => switchNetwork("polygonAmoy")}
                  >
                    Switch to Polygon Amoy
                  </Button>
                </ModalBody>
              </ModalDialog>
            </Modal>
          )}
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;