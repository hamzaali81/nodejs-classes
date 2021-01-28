import React from 'react';
import { Link,useRouteMatch } from 'react-router-dom';

function NavBar() {
    let { path, url } = useRouteMatch();
   console.log('path,url***',path,url);

  return (
	<div>
        <Link to="/"> Home </Link>
        <Link to="/about"> About </Link>
        <Link to="/product"> Product </Link>
	</div>
  );
}

export default NavBar;