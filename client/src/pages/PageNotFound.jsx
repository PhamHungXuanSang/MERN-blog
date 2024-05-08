import { Link } from 'react-router-dom';

export default function PageNotFound() {
    return (
        <div
            className="h-full relative p-10 flex flex-col items-center gap-20 text-center"
            style={{ animation: 'fadeIn 2s' }}
        >
            <img
                src="/pngtree-error-404-page-not-found.jpg"
                className="select-none border-2 border-gray-300 w-64 aspect-square object-cover rounded"
            />
            <div>
                <h1 className="text-4xl leading-7">Page not found</h1>
                <p className="text-xl leading-7 mt-4">
                    The page you are loking for does not exists. Back to the{' '}
                    <Link to={'/'} className="font-semibold underline hover:text-teal-500">
                        Home page
                    </Link>
                </p>
            </div>

            <div className="mt-auto">
                <span className="seft-center font-semibold text-sm sm:text-xl dark:text-white px-3 py-1 rounded-lg bg-gradient-to-tr from-green-500 to-blue-500 text-white">
                    MERN Blog
                </span>
                <p className="mt-5">
                    Explore the creative community, read unique articles, and engage in diverse, informative
                    conversations.
                </p>
            </div>
        </div>
    );
}

const styleSheet = document.styleSheets[0];
styleSheet.insertRule(
    `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`,
    styleSheet.cssRules.length,
);
