class Country {
    constructor({data}) {
        this.alpha3Code = data.alpha3Code || '';
        this.area = data.area || '';
        this.borders = data.borders ? data.borders.join().trim().toLowerCase() : false;
        this.callingCodes = data.callingCodes ? data.callingCodes[0] : '';
        this.capital = data.capital || '';
        this.cioc = data.cioc || '';
        this.currencies = data.currencies ? `Code ${data.currencies[0].code} , Name ${data.currencies[0].name}` : '';
        this.demonym = data.demonym || '';
        this.flag = data.flag || '';
        this.gini = data.gini || '';
        this.independent = data.independent ? 'Yes' : 'No';
        this.population = data.population || '';
        this.language = data.languages ? data.languages[0].name : '';
        this.latlng = data.latlng ? `${data.latlng[0]}, ${data.latlng[1]}` : '';
        this.name = data.name || '';
        this.numericCode = data.numericCode || '';
        this.region = data.region || '';
        this.regionalBloc = data.regionalBlocs ? data.regionalBlocs[0].name : '';
        this.subregion = data.subregion || '';
        this.timezones = data.timezones ? data.timezones[0] : '';
        this.activities = [];
    }
}

module.exports = Country;