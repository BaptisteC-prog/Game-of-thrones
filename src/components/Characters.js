import React, { useRef } from 'react';
import axios from "axios";
import { useEffect, useState } from "react"
import { NavLink } from 'react-router-dom';
import { Pagination } from '@mui/material';
import usePagination from '../hooks/usePagination';
import Navigation from './Navigation';
import { getId } from '../helpers/helpers';

const Characters = () => {

    const [data, setData] = useState()
    const [page, setPage] = useState(1)
    const [searchResults, setSearchResults] = useState()
    const inputRef = useRef(null)
    const pageSize = 50;


    useEffect(() => {
        if (!searchResults) {
            axios.get(`https://www.anapioficeandfire.com/api/characters?page=${page}&pageSize=${pageSize}`)
                .then((res) => { setData(res.data) })
        }

    }, [page, searchResults])

    const dataDisp = usePagination(data, pageSize)

    const handleChange = (e, p) => {
        setPage(p)
        dataDisp.jump(p)
    }

    const handleSearch = () => {
        let search = inputRef.current.value
        if (search.length < 3) { alert("Veuillez entrer au moins 3 caracteres !"); return }
        let urls = []
        let tmp = []
        const maxPage = Math.ceil(2138 / 50);
        for (let i = 1; i < maxPage + 1; i++) {
            urls.push(`https://www.anapioficeandfire.com/api/characters?page=${i}&pageSize=50`)
        }

        const requests = urls.map((url) => axios.get(url))
        axios.all(requests).then((responses) => {

            responses.forEach((resp) => {
                for (let p in resp.data) {
                    let perso = resp.data[p]
                    if ((perso.aliases[0] && perso.aliases[0].includes(search))
                        || (perso.titles[0] && perso.titles[0].includes(search))
                        || (perso.name && perso.name.includes(search))) {
                        console.log(tmp)
                        tmp.push({ id: getId(perso.url), name: perso.aliases[0] || perso.titles[0] || perso.name })
                    }
                }
                setSearchResults(tmp)
            })
        })

        console.log(tmp)
    }

    return (
        <div className="characters">
            <Navigation />
            <h2>Personnages</h2>
            {!searchResults && <ul className="characters-table">
                {data && data.map((character, key) => (
                    <NavLink key={key} to={`/character/${key + 1 + pageSize * (page - 1)}`}>
                        <li key={key}>{character.aliases[0] || character.name}
                        </li>
                    </NavLink>

                ))}
            </ul>}
            {searchResults && <div>
                <p className="searchInfo">Resultats :</p>
                {searchResults.length === 0 && <p className="searchVoid">Aucun Résultat</p>}
                {searchResults.length === 1 && <p className="success">1 personnage trouvé</p>}
                {searchResults.length > 1 && <p className="success">{searchResults.length} personnages trouvés</p>}
                <ul>
                    {searchResults.map((character, key) => (
                        <NavLink key={key} to={`/character/${character.id}`}>
                            <li key={key}>{character.name}
                            </li>
                        </NavLink>
                    ))}
                </ul>
            </div>}
            <div>
                <input type="text" onChange={(e) => { setSearchResults() }} ref={inputRef} placeholder="Rechercher"></input>
                <button onClick={(e) => handleSearch()}>🔎</button>
            </div>
            <div className="pagination">
                <div>
                    <Pagination
                        count={Math.ceil(2138 / pageSize)}
                        page={page}
                        onChange={handleChange}
                        size="large" />
                </div>
            </div>

        </div >
    );
};

export default Characters;