export default function LoginForm() {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="max-w-md w-full p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Username or email address *
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
  
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Password *
              </label>
              <input
                type="password"
                className="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
  
            <div className="mb-4 flex items-center">
              <input type="checkbox" id="rememberMe" className="mr-2" />
              <label htmlFor="rememberMe" className="text-gray-700">
                Remember me
              </label>
            </div>
  
            <button className="w-full bg-[#F33E0A] text-white font-semibold py-2 rounded-full">
              LOG IN
            </button>
          </form>
  
          <div className="mt-4 text-center">
            <a href="#" className="text-[#F33E0A] hover:underline">
              Lost your password?
            </a>
          </div>
        </div>
      </div>
    );
  }
  