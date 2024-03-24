import { Spinner } from 'flowbite-react';
import { useState } from 'react';
import { HiArrowNarrowUp, HiOutlineUserGroup } from 'react-icons/hi';

export default function RevenueManagement() {
    const [packages, setPackages] = useState(null);

    return (
        <div className="py-12 px-4 md:mx-auto">
            <div className="flex-wrap flex gap-4 justify-center">
                {/* {packages != null ? (
                    <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
                        <div className="flex justify-between">
                            <div className="">
                                <h3 className="text-gray-500 text-lg uppercase">Total Users</h3>
                                <p className="text-2xl">{totalUsers}</p>
                            </div>
                            <HiOutlineUserGroup className="bg-teal-600 text-white rounded-full p-3 text-5xl shadow-lg" />
                        </div>
                        <div className="flex gap-2 text-sm">
                            <span className="text-green-500 flex items-center">
                                <HiArrowNarrowUp />
                                {lastMonthUsers}
                            </span>
                            <div className="text-gray-500">Last month</div>
                        </div>
                    </div>
                ) : (
                    <Spinner className="block mx-auto mt-4" size="xl" />
                )} */}
            </div>
        </div>
    );
}
