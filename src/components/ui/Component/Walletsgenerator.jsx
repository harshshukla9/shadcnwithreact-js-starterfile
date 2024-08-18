import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "../button";
import * as bip39 from "bip39";
import { Buffer } from "buffer";
import { motion } from "framer-motion";
import { HDNode } from "@ethersproject/hdnode";
import { FaEthereum, FaKey } from 'react-icons/fa';
import { SiSolana } from 'react-icons/si';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { HDKey } from 'micro-ed25519-hdkey';
import { Keypair } from '@solana/web3.js';
import bs58 from "bs58";

window.Buffer = Buffer;

const Walletsgenerator = () => {
    const [chain, setChain] = useState('');
    const [mnemonic, setMnemonic] = useState("");
    const [wallets, setWallets] = useState([]);
    const [index, setIndex] = useState(0);
    const [copied, setCopied] = useState(false);
    const [visibleKeys, setVisibleKeys] = useState({});
    const [balances, setBalances] = useState({}); // State to store balances

    const selectChain = (value) => {
        setChain(value);
        setWallets([]);
    };

    const toggleKeyVisibility = (index) => {
        setVisibleKeys(prev => ({ ...prev, [index]: !prev[index] }));
    };

    const generateMnemonic = () => {
        if (chain) {
            const newMnemonic = bip39.generateMnemonic();
            setMnemonic(newMnemonic);
        } else {
            alert("Select the chain");
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(mnemonic);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const GenerateEthWallets = () => {
        if (mnemonic) {
            const seed = bip39.mnemonicToSeedSync(mnemonic);
            const hdNode = HDNode.fromSeed(seed);
            const path = `m/44'/60'/0'/0/${index}`;
            const wallet = hdNode.derivePath(path);

            setWallets((prevWallets) => [
                ...prevWallets,
                {
                    publicKey: wallet.address,
                    privateKey: wallet.privateKey,
                },
            ]);
            setIndex(index + 1);
        }
    };

    const GenerateSolanaWallets = () => {
        if (mnemonic) {
            const seed = bip39.mnemonicToSeedSync(mnemonic);
            const hd = HDKey.fromMasterSeed(seed.toString("hex"));
            const path = `m/44'/501'/${wallets.length}'/0'`;
            const keypair = Keypair.fromSeed(hd.derive(path).privateKey);
            const publicKey = keypair.publicKey.toBase58();
            const privateKeyArray = keypair.secretKey;
            const privateKey = bs58.encode(privateKeyArray);

            setWallets([...wallets, { publicKey, privateKey }]);
        }
    };

    const FetchTheSolanaBalance = async (walletAddress) => {
        const url = 'https://solana-devnet.g.alchemy.com/v2/VqVymZs25KBch9PfBeN-6pPn2uu5G2fq';
        const payload = {
            jsonrpc: '2.0',
            id: 1,
            method: 'getBalance',
            params: [walletAddress]
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            const balance = data.result.value / 1000000000; // Convert lamports to SOL
            setBalances(prevBalances => ({ ...prevBalances, [walletAddress]: balance }));
        } catch (error) {
            console.error('Error fetching Solana balance:', error);
            setBalances(prevBalances => ({ ...prevBalances, [walletAddress]: 0 }));
        }
    };

    const FetchTheEthBalance = async (walletAddress) => {
        const url = 'https://eth-mainnet.g.alchemy.com/v2/VqVymZs25KBch9PfBeN-6pPn2uu5G2fq';
        const payload = {
            jsonrpc: '2.0',
            id: 1,
            method: 'eth_getBalance',
            params: [walletAddress, 'latest']
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            const balance = parseInt(data.result, 16) / 1e18; // Convert wei to ETH
            setBalances(prevBalances => ({ ...prevBalances, [walletAddress]: balance }));
        } catch (error) {
            console.error('Error fetching Ethereum balance:', error);
            setBalances(prevBalances => ({ ...prevBalances, [walletAddress]: 0 }));
        }
    };

    // Split the mnemonic into words
    const words = mnemonic.split(' ');

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Selecting the chain */}
            <div className="flex justify-center mb-6">
                <Select value={chain} onValueChange={selectChain}>
                    <SelectTrigger className="w-full max-w-xs">
                        <SelectValue placeholder="Select the Chain" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Eth">Eth</SelectItem>
                        <SelectItem value="Sol">Sol</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Buttons for generating */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                <Button onClick={generateMnemonic} className="bg-green-300 text-black hover:bg-green-600 w-full sm:w-auto">
                    Generate Mnemonics
                </Button>
                <Button
                    onClick={() => {
                        if (mnemonic) {
                            if (chain === "Eth") {
                                GenerateEthWallets();
                            } else if (chain === "Sol") {
                                GenerateSolanaWallets();
                            } else {
                                alert("Please select a chain (Eth or Sol)");
                            }
                        } else {
                            alert("Please generate a seed phrase first");
                        }
                    }}
                    className="w-full sm:w-auto"
                >
                    Add Wallets
                </Button>
            </div>

            {/* Display mnemonic */}
            {mnemonic && (
                <div className="max-w-3xl mx-auto p-4 sm:p-6">
                    <motion.div
                        className="bg-gradient-to-r from-purple-400 to-pink-500 p-1 rounded-lg shadow-lg"
                        whileHover={{ scale: 1.02 }}
                        onClick={copyToClipboard}
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                {words.map((word, index) => (
                                    <motion.div
                                        key={index}
                                        className="bg-gray-100 dark:bg-gray-700 rounded-md p-2 text-center"
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <span className="text-gray-500 dark:text-gray-400 text-xs">{index + 1}</span>
                                        <p className="font-medium text-sm sm:text-base">{word}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                    {copied && (
                        <motion.p
                            className="text-center mt-4 text-green-500"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            Seed phrase copied to clipboard!
                        </motion.p>
                    )}
                </div>
            )}

            {/* Display generated wallets */}
            {wallets.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-4 text-center">Generated Wallets</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {wallets.map((wallet, index) => (
                            <motion.div
                                key={index}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="flex items-center mb-2">
                                    {chain === "Eth" ? (
                                        <FaEthereum className="text-blue-500 mr-2" size={24} />
                                    ) : (
                                        <SiSolana className="text-purple-500 mr-2" size={24} />
                                    )}
                                    <span className="font-bold">Wallet {index + 1}</span>
                                </div>
                                <div className="mb-2">
                                    <div className="flex items-center">
                                        <FaKey className="text-gray-500 mr-2" />
                                        <span className="font-semibold">Public Key:</span>
                                    </div>
                                    <p className="text-xs sm:text-sm break-all">{wallet.publicKey}</p>
                                </div>
                                <div className="mb-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <FaKey className="text-gray-500 mr-2" />
                                            <span className="font-semibold">Private Key:</span>
                                        </div>
                                        <button onClick={() => toggleKeyVisibility(index)}>
                                            {visibleKeys[index] ? (
                                                <AiOutlineEyeInvisible className="text-gray-500" size={20} />
                                            ) : (
                                                <AiOutlineEye className="text-gray-500" size={20} />
                                            )}
                                        </button>
                                    </div>

                                    {visibleKeys[index] ? (
                                        <p className="text-xs sm:text-sm break-all">{wallet.privateKey}</p>
                                    ) : (
                                        <p className="text-xs sm:text-sm">••••••••••••••••</p>
                                    )}
                                    <div className="mb-2 py-2 flex flex-row justify-between ">
                                        <div className="flex items-center">
                                            <button
                                                onClick={() => {
                                                    if (chain === "Sol") {
                                                        FetchTheSolanaBalance(wallet.publicKey);
                                                    } else if (chain === "Eth") {
                                                        FetchTheEthBalance(wallet.publicKey);
                                                    }
                                                }}
                                                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700"
                                            >
                                                Get Balance
                                            </button>
                                        </div>
                                        <p className="text-xs sm:text-sm break-all font-bold">
                                            {balances[wallet.publicKey] !== undefined ? `${balances[wallet.publicKey]} ${chain === "Eth" ? "ETH" : "SOL"}` : '0'}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Walletsgenerator;
