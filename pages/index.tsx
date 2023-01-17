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
  const [nftAddress, setNftAddress] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const mint = async () => {
    if (!publicKey) return alert("Connect your wallet first");
    setLoading(true);
    const res = await fetch("/api/mint", {
      method: "POST",
      body: JSON.stringify({ address: publicKey }),
    });

    const data = await res.json();
    if (data.error) {
      setLoading(false);
      return setError(data.error);
    }

    setError(null);
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
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </>
  );
};

export default Home;
