/* eslint-disable react/prop-types */
import { useSelector } from 'react-redux';

export default function ThemeProvider({ children }) {
    const darkModeObj = useSelector((state) => state.darkMode);
    let systemMode = null;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const localStorageObj = localStorage.getItem('persist:root');

    if (localStorageObj === undefined) {
        systemMode = mediaQuery.matches ? 'dark' : 'light';
    }

    return (
        <div className={systemMode !== null ? systemMode : darkModeObj.darkMode}>
            <div className="bg-white text-gray-950 dark:text-gray-200 dark:bg-[rgb(16,23,42)] min-h-screen">
                {children}
            </div>
        </div>
    );
}
