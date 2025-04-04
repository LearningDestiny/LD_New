export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return <div className="min-h-screen flex justify-center items-center">
        <button
            disabled=""
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-full shadow-lg flex items-center transition duration-300 transform hover:scale-105 active:scale-95"
        >
            <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="animate-spin h-5 w-5 mr-3 text-white"
            >
                <circle
                    strokeWidth="4"
                    stroke="currentColor"
                    r="10"
                    cy="12"
                    cx="12"
                    className="opacity-25"
                ></circle>
                <path
                    d="M4 12a8 8 0 018-8v8H4z"
                    fill="currentColor"
                    className="opacity-75"
                ></path>
            </svg>
            Loading...
        </button>
    </div>
}