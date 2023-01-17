import { useWallet } from "@solana/wallet-adapter-react";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { useState } from "react";
import styles from "../styles/Home.module.css";
require("@solana/wallet-adapter-react-ui/styles.css");

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

const Home: NextPage = () => {
  const { publicKey } = useWallet();
  const [nftAddress, setNftAddress] = useState<string>(
    "CuHz73qMYVoPirX9eo5Gg6T9u96cE7PNQg5Cbx9dqnfA"
  );
  const [loading, setLoading] = useState<boolean>(false);

  const mint = async () => {
    if (!publicKey) return alert("Connect your wallet first");
    setLoading(true);
    const res = await fetch("/api/mint", {
      method: "POST",
      body: JSON.stringify({ address: publicKey }),
    });

    const data = await res.json();
    console.log(data);
    setNftAddress(data.nft);
    setLoading(false);
  };

  return (
    <>
      <div className={styles.container}>
        <WalletMultiButtonDynamic />

        <button onClick={mint} className={styles.mainButton} disabled={loading}>
          {loading ? "Loading..." : "Mint NFT"}
        </button>

        {nftAddress && (
          <a
            href={`https://explorer.solana.com/address/${nftAddress}?cluster=devnet`}
            target="_blank"
            rel="noreferrer"
            className={styles.nftLink}
          >
            NFT minted successfully! View NFT
          </a>
        )}
      </div>
    </>
  );
};

export default Home;
