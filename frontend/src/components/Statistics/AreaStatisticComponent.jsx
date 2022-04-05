import React from 'react';

const AreaStatisticComponent = ({ title, statistic }) => {
    const { name, region, area } = statistic;
    return (
        <article>
            <span style={{ 'marginBottom': '0.4em' }}>{title}</span>
            <h3 style={{ 'textAlign': 'center', 'textTransform': 'capitalize' }}>{' ' + name.slice(0, 32)}</h3>
            <span style={{ 'textAlign': 'center', 'textTransform': 'capitalize' }} >{region}</span>
            {<h2>{new Intl.NumberFormat().format(area)} KM<sup>2</sup></h2>}
        </article>
    )
}

export default AreaStatisticComponent;