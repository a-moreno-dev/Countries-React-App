import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css'


const LandingPageComponent = () => {
    return (
        <section id='landing'>
            <article className='info'>
                <header>
                    <h1>Wellcome to React.js Countries App</h1>
                </header>
                <article>
                    <p>
                        This application was developed using the restcountries.com API.
                        It allows users to see relevant information from countries on all
                        the continents of the planet, as well as being able to manage
                        tourist activities and associate them with a specific country.
                        The technologies used:
                        <br />
                        <br />
                        <strong>Front-End</strong> ReactJS, Redux, Axios, JSON, HTML, CSS.<br />
                        <strong>Back-End</strong> NodeJS, ExpressJS, PostgreSQL, Sequelize, Axios, JSON.
                    </p>
                </article>
            </article>
            <Link to='/countries' className='landing-button'>GO TO APP</Link>
        </section>
    )
}

export default LandingPageComponent;