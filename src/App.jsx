import { Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Footer from './components/Footer'
import CreateOrg from './components/CreateOrg'
import Organizations from './pages/Organizations'
import Organization from './pages/Organization'
import Payrolls from './pages/Payrolls'
import Payroll from './pages/Payroll'
import { useEffect } from 'react'
import { isWalletConnected, loadData } from './services/blockchain'
import { ToastContainer } from 'react-toastify'

const App = () => {
  useEffect(() => {
    const loadBlockchain = async () => {
      await isWalletConnected()
      await loadData()
      console.log('Blockchain Loaded')
    }

    loadBlockchain()
  }, [])

  return (
    <div className="flex bg-[#qdfssg] min-h-screen relative">
      <Sidebar />
      <main
        className="flex flex-col space-y-3 w-full
        overflow-hidden"
      >
        <Header />
        <div className="p-5 sm:px-20">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/organizations" element={<Organizations />} />
            <Route path="/organization/:id" element={<Organization />} />
            <Route path="/payrolls" element={<Payrolls />} />
            <Route path="/payroll/:id" element={<Payroll />} />
          </Routes>
        </div>
        <div className="lg:hidden h-20"></div>
        <Footer />
      </main>
      <CreateOrg />
      
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnHover
        pauseOnFocusLoss
        draggable
        theme="dark"
      />
    </div>
  )
}

export default App
