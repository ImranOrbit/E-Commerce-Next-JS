export default function ForgotPasswordPage() {
  return (
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: "#f5f5f5" }}>
      <div className="bg-[#f5f5f5] p-10 rounded-xl shadow-md w-full max-w-md text-black">
        <h1 className="text-2xl font-bold mb-6 text-center">Forgot Password</h1>
        <form className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded border border-slate-300 px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-blue-950 px-5 py-2 text-white font-semibold hover:bg-blue-800 transition"
          >
            Reset Password
          </button>
        </form>

        <div className="mt-4 text-sm text-center">
          Remembered your password?{" "}
          <a href="/login" className="text-blue-950 hover:underline">
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
