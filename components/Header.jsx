import { useMoralis } from "react-moralis";
import { useEffect } from "react";

export default function ManualHeader() {
  const {
    enableWeb3,
    account,
    isWeb3Enabled,
    Moralis,
    deactivateWeb3,
    isWeb3EnableLoading,
  } = useMoralis();

  useEffect(() => {
    if (isWeb3Enabled) return;
    if (typeof window !== "undefined") {
      if (window.localStorage.getItem("connected")) {
        enableWeb3();
      }
    }
  }, [isWeb3Enabled]);

  useEffect(() => {
    Moralis.onAccountChanged((account) => {
      console.log(`Account changed to ${account}`);
      if (account == null) {
        window.localStorage.removeItem("connected");
        deactivateWeb3();
        console.log("null account found");
      }
    });
  }, []);

  return (
    <div>
      {account ? (
        <div className="p-5 border-b-2 flex flex-row bg-gradient-to-r from-blue-50 to-blue-300">
          <h1 className="py-4 px-4 text-3xl place-items-center font-mono hover:scale-50">
            NFT MINTER
          </h1>
          <div className="ml-auto  py-2 px-4 text-2xl place-items-center text-white ">
            Connected to {account.slice(0, 6)}...
            {account.slice(account.length - 4)}
          </div>
        </div>
      ) : (
        <div className="p-5 border-b-2 flex flex-row bg-cyan-400 bg-gradient-to-r from-blue-50 to-blue-300">
          <h1 className="py-4 px-4 font-mono text-3xl  place-items-center hover:scale-50">
            NFT MINTER
          </h1>
          <div className="ml-auto py-2 px-4 ">
            <button
              className="rounded-full bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 border-2 border-blue-900 "
              onClick={async () => {
                await enableWeb3();
                if (typeof windown !== "undefined") {
                  window.localStorage.setItem("connected", "inject");
                }
              }}
              disabled={isWeb3EnableLoading}
            >
              Connect
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
