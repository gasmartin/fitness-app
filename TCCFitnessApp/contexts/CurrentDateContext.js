import React, { createContext, useState } from 'react';

export const CurrentDateContext = createContext();

export const CurrentDateProvider = ({ children }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    return (
        <CurrentDateContext.Provider value={{ currentDate, setCurrentDate }}>
            {children}
        </CurrentDateContext.Provider>
    );
};