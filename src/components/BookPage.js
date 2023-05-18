import React from 'react';
import axios from "axios";
import { useEffect, useState } from "react"
import Navigation from './Navigation';
import { getId, dateFormatter } from '../helpers/helpers';
import { NavLink } from 'react-router-dom';

const BookPage = () => {
    const [id, setId] = useState(window.location.pathname.split("/")[2])
    const [data, setData] = useState()
    const [characters, setCharacters] = useState()
    const [view, setView] = useState(5)
    const [povCharacters, setPovCharacters] = useState()
    const [lazy, setLazy] = useState(false)
    const [maxView, setMaxView] = useState(1000)

    const handleScroll = () => {

        if ((window.scrollY >= 85 || view < 100) && lazy && view < maxView) {

            if (view > maxView) {
                setView(maxView)
                setLazy(false)
            }
            setView(view + 25)
        }
    }

    useEffect(() => {
        axios.get(`https://www.anapioficeandfire.com/api/books/${id}`)
            .then((res) => {
                setData(res.data)

                if (res.data.povCharacters.length > 0) {
                    let urls = res.data.povCharacters
                    const requests = urls.map((url) => axios.get(url))
                    let tmp = []
                    axios.all(requests).then((responses) => {

                        responses.forEach((resp) => {
                            tmp.push({ id: getId(resp.data.url), name: resp.data.aliases[0] || resp.data.name })

                        });
                        setPovCharacters(tmp)
                    });
                }
                if (res.data.characters.length > 0) {
                    setMaxView(res.data.characters.length)
                    let urls = res.data.characters.slice(0, view)
                    const requests = urls.map((url) => axios.get(url))
                    let tmp = []
                    axios.all(requests).then((responses) => {
                        responses.forEach((resp) => {
                            tmp.push({ id: getId(resp.data.url), name: resp.data.aliases[0] || resp.data.name })

                        });
                        setCharacters(tmp)
                        if (view >= maxView) { setLazy(false) }
                    });
                }
            })
        window.addEventListener("scroll", handleScroll);
    }, [id, view])

    return (
        <div className="bookpage">
            <Navigation />
            {data &&
                <div className="bookcontainer">
                    <h1>{data.name}</h1>
                    <p>ISBN: {data.isbn}</p>
                    <p>Paru le : {dateFormatter(data.released)}</p>
                    <p>{data.numberOfPages} pages</p>
                    <div className="book-pov">
                        <h2>Personnages (point de vue)</h2>
                        <ul>
                            {povCharacters && povCharacters.map((pov, key) => (
                                <NavLink key={key} to={`/character/${pov.id}`}>
                                    <li key={key}>{pov.name}</li>
                                </NavLink>
                            ))

                            }
                        </ul>
                    </div>
                    <div className="book-characters">
                        <h2>Tous les personnages : </h2>
                        <ul>
                            {characters &&
                                characters.slice(0, view)
                                    .map((perso, key) => (
                                        <NavLink key={key} to={`/character/${perso.id}`}>
                                            <li key={key}>{perso.name} </li>
                                        </NavLink>
                                    ))
                            }
                        </ul>
                        {view < 100 && <button onClick={(e) => { setView(view + 100); setLazy(true) }}>➕ afficher plus</button>}
                    </div>
                </div>
            }
        </div >
    );
};

export default BookPage;