const BASE_URL = 'https://servicodados.ibge.gov.br/api/v1'

const fetchStates = () => {
    const url = `${BASE_URL}/localidades/estados`

    return fetch(url).then(response => response.json())
}

const fetchCitiesForState = (state) => {
    const url = `${BASE_URL}/localidades/estados/${state}/distritos`

    return fetch(url).then(response => response.json())
}

export { fetchStates, fetchCitiesForState };
