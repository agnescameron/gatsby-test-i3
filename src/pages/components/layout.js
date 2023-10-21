import React from "react"
import Nav from "./Nav"

export default function Layout({ children }) {
  return (
    <main>
      <Nav />
      <div style={{ margin: `0 auto`, maxWidth: 650, padding: `0 1rem` }}>
        {children}
      </div>
    </main>
  )
}