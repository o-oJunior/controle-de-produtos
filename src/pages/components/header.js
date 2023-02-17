import React from "react";
import { Link } from "react-router-dom";

function Header() {
    return (
        <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-primary">
            <div className="container-fluid">
                <Link className="nav-link active ms-4" aria-current="page" to="/">
                    <img src="/images/logo.png" alt="Logo" height={35} />
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                    <ul className="navbar-nav ms-4">
                        <li className="nav-item">
                            <Link to='/' className="nav-link" aria-current="page">Inicio</Link>
                        </li>
                        <li className="nav-item">
                            <Link to='/produtos' className="nav-link" aria-current="page">Produtos</Link>
                        </li>
                        <li className="nav-item">
                            <Link to='/venda' className="nav-link" aria-current="page">Venda</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}


export default Header;