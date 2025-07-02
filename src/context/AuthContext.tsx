import React, {createContext, useContext, useState} from "react";

interface AuthUser {
    id: string;
    name: string;
    token: string;
}

interface AuthContextType{
    user: AuthUser | null;
    login: (userData: AuthUser) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode}> = ({ children}) => {

    const [user, setUser] = useState<AuthUser | null> (null);

    const login = (userData: AuthUser) => {
        setUser(userData);
        localStorage.setItem("clinicpal_user", JSON.stringify(userData));
    };

    const logout = () =>{
        setUser(null);
        localStorage.removeItem('clinicpal_user');
    }

    return(
        <AuthContext.Provider value={{ user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context) throw new Error('useAuth must be used inside AutthProvider');
    return context;
}