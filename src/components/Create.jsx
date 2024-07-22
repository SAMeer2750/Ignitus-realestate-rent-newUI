import { useEffect, useState } from 'react'
import { ethers } from "ethers"
import { Row, Form, Button } from 'react-bootstrap'
import axios from 'axios'
import { toast } from 'react-toastify'


const Create = ({ contract }) => {
  
  const [nftName, setNFTName] = useState("");
  const [nftSymbol, setNFTSymbol] = useState("");
  const [nftDescription, setNFTDescription] = useState("");
  const [totalSupply, setTotalSupply] = useState();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", image);

      const imageUploadResponse = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            pinata_api_key: "74e28c80a910f49983c3",
            pinata_secret_api_key:
              "ae229495d225b4e8d3cc9860f0720bc74795d81a961cf630ca45e52f48151ce3",
          },
        }
      );

      const nftData = {
        name: nftName,
        symbol: nftSymbol,
        description: nftDescription,
        imageCID: imageUploadResponse.data.IpfsHash,
        totalSupply: totalSupply
      };

      const nftUploadResponse = await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        nftData,
        {
          headers: {
            pinata_api_key: "74e28c80a910f49983c3",
            pinata_secret_api_key:
              "ae229495d225b4e8d3cc9860f0720bc74795d81a961cf630ca45e52f48151ce3",
          },
        }
      );
      const tx = await contract.addProperty(
        nftName,
        nftSymbol,
        nftUploadResponse.data.IpfsHash,
        totalSupply
      )

      await tx.wait();

      setNFTName("");
      setNFTDescription("");
      setTotalSupply("");
      setNFTSymbol("");
      setImage(null);
    } catch (error) {
      console.error("Error uploading and minting NFT:", error);
    }

    setLoading(false);
  };

  return (
    (
      <div className="min-h-screen flex justify-center items-center">
  <main className="container mx-auto px-4">
    <div className="content text-white shadow-lg rounded-lg border-2 p-5 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600">
      <div className="space-y-8">
        <Row className="g-4">
          <Form.Group>
            <Form.Label className="text-lg">Upload Image</Form.Label>
            <Form.Control
              type="file"
              required
              className="text-md"
              size="md"
              name="image"
              accept="image/*" // Only accept image files
              onChange={handleImageUpload}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label className="text-lg">Collection Name</Form.Label>
            <Form.Control
            onChange={(e) => setNFTName(e.target.value)}
            name="name"
            id="name"
            size="md"
            required
            type="text"
            placeholder="Name of the property"
            className="text-md"
          />
          </Form.Group>

          <Form.Group>
            <Form.Label className="text-lg">Collection Symbol</Form.Label>
            <Form.Control
            onChange={(e) => setNFTSymbol(e.target.value)}
            name="symbol"
            id="symbol"
            size="md"
            required
            type="text"
            placeholder="Symbol"
            className="text-md"
          />
          </Form.Group>

          <Form.Group>
            <Form.Label className="text-lg">Description</Form.Label>
            <Form.Control
            onChange={(e) => setNFTDescription(e.target.value)}
            name="description"
            id="description"
            size="md"
            required
            as="textarea"
            placeholder="About the property"
            className="text-md"
          />
          </Form.Group>

          <Form.Group>
            <Form.Label className="text-lg">Total Supply</Form.Label>
            <Form.Control
            onChange={(e) => setTotalSupply(e.target.value)}
            name="TotalSupplye"
            id="Total Supply"
            size="md"
            required
            type="number"
            placeholder="Total Supply"
            className="text-md"
          />
          </Form.Group>

          <div className="flex justify-center">
            <Button onClick={handleFormSubmit} variant="primary" size="lg">
              {loading ? "Uploading..." : "Create Collection!"}
            </Button>
          </div>
        </Row>
      </div>
    </div>
  </main>
</div>

    )
  );
}

export default Create