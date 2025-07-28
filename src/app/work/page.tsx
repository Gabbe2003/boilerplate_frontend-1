 
const page = () => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold text-blue-800 mb-4">
          Work Submissions
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Thank you for your interest in joining our team!<br />
          <span className="block mt-2 font-semibold text-red-500">
            We are not hiring at the moment.
          </span>
        </p>
        <div className="flex flex-col items-center gap-2 mb-6">
          <span className="text-4xl mb-2">🚫</span>
          <p className="text-gray-500">
            No open positions right now. But dont go far!
          </p>
          <p className="text-gray-500">
            Keep an eye on this page for future opportunities. We update this page weekly
          </p>
        </div>
      </div>
    </main>
  );
};

export default page;
