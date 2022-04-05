import React from 'react';
import { useSelector } from 'react-redux';
import AreaStatisticComponent from './AreaStatisticComponent';
import PopulationStatisticComponent from './PopulationStatisticComponent';
import './Statistic.css';

const StatisticsGridComponent = () => {
    const countries = useSelector(state => state.countries)
    let statistics = {
        minArea: { area: Number.POSITIVE_INFINITY },
        maxArea: { area: 0 },
        minPupolation: { population: Number.POSITIVE_INFINITY },
        maxPupolation: { population: 0 }
    }

    const getStatistics = (countries) => {
        if (Array.isArray(countries) && countries.length > 0) {
            if (countries.length > 1) {
                countries.forEach(country => {
                    if (country.area < statistics.minArea.area) statistics.minArea = country;
                    if (statistics.maxArea.area < country.area) statistics.maxArea = country;
                    if (country.population < statistics.minPupolation.population) statistics.minPupolation = country;
                    if (statistics.maxPupolation.population < country.population) statistics.maxPupolation = country;
                })
                return
            }
            statistics.minArea = countries[0];
            statistics.maxArea = countries[0];
            statistics.minPupolation = countries[0];
            statistics.maxPupolation = countries[0];
            return
        }
    }

    getStatistics(countries);
    const { maxArea, minArea, maxPupolation, minPupolation } = statistics;
    return (
        <section className='statistics'>
            {<PopulationStatisticComponent key={1} title={'Min Population'} statistic={minPupolation} />}
            {<PopulationStatisticComponent key={2} title={'Min Population'} statistic={maxPupolation} />}
            {<AreaStatisticComponent key={3} title={'Max Area KM2'} statistic={maxArea} />}
            {<AreaStatisticComponent key={4} title={'Min Area KM2'} statistic={minArea} />}
        </section>
    )
}

export default StatisticsGridComponent;