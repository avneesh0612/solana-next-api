import { ThirdwebSDK } from "@thirdweb-dev/sdk/solana";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { address } = JSON.parse(req.body);
  console.log(address);

  const sdk = ThirdwebSDK.fromPrivateKey(
    "devnet",
    process.env.PRIVATE_KEY as string
  );

  const collection = await sdk.getNFTCollection(
    "DKs6LSvqgAyrSGFViwKEEgtHGvsXaXdG2rnZSG2qRJND"
  );

  const metadata = {
    name: "Test NFT",
    description: "This is a test NFT",
  };

  try {
    const nft = await collection.mintTo(address, metadata);
    console.log(nft);
    return res.status(200).json({
      nft,
      success: true,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      error: e,
    });
  }
};

export default handler;
