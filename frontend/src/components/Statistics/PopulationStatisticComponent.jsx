import React from 'react';
import { BsPeople } from "react-icons/bs";

const PopulationStatisticComponent = ({ title, statistic }) => {
    const { name, region, population } = statistic;

    return (
        <article>
            <span style={{ 'marginBottom': '0.4em' }}>{title}</span>
            <h3 style={{ 'textAlign': 'center', 'textTransform': 'capitalize' }}>{' ' + name.slice(0, 32)}</h3>
            <span style={{ 'textAlign': 'center', 'textTransform': 'capitalize' }} >{region}</span>
            {<h2>{new Intl.NumberFormat().format(population)}<BsPeople /></h2>}
        </article>
    )
}

export default PopulationStatisticComponent;