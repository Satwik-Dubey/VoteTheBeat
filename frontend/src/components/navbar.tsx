
import logo from "../assets/logo.png"
import twitter from "../assets/twitter-2.png"
function Navbar() {
    return (
        <>
            <nav className="bg-neutral-primary fixed w-full z-20 top-0 start-0 border-b border-default">
                <div className="max-w-7xl flex flex-wrap items-center justify-between mx-2 p-4">
                    <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <img src={logo} className="h-10 w-10" alt="VoteTheBeat Logo" />
                        <span className="self-center text-xl text-heading font-mono whitespace-nowrap">VoteTheBeat</span>
                    </a>
                </div>
                <div className="absolute end-20 top-0 h-full flex items-center">
                    <a href='https://x.com/_satwikdubey' target="_blank" rel="noopener noreferrer" title="Visit Satwik on X">
                        <img src={twitter} className='h-8 w-8' alt="Satwik on X" />
                    </a>
                    
                </div>
            </nav>
            
        </>
    )
}



export default Navbar;