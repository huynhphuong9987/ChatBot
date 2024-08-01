import {Outlet} from "react-router-dom"

export default function Layout(){
    return (
        // <div className="px-5 flex flex-col min-h-screen bg-gradient-to-r from-yellow-200 to-blue-200">
        <div className="px-5 flex flex-col h-full sm:mx-0 md:mr-5 lg:mx-2 xl:mx-12 2xl:mx-32">
            {/* <Header />  */}
            <Outlet></Outlet>
        </div>
    )
}