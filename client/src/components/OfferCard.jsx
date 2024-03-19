import { Card } from 'flowbite-react';

export default function OfferCard({ packageName, packagePrice, packageDescription }) {
    const handleBuy = () => {
        // Call api mua package
    };
    return (
        <Card className="max-w-sm mx-auto">
            <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">Use within {packageName}</h5>
            <div className="flex items-baseline text-gray-900 dark:text-white">
                <span className="text-3xl font-semibold">$</span>
                <span className="text-5xl font-extrabold tracking-tight">{packagePrice}</span>
                <span className="ml-1 text-xl font-normal text-gray-500 dark:text-gray-400">/{packageName}</span>
            </div>
            <ul className="my-7 space-y-5">
                {packageDescription.map((desc, i) => {
                    return (
                        <li key={i} className="flex space-x-3">
                            <svg
                                className="h-5 w-5 shrink-0 text-cyan-600 dark:text-cyan-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                                {desc}
                            </span>
                        </li>
                    );
                })}
            </ul>
            <button
                onClick={handleBuy}
                type="button"
                className="inline-flex w-full justify-center rounded-lg bg-cyan-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-200 dark:focus:ring-cyan-900"
            >
                Choose plan
            </button>
        </Card>
    );
}
