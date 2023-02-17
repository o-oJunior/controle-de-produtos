import { useEffect, useState } from "react";
import { fetchCitiesForState } from "../../../api/ibge";

const DropdownCities = ({ id, className, onChange, state }) => {
    const [cities, setCities] = useState([])
    const setRepeat = new Set();

    useEffect(() => {
        fetchCitiesForState(state).then((cities) => {
            const filterCities = cities.filter(({ nome }) => {
                const citieRepeat = setRepeat.has(nome);
                setRepeat.add(nome);
                return !citieRepeat;
            });
            return filterCities.map((cities) => {
                const { id, nome } = cities
                return { nome: nome, id: id }
            }).sort((a, b) => {
                return a.nome.localeCompare(b.nome)
            })
        }).then((cities) => {
            setCities(cities)
        })
    }, [state])

    return (
        <select id={id} className={className} onChange={onChange}>
            <option value="">Cidade*</option>
            {cities.map((citie) => {
                const { id, nome } = citie
                return (
                    <option key={id} value={nome}>
                        {nome}
                    </option>
                )
            })}
        </select>
    )
}

export default DropdownCities;