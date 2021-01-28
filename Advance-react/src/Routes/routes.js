import React from 'react'

import {
  BrowserRouter as Router,
  Switch,
  Route,

} from "react-router-dom";import About from '../Component/About';
import Home from '../Component/Home';
import NavBar from "../Component/Navbar";
import ProductItem from "../Component/ProductItem";
import Product from "./../Component/Product";

export default function routes() {
    return (
        <div>
            <Router>
              <NavBar />
                <Switch>
                    <Route exact path="/" component={Home}/>
                    <Route path="/about" component={About}/>
                    <Route exact path="/product" component={Product}/>
                    <Route path="/product/:id" component={ProductItem}/>
                    <Route path="*" component={()=><h2>404 Not Found</h2>}/>
                </Switch>
            </Router>
        </div>
      );
    }

