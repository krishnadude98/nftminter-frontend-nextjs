import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import ManualHeader from "components/Header.jsx";
import MintNft from "@/components/MintNft";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>NFT</title>
        <meta name="description" content="NFT Minter" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className="bg-scroll bg-my_bg_image h-screen">
        <ManualHeader />
        <MintNft />
      </div>
    </div>
  );
}
