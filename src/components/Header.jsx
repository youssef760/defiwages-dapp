import { GrSearch } from 'react-icons/gr'
import { useSelector } from 'react-redux'
import { connectWallet, truncate } from '../services/blockchain'

const Header = () => {
  const { connectedAccount } = useSelector((states) => states.globalStates)
  return (
    <header
      className="flex justify-start items-center space-x-10
    border-b border-gray-300 p-5 sm:px-20"
    >
      <div className="flex justify-start items-center space-x-2 w-full">
        <GrSearch size={20} />
        <input
          className="form-control flex-auto min-w-0 block w-full
          px-3 text-base font-normal text-gray-700 bg-transparent
          bg-clip-padding rounded transition ease-in-out border-0
          focus:text-gray-700 focus:outline-none focus:ring-0"
          type="search"
          placeholder="Search"
        />
      </div>

      <div className="h-5 border-r border-gray-300"></div>

      {connectedAccount ? (
        <button
          type="button"
          className="inline-block px-6 py-2.5 bg-purple-600
        text-white font-medium text-xs leading-tight
        uppercase rounded-full shadow-md hover:bg-purple-700
        hover:shadow-lg focus:bg-purple-700 focus:shadow-lg
        focus:outline-none focus:ring-0 active:bg-purple-800
        transition duration-150 ease-in-out"
        >
          {truncate(connectedAccount, 4, 4, 11)}
        </button>
      ) : (
        <button
          type="button"
          className="inline-block px-6 py-2.5 bg-purple-600
        text-white font-medium text-xs leading-tight
        uppercase rounded-full shadow-md hover:bg-purple-700
        hover:shadow-lg focus:bg-purple-700 focus:shadow-lg
        focus:outline-none focus:ring-0 active:bg-purple-800
        transition duration-150 ease-in-out"
          onClick={connectWallet}
        >
          Connect
        </button>
      )}
    </header>
  )
}

export default Header
