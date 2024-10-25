import { Helmet } from "react-helmet";

function NotFound() {
  return (
    <>
      <Helmet>
        <title>Page Not Found</title>
      </Helmet>
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-800">404</h1>
          <p className="text-xl text-gray-600">Page not found</p>
          <p className="text-lg text-gray-500 p-5">
            The page you're looking for doesn't exist or has been removed.
          </p>
          <button
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              window.location.href = "/";
            }}
          >
            Go back home
          </button>
        </div>
      </div>
    </>
  );
}

export default NotFound;
