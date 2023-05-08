import { useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";
import { Bell } from "@web3uikit/icons";
import axios from "axios";

export default function MintNft() {
  const {
    chainId: chainIdHex,
    isWeb3Enabled,
    web3,
    logout,
    deactivateWeb3,
    Moralis,
    account,
  } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const nftAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;
  const [isPinning, setIsPinning] = useState("");
  const [name, setName] = useState("");
  const [tokenId, setTokenId] = useState("0");
  const [url, setUrl] = useState("0");
  const [txhash, setTxHash] = useState("0");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const dispatch = useNotification();

  const {
    runContractFunction: createItem,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: nftAddress,
    functionName: "createItem",
    params: { tokenURI: url },
  });

  async function updateUi(tx) {
    setIsPinning(false);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      if (nftAddress != null) {
      }
    }
  }, [isWeb3Enabled]);

  useEffect(() => {
    if (isWeb3Enabled) {
      if (nftAddress != null) {
        const contract = new ethers.Contract(nftAddress, abi, web3);
        console.log("inside effect");
        contract.once("TokenMinted", (tokenId, user) => {
          console.log("token minted with token id", tokenId);
          setTokenId(tokenId.toString());
        });
      }
    }
  }, [txhash]);

  const handleSuccess = async function (tx) {
    console.log(tx);
    await tx.wait(1);
    setTxHash(tx.hash);
    handleNewNotification(tx);
    updateUi(tx);
  };

  const handleNewNotification = async function (tx) {
    dispatch({
      type: "info",
      message: `tx hash is  ${tx.hash}`,
      title: "Tx Notification",
      position: "topR",
      icon: <Bell></Bell>,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsPinning(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          method: "post",
          maxContentLength: "Infinity",
          headers: {
            "Content-Type": "multipart/form-data",
            pinata_api_key: process.env.NEXT_PUBLIC_API_KEY,
            pinata_secret_api_key: process.env.NEXT_PUBLIC_SECRET_KEY,
          },
        }
      );
      const fileurl = "https://ipfs.io/ipfs/" + response.data.IpfsHash;
      // Generate metadata and save to IPFS
      const metadata = {
        name: name,
        description: description,
        image: fileurl,
      };
      console.log(metadata);
      const response2 = await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        metadata,
        {
          maxContentLength: "Infinity",
          headers: {
            "Content-Type": "application/json",
            pinata_api_key: process.env.NEXT_PUBLIC_API_KEY,
            pinata_secret_api_key: process.env.NEXT_PUBLIC_SECRET_KEY,
          },
        }
      );
      const actualUri = "https://ipfs.io/ipfs/" + response2.data.IpfsHash;

      setUrl(actualUri);

      await createItem({
        onSuccess: handleSuccess,
        onError: (error) => console.log(error),
      });

      //   //   const file2 = new Moralis.File(`${name}metadata.json`, {
      //   //     base64: Buffer.from(JSON.stringify(metadata)).toString("base64"),
      //   //   });
      //   //   await file2.saveIPFS();
      //   setUrl("https://gateway.pinata.cloud/ipfs/" + response2.data.IpfsHash);
      //   // Interact with smart contract
      //   await createItem({
      //     onSuccess: handleSuccess,
      //     onError: (error) => console.log(error),
      //   });
      //   // Get token id
    } catch (err) {
      console.error(err.message);
      alert("An error occured!" + err.message);
    }
  };

  return (
    <div className="p-5 ">
      {nftAddress ? (
        <div className="flex justify-center mt-40">
          <div className="flex max-w-screen-sm h-auto items-center justify-center bg-opacity-60 bg-gradient-to-r from-blue-50 to-blue-300 ">
            <form onSubmit={onSubmit}>
              <div>
                <h3>Provide data :</h3>
                <input
                  type="text"
                  className="border-[1px] p-2 text-lg border-black w-full mt-5 "
                  value={name}
                  placeholder="Name"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mt-3">
                <input
                  type="text"
                  className="border-[1px] p-2 text-lg border-black w-full"
                  value={description}
                  placeholder="Description"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="mt-3">
                <input
                  type="file"
                  className="border-[1px] p-2 text-lg border-black"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
              <button
                type="submit"
                className="mt-5 w-full p-5 bg-green-700 text-white text-lg rounded-xl animate-pulse"
                disabled={isLoading || isFetching}
              >
                {isLoading || isFetching || isPinning ? (
                  <div className="flex justify-center">
                    <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full "></div>
                  </div>
                ) : (
                  <div>Mint now!</div>
                )}
              </button>
              {tokenId == "0" ? (
                <div></div>
              ) : (
                <div>
                  Minted NFT TokenId :- {tokenId} ContractAddress:-
                  {nftAddress}
                </div>
              )}
              <button
                onClick={deactivateWeb3}
                className="mt-5 w-full p-5 bg-red-700 text-white text-lg rounded-xl"
              >
                Logout
              </button>
            </form>
          </div>
          {/* <button
            className="bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto "
            onClick={async function () {
              await enterLottery({
                onSuccess: handleSuccess,
                onError: (error) => console.log(error),
              });
            }}
            disabled={isLoading || isFetching}
          >
            {isLoading || isFetching ? (
              <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
            ) : (
              <div>Enter Lottery</div>
            )}
          </button> */}
        </div>
      ) : (
        <div>No Lottery detected change network to sepolia</div>
      )}
    </div>
  );
}
