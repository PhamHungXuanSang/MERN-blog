/* eslint-disable react/prop-types */
// import { useState } from 'react';

export default function Switch({ boolean }) {
    //const [isSelected, setIsSelected] = useState(true);
    let isSelected = boolean;
    return (
        <div
            onClick={() => !isSelected}
            className={
                'cursor-pointer flex w-20 h-9 bg-gray-600 rounded-full transition-all duration-500' +
                (isSelected ? ' bg-green-500' : '')
            }
        >
            <span
                className={
                    'h-9 w-10 bg-white rounded-full transition-all duration-500' + (isSelected ? ' translate-x-10' : '')
                }
            ></span>
        </div>
    );
}
