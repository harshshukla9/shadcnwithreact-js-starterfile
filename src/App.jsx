import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from './components/ui/button'
import Navbar from './components/ui/Component/Navbar'
import Walletsgenerator from './components/ui/Component/Walletsgenerator'
import Footer from './components/ui/Component/Footer'
import Layout from './components/ui/Component/Layout'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
   
    <Layout>
      <Navbar/>
      <Walletsgenerator />
    </Layout>

    
    
    </>
  )
}

export default App
