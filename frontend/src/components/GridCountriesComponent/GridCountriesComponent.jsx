import { useSelector, connect } from 'react-redux';
import { Link } from 'react-router-dom';
import CountryComponent from '../CountryComponent/CountryComponent';
import './GridCountries.css';

const GridCountriesComponent = ({ sort }) => {
    const { countries, pagination } = useSelector(state => state);
    const arraySort = {};

    arraySort.upNameComparator = (prev, next) => {
        if (prev.name > next.name) return 1;
        if (prev.name < next.name) return -1;
        return 0;
    }
    arraySort.downNameComparator = (prev, next) => {
        if (prev.name < next.name) return 1;
        if (prev.name > next.name) return -1;
        return 0;
    }
    arraySort.upPopulationComparator = (prev, next) => prev.population - next.population;
    arraySort.downPopulationComparator = (prev, next) => next.population - prev.population;

    let _countries = [];

    let msg = <div className='msg'>
        <h2>
            There are not countries asociated to this activity yet.<br />
            Please, go to menu "Manage Activities / Click here to add activity to countries."
        </h2>
        <Link to='/countries/add-activity-to-country'>Go</Link>
    </div>;
    if (Array.isArray(countries) && countries.length > 0) {
        const _pagination = countries.slice(pagination.offset, pagination.limit);
        _countries = _pagination.sort(arraySort[sort]).map(country => {
            return <CountryComponent key={country.alpha3Code} country={country} />
        })
        msg = null;
    }

    return (
        <section className='grid'> {msg} {_countries} </section>
    )
}

const mapStateTpProps = (state) => ({ sort: state.sort })

export default connect(mapStateTpProps, {})(GridCountriesComponent);