import React from 'react';
import axios from "axios";
import { useEffect, useState } from "react"
import Navigation from './Navigation';
import { getId } from '../helpers/helpers';
import { NavLink } from 'react-router-dom';
const CharaPage = () => {

    const [id, setId] = useState(window.location.pathname.split("/")[2])
    const [data, setData] = useState()
    const [father, setFather] = useState(null)
    const [mother, setMother] = useState(null)
    const [spouse, setSpouse] = useState(null)
    const [allegiances, setAllegiances] = useState(null)
    const [books, setBooks] = useState([])
    const [povBooks, setPovBooks] = useState(null)

    useEffect(() => {
        axios.get(`https://www.anapioficeandfire.com/api/characters/${id}`)
            .then((res) => {
                setData(res.data)
                if (res.data.father) {
                    axios.get(res.data.father)
                        .then((res) => { setFather(res.data.aliases[0] || res.data.name) })
                }
                if (res.data.mother) {
                    axios.get(res.data.mother)
                        .then((res) => { setMother(res.data.aliases[0] || res.data.name) })
                }
                if (res.data.spouse) {
                    axios.get(res.data.spouse)
                        .then((res) => { setSpouse(res.data.aliases[0] || res.data.name) })
                }
                if (res.data.allegiances.length > 0) {
                    let urls = res.data.allegiances
                    const requests = urls.map((url) => axios.get(url))
                    let tmp = []
                    axios.all(requests).then((responses) => {
                        responses.forEach((resp) => {
                            tmp.push({ id: getId(resp.data.url), name: resp.data.name })
                        });
                        console.log(tmp)
                        setAllegiances(tmp)
                    });
                }
                if (res.data.books) {
                    let urls = res.data.books
                    const requests = urls.map((url) => axios.get(url))
                    let tmp = []
                    axios.all(requests).then((responses) => {

                        responses.forEach((resp) => {
                            tmp.push(resp.data.name)

                        });
                        setBooks(tmp)
                    });
                }
                if (res.data.PovBooks) {
                    let urls = res.data.povBooks
                    const requests = urls.map((url) => axios.get(url))
                    let tmp = []
                    axios.all(requests).then((responses) => {

                        responses.forEach((resp) => {
                            console.log(resp.data.name)
                            tmp.push(resp.data.name)

                        });
                        setPovBooks(tmp)
                    });
                }
            }
            )
    }, [id])

    const infos = ["gender", "culture", "born", "died"]
    const infoDisplay = ["Genre : ", "Culture : ", "Naissance : ", "Mort : "]

    return (
        <div className="charapage">
            <Navigation />
            {data &&
                <div className="characontainer">
                    <h1>{data.aliases[0] || data.name}</h1>
                    <h3>{data.titles.join(" - ")}</h3>
                    <ul>
                        {infos && infos.map((e, key) => (
                            data[e] && <li key={key}>{infoDisplay[key]}{data[e]}</li>
                        )
                        )}
                        {allegiances && <li>Maison : {allegiances.map((allegiance, key) => (
                            <NavLink key={key} to={`/house/${(allegiance.id)}`}>{allegiance.name}
                            </NavLink>
                        )
                        )}</li>}
                        {data.father && <li className="underline" onClick={(e) => { setId(getId(data.father)) }}>Pere :{father}</li>}
                        {data.mother && <li className="underline" onClick={(e) => { setId(getId(data.mother)) }}>Mere :{mother}</li>}
                        {data.spouse && <li className="underline" onClick={(e) => { setId(getId(data.spouse)) }}>Coinjoint(e) :{spouse}</li>}
                        {books && <li>Livres : {books.join(" - ")}</li>}
                        {povBooks && <li>Heros dans les livres : {povBooks.join(" - ")}</li>}
                        {data.tvSeries[0] && <li>Apparait dans les saisons : {data.tvSeries.map((serie) => (serie.split(" ")[1] + " "))}</li>}
                        {data.playedBy[0] && <li>Joué par : {data.playedBy.join(" - ")}</li>}
                    </ul>
                    <h2>Biographie</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum. Maecenas adipiscing ante non diam sodales hendrerit. </p>
                    <p>Ut velit mauris, egestas sed, gravida nec, ornare ut, mi. Aenean ut orci vel massa suscipit pulvinar. Nulla sollicitudin. Fusce varius, ligula non tempus aliquam, nunc turpis ullamcorper nibh, in tempus sapien eros vitae ligula. Pellentesque rhoncus nunc et augue. Integer id felis. Curabitur aliquet pellentesque diam. Integer quis metus vitae elit lobortis egestas. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Morbi vel erat non mauris convallis vehicula. Nulla et sapien. Integer tortor tellus, aliquam faucibus, convallis id, congue eu, quam. Mauris ullamcorper felis vitae erat. Proin feugiat, augue non elementum posuere, metus purus iaculis lectus, et tristique ligula justo vitae magna.  </p>
                    <p>Aliquam convallis sollicitudin purus. Praesent aliquam, enim at fermentum mollis, ligula massa adipiscing nisl, ac euismod nibh nisl eu lectus. Fusce vulputate sem at sapien. Vivamus leo. Aliquam euismod libero eu enim. Nulla nec felis sed leo placerat imperdiet. Aenean suscipit nulla in justo. Suspendisse cursus rutrum augue. Nulla tincidunt tincidunt mi. Curabitur iaculis, lorem vel rhoncus faucibus, felis magna fermentum augue, et ultricies lacus lorem varius purus. Curabitur eu amet </p>
                    <h2>Personnalité</h2>
                    <p> Curabitur aliquet pellentesque diam. Integer quis metus vitae elit lobortis egestas. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Morbi vel erat non mauris convallis vehicula. Nulla et sapien. Integer tortor tellus, aliquam faucibus</p>
                </div >
            }
        </div >
    );
};

export default CharaPage;