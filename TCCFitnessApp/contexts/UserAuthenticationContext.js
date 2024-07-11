import React, { createContext, useState } from 'react';

export const UserAuthenticationContext = createContext();

export const UserAuthenticationProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <UserAuthenticationContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
            {children}
        </UserAuthenticationContext.Provider>
    );
};