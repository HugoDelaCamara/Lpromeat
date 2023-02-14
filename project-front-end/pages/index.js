import Head from "next/head";
import styles from "../styles/Home.module.css";
import Header from "@/components/Header";
import SupplyChain from "@/components/SupplyChain";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Smart Contract Random</title>
        <meta name="description" content="Random events" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <SupplyChain />

      {/*Header / connect button/ nav bar*/}
    </div>
  );
}
