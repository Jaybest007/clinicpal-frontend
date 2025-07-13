import { Link } from "react-router-dom"

export const PageNotFound = () => {
        
    return(
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-6 py-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-700">404 - Page Not Found</h1>
            <p className="mt-4 text-lg text-blue-600 max-w-md">
                We couldn’t find the page you’re looking for. It may have been moved, deleted, or never existed.
            </p>
            <Link to="/dashboard" className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition duration-200">
                Back to Dashboard
            </Link>
        </div>


    )
}