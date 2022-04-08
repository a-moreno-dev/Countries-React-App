import PaginationBarComponent from '../PaginationBarComponent/PaginationBarComponent';
import GridCountriesComponent from '../GridCountriesComponent/GridCountriesComponent';
import StatisticsGridComponent from '../Statistics/StatisticsGridComponent';
import './Countries.css';

const CountriesComponent = () => {
    return (
        <section id="countries">
            <StatisticsGridComponent />
            <GridCountriesComponent />
            <PaginationBarComponent />
        </section>
    )
}

export default CountriesComponent;