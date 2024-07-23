import React, { createContext } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = React.useState(null);
    
    return (
        <UserContext.Provider value={{ user, setUser }}>
        {children}
        </UserContext.Provider>
    );
};
