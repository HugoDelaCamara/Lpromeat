//Have a function to deliver the supply chain
import { useWeb3Contract } from "react-moralis";
import { abi } from "@/constants";
import { contractAddresses } from "@/constants";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";

export default function SupplyChain() {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const randomAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  const [viewFee, setViewFee] = useState("0");
  const [numWords, setNumWords] = useState("0");
  const [randomNumbers, setRandomNumbers] = useState("0");
  const [resultados1, setResultado1] = useState("0");

  let x;
  let resultados = [];
  let resultados2 = [];
  let totality = [];

  const dispatch = useNotification();

  const { runContractFunction: viewSupplyChain } = useWeb3Contract({
    abi: abi,
    contractAddress: randomAddress,
    functionName: "viewSupplyChain",
    params: {},
    msgValue: viewFee,
  });

  const { runContractFunction: getViewFee } = useWeb3Contract({
    abi: abi,
    contractAddress: randomAddress,
    functionName: "getViewFee",
    params: {},
  });

  const {
    runContractFunction: getNum,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: randomAddress,
    functionName: "getNum",
    params: {},
  });

  const { runContractFunction: getNumWords } = useWeb3Contract({
    abi: abi,
    contractAddress: randomAddress,
    functionName: "getNumWords",
    params: {},
  });

  async function updateUI() {
    const viewFeeFromCall = (await getViewFee()).toString();
    setViewFee(viewFeeFromCall);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      async function updateUI() {
        //const viewFeeFromCall = (await getViewFee()).toString();
        const numWordsFromCall = (await getNumWords()).toString();
        const randomNumbersFromCall = (await getNum()).toString();
        const resultado1FromCall = await strings();
        //setViewFee(viewFeeFromCall);
        setNumWords(numWordsFromCall);
        console.log(randomNumbersFromCall);
        setRandomNumbers(randomNumbersFromCall);
        setResultado1(resultado1FromCall);
      }
      updateUI();
    }
  }, [isWeb3Enabled]);

  async function strings() {
    x = randomNumbers.toString();
    let y = x.length;
    console.log(x);
    console.log(y);
    let total = Math.trunc(y / 8);
    let z = 0;
    let variables = [];
    if (total > 6) {
      while (z != 36) {
        variables.push(x.slice(z, z + 6));
        z += 6;
      }
    }
    console.log(total);
    variables.sort();
    let ordenados = [];
    console.log(`Las variables ${variables}`);
    for (let i = 0; i < variables.length; i++) {
      ordenados[i] = variables[i] % 6;
    }

    ordenados.sort();

    console.log(`Ordenados ${ordenados}`);

    let result = ordenados.filter((item, index) => {
      return ordenados.indexOf(item) == index;
    });
    console.log(result);
    let poner = 0;
    do {
      result.push(poner);
      poner++;
    } while (result.length < 4);
    result.sort();

    console.log(result);

    const cadenas = [
      "Reception of the animal",
      "Animal is sent to the slaughterhouse",
      "Meet is cutted into smaller pieces",
      "Quality control on the meet already processed",
      "Transported into the store",
      "Meet already available on store",
    ];

    for (let i = 0; i < result.length; i++) {
      resultados.push(cadenas[result[i]]);
    }
    const fechas = [
      "25/01/2023 10:53",
      "26/01/2023 14:22",
      "26/01/2023 18:09",
      "30/01/2023 12:22",
      "02/02/2023 9:33",
      "03/02/2023 19:44",
    ];

    for (let i = 0; i < result.length; i++) {
      resultados2.push(fechas[result[i]]);
    }
    console.log(resultados);
    console.log(resultados2);
    for (let i = 0; i < result.length; i++) {
      totality.push(resultados[i], resultados2[i]);
    }
    console.log(totality);

    return totality;
  }

  const handleSuccess = async function (tx) {
    await tx.wait(1);
    handleNewNotificacion(tx);
    updateUI();
  };

  const handleNewNotificacion = function () {
    dispatch({
      type: "info",
      message: "Transaction Complete!",
      title: "Tx Notification",
      position: "topR",
      icon: "bell",
    });
  };

  return (
    <div className="p-5">
      View Supply Chain Fee: {0.1 || ethers.utils.formatUnits(viewFee, "ether")}
      ETH
      {randomAddress ? (
        <div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
            onClick={async function () {
              await viewSupplyChain({
                onSuccess: handleSuccess,
                onError: (error) => console.log(error),
              });
            }}
            disabled={isLoading || isFetching}
          >
            {isLoading || isFetching ? (
              <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
            ) : (
              <div>Confirm View Of Supply Chain</div>
            )}
          </button>
          <div>Steps on the Chain: {4 || numWords} </div>
          <div className="Supplychain">
            <u>
              <strong>Supply chain</strong>
            </u>
            <nav className="Supplychain-nav">
              <ul className="Supplychain-ul">
                <li className="Supplychain-li">
                  {resultados1[0] + ": " + resultados1[1]}
                </li>
                <li className="Supplychain-li">
                  {resultados1[2] + ": " + resultados1[3]}
                </li>
                <li className="Supplychain-li">
                  {resultados1[4] + ": " + resultados1[5]}
                </li>
                <li className="Supplychain-li">
                  {resultados1[6] + ": " + resultados1[7]}
                </li>
              </ul>
            </nav>
          </div>
        </div>
      ) : (
        <div> No Supply Address Detected </div>
      )}
    </div>
  );
}
