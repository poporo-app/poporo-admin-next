import { FaUsers } from 'react-icons/fa'
import { RiMailSendFill } from 'react-icons/ri'
import { MdOutlineHistory } from 'react-icons/md'
import NavItem from './NavItem/NavItem'

interface NavItemType {
  id: number
  label: string
  link: string
  icon: React.ReactNode
}

const NavList = () => {
  const navItem: NavItemType[] = [
    { id: 1, label: 'サロン情報', link: '/users', icon: <FaUsers size={20} /> },
    { id: 2, label: '招待一覧', link: '/invite', icon: <RiMailSendFill size={20} /> },
    { id: 3, label: '施術履歴', link: '/history', icon: <MdOutlineHistory size={20} /> },
  ]
  return (
    <div className="mt-24">
      {navItem.map((e) => (
        <NavItem key={e.id} label={e.label} link={e.link} icon={e.icon} />
      ))}
    </div>
  )
}

export default NavList
