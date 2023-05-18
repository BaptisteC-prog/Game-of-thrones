import React from 'react';
import axios from "axios";
import { useEffect, useState } from "react"
import { NavLink } from 'react-router-dom';
import Navigation from './Navigation';
import { dateFormatter } from '../helpers/helpers';

const Books = () => {

    const [data, setData] = useState()

    useEffect(() => {
        axios.get(`https://www.anapioficeandfire.com/api/books`)
            .then((res) => { setData(res.data) })
    })

    return (
        <div className="books">
            <Navigation />
            <div className="container">
                <h2>Livres</h2>
                <ul>
                    {data && data.map((book, key) => (
                        <NavLink key={key} to={`/book/${key + 1}`}>
                            <li key={key}>
                                <h3>{book.name}</h3>
                                <p>Paru le {dateFormatter(book.released)}</p>
                            </li>
                        </NavLink>
                    ))

                    }
                </ul>
            </div>
        </div>
    );
};

export default Books;