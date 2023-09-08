import { FaEthereum } from 'react-icons/fa'
import { HiOutlineHome } from 'react-icons/hi'
import { SlOrganization } from 'react-icons/sl'
import { FiBook } from 'react-icons/fi'
import { NavLink } from 'react-router-dom'

const Footer = () => {
  return (
    <aside
      className="lg:hidden flex justify-center items-center bg-white
      border-t border-gray-300 px-5 sm:px-20 fixed
      bottom-0 left-0 right-0"
    >
      <div className="flex justify-evenly items-center space-x-10">
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
  const inactiveClass = `flex flex-col justify-start items-center space-x-2
    hover:bg-gray-200 p-3 rounded-full hover:text-purple-700
    transition ease-in-out my-1 text-sm font-semibold`

  const activeClass = `flex flex-col justify-start items-center space-x-2
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

export default Footer
