import React from 'react';
import axios from "axios";
import { useEffect, useState } from "react"
import Navigation from './Navigation';
import { getId } from '../helpers/helpers';
import { NavLink } from 'react-router-dom';
const HousePage = () => {

    const [id, setId] = useState(window.location.pathname.split("/")[2])
    const [data, setData] = useState()
    const [lord, setLord] = useState(null)
    const [heir, setHeir] = useState(null)
    const [founder, setFounder] = useState(null)
    const [overlord, setOverLord] = useState(null)
    const [characters, setCharacters] = useState()

    useEffect(() => {
        axios.get(`https://www.anapioficeandfire.com/api/houses/${id}`).then((res) => {
            setData(res.data)
            if (res.data.founder || res.data.founder !== "") {
                axios.get(res.data.founder)
                    .then((res) => {
                        setFounder({ id: getId(res.data.url), name: res.data.aliases[0] || res.data.name })
                    })
            }
            if (res.data.currentLord) {
                axios.get(res.data.currentLord)
                    .then((res) => {
                        setLord({ id: getId(res.data.url), name: res.data.aliases[0] || res.data.name })
                    })
            }
            if (res.data.heir) {
                axios.get(res.data.heir)
                    .then((res) => {
                        setHeir({ id: getId(res.data.url), name: res.data.aliases[0] || res.data.name })
                    })
            }
            if (res.data.overlord) {
                axios.get(res.data.overlord)
                    .then((res) => {
                        setOverLord({ id: getId(res.data.url), name: res.data.name })
                    })
            }
            if (res.data.swornMembers.length > 0) {
                let urls = res.data.swornMembers
                const requests = urls.map((url) => axios.get(url))
                let tmp = []
                axios.all(requests).then((responses) => {
                    responses.forEach((resp) => {
                        tmp.push({ id: getId(resp.data.url), name: resp.data.aliases[0] || resp.data.name })

                    });
                    setCharacters(tmp)
                });
            }
        })
    }, [id])

    return (
        <div className="housepage">
            <Navigation />
            <div className="container">
                {data &&
                    <ul>
                        <h2>{data.name}</h2>
                        <li>Region : {data.region}</li>
                        <li>Blason : {data.coatOfArms}</li>
                        <li>Devise : {data.words}</li>
                        {data.founded && <li>Fondée en : {data.founded}</li>}
                        {founder &&
                            <NavLink to={`/character/${founder.id}`}>
                                <li>Fondateur : {founder.name}</li>
                            </NavLink>
                        }
                        {data.diedOut && <li>Disparition : {data.diedOut}</li>}
                        {data.seats[0] !== "" && <li>Sieges: {data.seats.join(" - ")}</li>}
                        {data.titles[0] !== "" && <li>Titres : {data.titles.join(" - ")}</li>}
                        {lord &&
                            <NavLink to={`/character/${lord.id}`}>
                                <li>Seigneur : {lord.name}</li>
                            </NavLink>
                        }
                        {heir &&
                            <NavLink to={`/character/${heir.id}`}>
                                <li>Héritier : {heir.name}</li>
                            </NavLink>
                        }

                        {overlord &&
                            <NavLink to={`/house/${overlord.id}`} onClick={(e) => (setId(overlord.id))}  >
                                <li>Vassal de : {overlord.name}</li>
                            </NavLink>
                        }

                        {characters &&

                            <ul>
                                <h3>Personnages :</h3>
                                {characters.map((character, key) => (

                                    <NavLink key={key} to={`/character/${character.id}`}>

                                        <li key={key}>{character.name}</li>
                                    </NavLink>
                                ))}
                            </ul>}
                    </ul>
                }
                <h2>Histoire</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum. Maecenas adipiscing ante non diam sodales hendrerit. </p>
                <p>Ut velit mauris, egestas sed, gravida nec, ornare ut, mi. Aenean ut orci vel massa suscipit pulvinar. Nulla sollicitudin. Fusce varius, ligula non tempus aliquam, nunc turpis ullamcorper nibh, in tempus sapien eros vitae ligula. Pellentesque rhoncus nunc et augue. Integer id felis. Curabitur aliquet pellentesque diam. Integer quis metus vitae elit lobortis egestas. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Morbi vel erat non mauris convallis vehicula. Nulla et sapien. Integer tortor tellus, aliquam faucibus, convallis id, congue eu, quam. Mauris ullamcorper felis vitae erat. Proin feugiat, augue non elementum posuere, metus purus iaculis lectus, et tristique ligula justo vitae magna.  </p>
                <p>Aliquam convallis sollicitudin purus. Praesent aliquam, enim at fermentum mollis, ligula massa adipiscing nisl, ac euismod nibh nisl eu lectus. Fusce vulputate sem at sapien. Vivamus leo. Aliquam euismod libero eu enim. Nulla nec felis sed leo placerat imperdiet. Aenean suscipit nulla in justo. Suspendisse cursus rutrum augue. Nulla tincidunt tincidunt mi. Curabitur iaculis, lorem vel rhoncus faucibus, felis magna fermentum augue, et ultricies lacus lorem varius purus. Curabitur eu amet </p>
                <h2>Trivia</h2>
                <p> Curabitur aliquet pellentesque diam. Integer quis metus vitae elit lobortis egestas. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Morbi vel erat non mauris convallis vehicula. Nulla et sapien. Integer tortor tellus, aliquam faucibus</p>


            </div>
        </div >
    );
};

export default HousePage;