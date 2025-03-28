// https://vike.dev/usePageContext
// eslint-disable-next-line react-refresh/only-export-components
export { usePageContext }
export { PageContextProvider }

import React, { useContext } from 'react'

const Context = React.createContext(undefined)

function PageContextProvider({ pageContext, children }) {
  return <Context.Provider value={pageContext}>{children}</Context.Provider>
}

/** https://vike.dev/usePageContext */
function usePageContext() {
  const pageContext = useContext(Context)
  return pageContext
}
