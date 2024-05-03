import React, { useState } from 'react'
import { toast } from 'react-toastify';
const UserForm = ({handleSubmit}) => {
    const [wallet, setWallet] = useState("");
    const [password, setPassword] = useState("");
    async function connectWallet(e) {
        e.preventDefault()
        if (typeof window.ethereum !== "undefined") {
            try {
                // Request the user to connect their wallet
                await window.ethereum.request({ method: "eth_requestAccounts" });
                // Get the user's account address
                const accounts = await window.ethereum.request({
                    method: "eth_accounts",
                });
                setWallet(accounts[0]);
                toast.success("连接钱包成功")
            } catch (error) {
                console.error(error);
                toast.error(error.message)
            }
        } else {
            toast.error("Please install MetaMask!")
        }
    }
    const handleSubmitClick = (e) => {
        e.preventDefault()
        handleSubmit({ wallet, password })
    }
    return (
        <div className="flex flex-col justify-center items-center">
            <button
                className="py-2 px-3 my-2 bg-cyan-400 hover:bg-cyan-500 transition-all active:border-cyan-500 text-white rounded-lg"
                onClick={connectWallet}
            >
                连接钱包
            </button>
            <div className="flex flex-col items-start">
                <label className="font-bold mr-2 float-left" htmlFor="wallet">
                    钱包地址
                </label>
                <input
                    value={wallet}
                    onChange={(e) => setWallet(e.target.value)}
                    type="text"
                    id="wallet"
                    className="p-2 w-[50vw] text-black border-blue-400 border-2 rounded-md"
                    placeholder="请输入钱包地址"
                />
            </div>
            <div className="flex flex-col items-start">
                <label className="font-bold mr-2 float-left" htmlFor="password">
                    密码
                </label>
                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    id="password"
                    autoComplete="on"
                    className="p-2 w-[50vw] text-black border-blue-400 border-2 rounded-md"
                    placeholder="请输入钱包密码"
                />
            </div>
            <div className="flex justify-around items-center">
                <button
                    onClick={handleSubmitClick}
                    className="py-2 text-black font-semibold px-3 my-2 bg-amber-400 hover:bg-amber-500 transition-all active:border-amber-500 rounded-lg"
                >
                    提交
                </button>
            </div>
        </div>
    )
}
export default UserForm