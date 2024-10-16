import { CgUserList } from 'react-icons/cg'

interface PageTitleProps {
  title: string
}

const PageTitle: React.FC<PageTitleProps> = ({ title }) => {
  return (
    <div className="flex items-center ml-10 mb-3">
      <CgUserList size={20} />
      <h2 className="ml-1">{title}</h2>
    </div>
  )
}

export default PageTitle
