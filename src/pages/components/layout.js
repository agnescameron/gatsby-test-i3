import React from "react"
import Nav from "./nav"

export default function Layout({ children }) {
  return (
    <main>
      <Nav />
      <div className="pageContainer">
        {children}
      </div>
    </main>
  )
}