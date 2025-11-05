import UsernameForm from "@/components/UsernameForm";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Setlist Visualizer
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-2">
            View your concert history in a beautiful, delightful way
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Connect your Setlist.fm account to explore your concert memories
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
          <UsernameForm />
        </div>

        <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p className="mb-2">Features:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="inline-flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Timeline View
            </span>
            <span className="inline-flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Detailed Setlists
            </span>
            <span className="inline-flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Shareable Links
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
