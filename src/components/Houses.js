import React from 'react';
import axios from "axios";
import { useEffect, useState } from "react"
import { NavLink } from 'react-router-dom';
import Navigation from './Navigation';
import { getId } from '../helpers/helpers';

const Houses = () => {
    const [data, setData] = useState()
    const [view, setView] = useState(5)
    const [page, setPage] = useState(1)

    const getNewHouses = (page) => {
        axios.get(`https://www.anapioficeandfire.com/api/houses?page=${page}&pageSize=50`)
            .then((res) => {
                setData(data.concat(res.data))
            })
    }

    //debut
    useEffect(() => {
        axios.get(`https://www.anapioficeandfire.com/api/houses?page=1&pageSize=${view}`)
            .then((res) => { setData(res.data) })
    }, [view])

    //pour les maisons ajoutées recemment, rafraichir la page
    useEffect(() => {
    }, [page, data])

    return (
        <div className="houses">
            <Navigation />
            <div className="container">
                <h2>Maisons</h2>
                <ul>
                    {data && data.map((house, key) => (
                        <NavLink key={key} to={`/house/${getId(house.url)}`}>
                            <li key={key}>
                                <h3>{house.name}</h3>
                                <p>{house.swornMembers.length} membres</p>
                            </li>
                        </NavLink>
                    ))}
                </ul>
                {<button onClick={(e) => { setView(50); setPage(page + 1); getNewHouses(page) }}>➕ afficher plus</button>}
            </div>
        </div>
    );
};

export default Houses;