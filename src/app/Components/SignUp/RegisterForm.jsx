export default function RegisterForm() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-center">Register</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Username *</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Email address *</label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Password *</label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Role</label>
            <div className=" items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input type="radio" name="role" className="text-orange-500 focus:ring-orange-500" defaultChecked />
                <span className="text-gray-700">I am a customer</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="role" className="text-orange-500 focus:ring-orange-500" />
                <span className="text-gray-700">I am a vendor</span>
              </label>
            </div>
          </div>

          <button className="w-full bg-[#F33E0A] text-white font-semibold py-2 rounded-full">
            REGISTER
          </button>
        </form>
      </div>
    </div>
  );
}
