import React from 'react';
import { NavLink } from 'react-router-dom';

const Navigation = () => {
    return (
        <div className="navigation">
            <ul>
                <NavLink to="/" className={(nav) => (nav.isActive ? "nav-active" : "")}>
                    <li>Accueil</li>
                </NavLink>
                <NavLink to="/books" className={(nav) => (nav.isActive ? "nav-active" : "")}>
                    <li>Livres</li>
                </NavLink>
                <NavLink to="/houses" className={(nav) => (nav.isActive ? "nav-active" : "")}>
                    <li>Maisons</li>
                </NavLink>
                <NavLink to="/characters" className={(nav) => (nav.isActive ? "nav-active" : "")}>
                    <li>Personnages</li>
                </NavLink>
            </ul>
        </div>
    );
};

export default Navigation;