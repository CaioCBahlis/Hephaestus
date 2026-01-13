import { useContext, useState, type ReactNode } from "react";
import { createContext } from "react";



export type User = {
  email: string
}

export type UserContextType = {
  user: User | null
  loading: boolean
  setUser: React.Dispatch<React.SetStateAction<User | null>>
}

export const UserContext = createContext<UserContextType | null>(null)

export default function UserContextProvider({children}:  {children: ReactNode}){
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)



    return (
        <UserContext.Provider value={{user: user, loading: loading, setUser: setUser}}> 
        
            {children}
        
        </UserContext.Provider>
    )
}


export function useUser(): UserContextType {
  const ctx = useContext(UserContext)
  if (!ctx) {
    throw new Error("useUser must be used inside UserProvider")
  }
  return ctx
}