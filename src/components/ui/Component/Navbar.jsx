import React from 'react'
import { Button } from '../button'

const Navbar = () => {
  return (
    <>
        <div className=" w-full flex flex-row mx-auto justify-between border-solid ">
        <h1 className="font-bold text-3xl px-5 py-5">Swatantra</h1>
        <h2 className="font-mono px-56 py-6 font-3xl">A Web Based Crypto Wallets</h2>
        <div className="py-4">
        <Button className="rounded-md">theme change</Button>
        </div>
        </div>

    </>
  )
}

export default Navbar