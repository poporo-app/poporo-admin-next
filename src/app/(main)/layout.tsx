import Header from '../components/Header/Header'
import SideMenu from '../components/SideMenu/SideMenu'

const MainLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <div>
      <Header />
      <div className="flex h-screen overflow-auto">
        <SideMenu />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

export default MainLayout
