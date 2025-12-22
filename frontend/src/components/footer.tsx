
import logo from "../assets/logo.png"
function Footer() {
  return (
    <div>
             
              <footer className="bg-white">
                <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
                  <div className="sm:flex sm:items-center sm:justify-between">
                    <a href="#" className="flex items-center mb-4 sm:mb-0 space-x-3">
                      <img src={logo} className="h-15 w-15" alt="Logo" />
                      <span className="text-black self-center text-2xl font-mono font-bold whitespace-nowrap">VoteTheBeat</span>
                    </a>
                    <ul className="flex flex-wrap items-center mb-6 text-sm font-mono font-medium text-gray-800 sm:mb-0">
                      <li>
                        <a href="#" className="hover:underline me-4 md:me-6 hover:text-green-600">About</a>
                      </li>
                      <li>
                        <a href="#" className="hover:underline me-4 md:me-6 hover:text-green-600">Privacy Policy</a>
                      </li>
                      <li>
                        <a href="#" className="hover:underline me-4 md:me-6 hover:text-green-600">Licensing</a>
                      </li>
                      <li>
                        <a href="https://www.linkedin.com/in/satwikdubey10/" target="blank" className="hover:underline hover:text-green-600">Contact</a>
                      </li>
                    </ul>
                  </div>
                  <hr className="my-6 border-black border-2 sm:mx-auto lg:my-8" />
                  <span className="block text-sm text-gray-800 font-mono sm:text-center">
                    © 2026 <a href="#" target="blank" className="hover:underline hover:text-green-600 font-bold">VoteTheBeat™</a>. All Rights Reserved.
                  </span>
                </div>
              </footer>
    </div>
  )
}

export default Footer