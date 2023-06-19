import { createContext, useState } from 'react'

type UserContextType = {
  userEmail: string
  setUserEmail: React.Dispatch<React.SetStateAction<string>>
}

export const UserContext = createContext<UserContextType>(null)

export function UserProvider({ children }) {
  const [userEmail, setUserEmail] = useState<string>('')
  // const [userLocation, setUserLocation] = useState()
  return <UserContext.Provider value={{ userEmail, setUserEmail }}>
    {children}
  </UserContext.Provider>
}
