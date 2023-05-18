import React from 'react';
import { NavLink } from "react-router-dom";

import axios from "axios";
import { useEffect, useState } from "react"
import ReactEcharts from "echarts-for-react"
import { agreg } from '../helpers/helpers';


const Home = () => {

    const [booksData, setBooksData] = useState("")
    const [housesData, setHousesData] = useState("")
    const [options, setOptions] = useState()
    const [options2, setOptions2] = useState()
    const [options3, setOptions3] = useState()
    const maxPage = Math.ceil(444 / 50);

    const [reload, setReload] = useState(false)
    useEffect(() => {
        //perso par livre///
        let bookNames = []
        let dataPages = []
        axios.get(`https://www.anapioficeandfire.com/api/books?page=1&pageSize=50`)
            .then((res) => {
                setBooksData(res.data)
                let charactersPerBook = []
                let dataPrep = []
                res.data.map((book) => {
                    bookNames.push(book.name)
                    charactersPerBook.push(book.characters.length)
                    dataPrep.push({ value: book.characters.length, name: book.name })
                    dataPages.push(book.numberOfPages)
                })
                dataPrep.sort((a, b) => {
                    return b.value - a.value
                })

                setOptions(
                    {
                        legend: {
                            top: 'bottom'
                        },
                        tooltip: {
                            trigger: 'item'
                        },
                        toolbox: {
                            show: true,
                            feature: {
                                mark: { show: true },
                                dataView: { show: true, readOnly: true },
                                saveAsImage: { show: true }
                            }
                        },
                        series: [
                            {
                                name: 'Personnages par livre',
                                type: 'pie',
                                radius: [75, 200],
                                center: ['50%', '50%'],
                                roseType: 'area',
                                itemStyle: {
                                    borderRadius: 3
                                },
                                data: dataPrep
                            }
                        ]
                    }
                )
                //prepa pour pages par livres
                setOptions3({
                    title: [
                        {
                            text: '',
                        }
                    ],
                    toolbox: {
                        show: true,
                        feature: {
                            mark: { show: true },
                            dataView: { show: true, readOnly: true },
                            saveAsImage: { show: true }
                        }
                    },
                    polar: {
                        radius: [30, '100%']
                    },
                    angleAxis: {
                        max: 1100,
                        startAngle: 120
                    },
                    radiusAxis: {
                        type: 'category',
                        data: bookNames
                    },
                    tooltip: {},
                    series: {
                        type: 'bar',
                        data: dataPages,
                        coordinateSystem: 'polar',
                        label: {
                            show: true,
                            position: 'middle',
                            formatter: '{b}: {c}'
                        }
                    }
                })


            })///perso par livre/////////////////


        //REGIONS DES MAISONS LES PLUS COMMUNES////////////////////////////////
        let urls = []
        let tmpHouses = []
        for (let i = 1; i < maxPage + 1; i++) {
            urls.push(`https://www.anapioficeandfire.com/api/houses?page=${i}&pageSize=50`)
        }

        const requests = urls.map((url) => axios.get(url))
        axios.all(requests).then((responses) => {
            responses.forEach((resp) => {
                tmpHouses.push(resp.data)
            })
            let tmpHouses2 = tmpHouses.flat(1)
            let tmpHouses3 = []
            tmpHouses2.map((house) => (
                tmpHouses3.push(house.region)
            ))
            agreg(tmpHouses3)
            setHousesData(agreg(tmpHouses3))
            let dataPrep = []
            for (const [key, value] of Object.entries(housesData)) {
                dataPrep.push({ value: value, name: key })
            }
            setOptions2(
                {
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        top: '5%',
                        left: 'center'
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            mark: { show: true },
                            dataView: { show: true, readOnly: true },
                            saveAsImage: { show: true }
                        }
                    },
                    series: [
                        {
                            name: 'Region',
                            type: 'pie',
                            radius: ['40%', '70%'],
                            avoidLabelOverlap: false,
                            itemStyle: {
                                borderRadius: 10,
                                borderColor: '#fff',
                                borderWidth: 2
                            },
                            label: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    fontSize: 40,
                                    fontWeight: 'bold'
                                }
                            },
                            labelLine: {
                                show: false
                            },
                            data: dataPrep
                        }
                    ]
                }
            )
            setReload(true)
        })////////////////////////////////

    }, [reload])

    return (
        <div className="home">
            <h1>Game Of Thrones</h1>
            <div className="container">
                <div className="elem-home home-books">
                    <h2>
                        <NavLink to="/books"><span>LIVRES</span></NavLink>
                    </h2>
                </div>
                <div className="elem-home home-houses">
                    <h2>
                        <NavLink to="/houses"><span>MAISONS</span></NavLink>
                    </h2>
                </div>
                <div className="elem-home home-characters">
                    <h2>
                        <NavLink to="/characters"><span>PERSONNAGES</span></NavLink>
                    </h2>
                </div>
            </div>
            <div className='stats'>
                <h2>Statistiques🤓</h2>
                {options &&
                    <div className="persoperbook">
                        <h3>Personnages par livre</h3>
                        <ReactEcharts
                            option={options}
                            style={{ width: "100%", height: "600px", padding: "1rem" }}
                        ></ReactEcharts>
                    </div>
                }
                {options2 &&
                    <div className="persoperbook">
                        <h3>Regions des maisons les plus communes</h3>
                        <ReactEcharts
                            option={options2}
                            style={{ width: "100%", height: "600px", padding: "1rem" }}
                        ></ReactEcharts>
                    </div>
                }
                {options3 &&
                    <div className="persoperbook">
                        <h3>Pages par livres</h3>
                        <ReactEcharts
                            option={options3}
                            style={{ width: "100%", height: "1000px", padding: "1rem" }}
                        ></ReactEcharts>
                    </div>
                }
            </div>
        </div>
    );
};

export default Home;