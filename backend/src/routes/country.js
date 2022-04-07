class Country {
    constructor(data) {
        this.alpha3Code = data.alpha3Code.toLowerCase();
        this.name = data.name.toLowerCase();
        this.flag = data.flag || data.flags.png;
        this.region = data.region.toLowerCase();
        this.capital = data.capital ? data.capital.toLowerCase(): '';
        this.subregion = data.subregion.toLowerCase();
        this.area = data.area;
        this.population = data.population;
    }
}

module.exports = Country;