import React, { useState, useEffect } from 'react';
import { ethers } from "ethers"

const visAddress = "0xcc1b9517460d8ae86fe576f614d091fca65a28fc";
const visAbi = [
  "function burn(uint256 amount)"
];
const IS_TESTNET = false;
const CHAIN_ID = (IS_TESTNET) ? 80001 : 137 // 137 matic, mumba 80001
const CHAIN_ID_HEX = (IS_TESTNET) ? '0x13881' : '0x89'; // ?  . mumbai: 0x13881, 

export function VisBurnPage() {
    const [, setCorrectNetwork] = useState(false)
    const [provider, setProvider] = useState()
    const [burnAmount, setBurnAmount] = useState("1")
    const [txHash, setTxHash] = useState()

    useEffect(() => {
        async function fetchData () {
          // TODO: handle if MM is not installed
          if (window.ethereum && window.ethereum.networkVersion !== CHAIN_ID) {
            window.ethereum.on('chainChanged', () => {
              window.location.reload();
            })
            window.ethereum.on('accountsChanged', async function (accounts) {
              window.location.reload();
            })
          }
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [
              {chainId: CHAIN_ID_HEX}
            ]
          });
          setCorrectNetwork(true)
    
          const newProvider = new ethers.providers.Web3Provider(window.ethereum)
          const accounts = await newProvider.send("eth_requestAccounts", []);
          if (accounts.length>0) {
            setProvider(newProvider)
          }
        }
        fetchData()
      },[])

    const burn = async () => {
        const signer = provider.getSigner();
        const contract = new ethers.Contract(visAddress, visAbi, signer)
        const gasPrice = await provider.getGasPrice();
        const options = {
          value: ethers.utils.parseEther("0"),
          gasLimit: 300000,
          gasPrice,
      }
      const s = await contract.burn(ethers.utils.parseEther(burnAmount), options)
      setTxHash(s.hash)
    }

    const handleChangeBurnAmount = (e) => {
        setBurnAmount(e.target.value)
    }

    return (
        <>
        <h1>VIS BURN by <a rel="noreferrer" target="_blank" href="https://twitter.com/Fiver_Labs">Fiver Labs</a></h1>
        <div className="alert alert-danger" role="alert">
            You are about to BURN <strong>{burnAmount}</strong> of <a rel="noreferrer" target="_blank"  href="https://polygonscan.com/address/0xcc1b9517460d8ae86fe576f614d091fca65a28fc">Vigorous Token (ERC20)</a>
        </div>

        <div className='input-group mb-3'>
            <span className='input-group-text'>Amount to Burn</span>
            <input className="form-control" style={{width:'25px'}} onChange={handleChangeBurnAmount} type="number" value={burnAmount} />
        </div>
        <div className='input-group mb-3'>
            <button type='button' className='btn btn-danger' onClick={burn}>BURN {burnAmount} $VIS</button>

        </div>

        {
            (txHash)
            ? <div className="alert alert-success" role="alert">
                <h5>Your Burn Transaction here:</h5>
                https://polygonscan.com/tx/{txHash}
                <br/>
                <a rel="noreferrer" target="_blank"  href={`https://polygonscan.com/tx/${txHash}`}>Open in PolygonScan</a>
        </div>
            : null
        }


        <div className="alert alert-warning" role="alert">
            This is a free tool. Source code available here. Feel free to contribute.
            <br />
            Author: <a rel="noreferrer" target="_blank" href="https://twitter.com/RatedAXG">@RatedAXG</a>
        </div>
        </>
    )
}