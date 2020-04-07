import React, { Component } from "react";
import "../App.css";
import { Link } from "react-router-dom";

function NavBar() {
    return (
        <nav className="nav-style">
            <Link to="/"> Home </Link>
        </nav>
    );
}

export default NavBar;
