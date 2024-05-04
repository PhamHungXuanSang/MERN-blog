import { Link } from 'react-router-dom';

export default function SuccessfulTransaction() {
    const openGmail = () => {
        window.open('https://www.gmail.com', '_blank');
    };

    return (
        <section
            className="h-full relative p-10 flex flex-col items-center gap-10 text-center"
            style={{ animation: 'fadeIn 2s' }}
        >
            <img
                src="../../public/transaction-successful.png"
                className="select-none border-2 border-gray-300 w-48 aspect-square object-cover rounded"
            />
            <div>
                <h1 className="text-4xl leading-7">Payment success!</h1>
                <p className="text-sm md:text-base lg:text-lg mt-4">
                    Thank you for using our service. A confirmation email has been sent to your inbox.
                </p>
                <button
                    type="button"
                    className="text-indigo-600 hover:text-indigo-800 transition duration-300 text-sm md:text-base lg:text-lg font-semibold"
                    onClick={openGmail}
                >
                    Check your email
                </button>
                <p className="text-xl leading-7 mt-4">
                    Start blogging now{' '}
                    <Link to={'/dash-board?tab=create-blog'} className="font-semibold underline hover:text-teal-500">
                        Create Blog
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
        </section>
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
