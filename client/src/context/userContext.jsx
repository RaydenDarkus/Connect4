import axios from "axios"
import { createContext, useState, useEffect } from "react"
import PropTypes from 'prop-types'

export const UserContext = createContext({})
export const UserContextProvider = ({children}) => {
    const [user, setUser] = useState(null)
    useEffect(() => {
        if(!user) {
            axios.get('/profile').then(({data}) => {
                setUser(data)
            })
        }
    }, [user])
    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    )
}
// PropTypes validation for children prop
UserContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};