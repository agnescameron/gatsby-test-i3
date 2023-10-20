import React from "react"
import { Link } from "gatsby"

const Nav = () => {
	return( 
		<div class="navContainer">
			<div class="nav">
				<a href="/">home</a>
				<a href="/about">about</a>
				<Link to="/search/">advanced search</Link>
				<Link to="/datasets/">datasets</Link>
				<Link to="/tools/">tools</Link>
				<Link to="/guides/">guides</Link>
			</div>
		</div>
	)
}

export default Nav;