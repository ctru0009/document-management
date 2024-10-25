import { Link } from 'react-router-dom'

const NavigationBar = () => {
  const isLogin = () => {
    return localStorage.getItem('access_token') !== null
  }
  return (
    <nav className="bg-white shadow-md py-4 fixed top-0 left-0 w-full z-10">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex space-x-4">
          <Link to="/" className="text-blue-500 hover:text-blue-700 font-semibold">Home</Link>
          {isLogin() &&<Link to="/dashboard" className="text-blue-500 hover:text-blue-700 font-semibold">Dashboard</Link>}
          {isLogin() && <Link to="/create-assessment" className="text-blue-500 hover:text-blue-700 font-semibold">Create Assessment</Link>}
          {isLogin() && <Link to="/create-submission" className="text-blue-500 hover:text-blue-700 font-semibold">Create Submission</Link>}    
        </div>
        {isLogin() ? (
           <div className="flex space-x-4">
              <Link to="/profile" className="text-blue-500 hover:text-blue-700 font-semibold">Profile</Link>
              <Link to="/logout" className="text-blue-500 hover:text-blue-700 font-semibold">Logout</Link>
            </div>
          ) : (
            <div className="flex space-x-4">
              <Link to="/login" className="text-blue-500 hover:text-blue-700 font-semibold">Login</Link>
            </div>
          )  
        }
      </div>
    </nav>
  )
}

export default NavigationBar