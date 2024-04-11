/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';

export default function InPageNavigation({ children, routes, defaultHidden = [], defaultActiveIndex = 0 }) {
    const activeTabLineRef = useRef();
    const activeTabRef = useRef();
    const [inPageNavIndex, setInPageNavIndex] = useState(defaultActiveIndex);
    const [isResizeEventAdded, setIsResizeEventAdded] = useState(false);
    const [width, setWidth] = useState(window.innerWidth);

    const changePageState = (btn, i) => {
        let { offsetWidth, offsetLeft } = btn;
        activeTabLineRef.current.style.width = offsetWidth + 'px';
        activeTabLineRef.current.style.left = offsetLeft + 'px';

        setInPageNavIndex(i);
    };

    useEffect(() => {
        if (width >= 768 && inPageNavIndex != defaultActiveIndex) {
            changePageState(activeTabRef.current, defaultActiveIndex);
        }

        if (!isResizeEventAdded) {
            window.addEventListener('resize', () => {
                if (!isResizeEventAdded) {
                    setIsResizeEventAdded(true);
                }
                setWidth(window.innerWidth);
            });
        }
    }, [width]);

    return (
        <>
            <div className="relative border-b-2 flex flex-nowrap overflow-x-auto">
                {routes.map((route, i) => {
                    return (
                        <button
                            ref={i == defaultActiveIndex ? activeTabRef : null}
                            key={i}
                            className={
                                'font-bold text-lg w-fit py-4 px-5 capitalize ' +
                                (inPageNavIndex == i ? 'dark:bg-[#4b5563] bg-[#f3f4f6] ' : '') +
                                (defaultHidden.includes(route) ? 'md:hidden ' : null)
                            }
                            onClick={(e) => {
                                changePageState(e.target, i);
                            }}
                        >
                            {route}
                        </button>
                    );
                })}
                <hr ref={activeTabLineRef} className="absolute bottom-0 duration-300" />
            </div>
            {Array.isArray(children) ? children[inPageNavIndex] : children}
        </>
    );
}
