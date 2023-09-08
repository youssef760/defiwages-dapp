import { FaEthereum } from 'react-icons/fa'
import { HiOutlineHome } from 'react-icons/hi'
import { SlOrganization } from 'react-icons/sl'
import { FiBook } from 'react-icons/fi'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <aside className="lg:block hidden border-r border-gray-300">
      <header
        className="flex justify-between items-center
        space-x-2 border-b border-gray-300 px-5 py-[1.75rem]"
      >
        <div className="flex justify-center items-center space-x-1">
          <FaEthereum className="text-purple-700" size={20} />
          <span>DeFiWages</span>
        </div>
      </header>

      <div className="flex flex-col p-5">
        <NavItem
          route="/"
          Icon={<HiOutlineHome size={20} />}
          label="Dashboard"
        />
        <NavItem
          route="/organizations"
          Icon={<SlOrganization size={20} />}
          label="Organizations"
        />
        <NavItem
          route="/payrolls"
          Icon={<FiBook size={20} />}
          label="Payrolls"
        />
      </div>
    </aside>
  )
}

const NavItem = ({ Icon, label, route }) => {
  const inactiveClass = `flex justify-start items-center space-x-2
    hover:bg-gray-200 p-3 rounded-full hover:text-purple-700
    transition ease-in-out my-1 text-sm font-semibold`

  const activeClass = `flex justify-start items-center space-x-2
    hover:bg-gray-200 bg-gray-200 p-3 rounded-full text-purple-700
    transition ease-in-out my-1 text-sm font-semibold`

  return (
    <NavLink
      to={route}
      className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
    >
      {Icon}
      <span>{label}</span>
    </NavLink>
  )
}

export default Sidebar
