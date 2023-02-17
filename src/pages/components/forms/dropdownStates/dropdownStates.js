import { useEffect, useState } from "react";
import { fetchStates } from "../../../api/ibge";

const DropdownStates = ({ id, className, onChange }) => {
    const [states, setStates] = useState([])

    useEffect(() => {
        fetchStates().then((states) => {
            return states.map((states) => {
                const { id, sigla } = states
                return { sigla: sigla, id: id }
            }).sort((a, b) => {
                return a.sigla.localeCompare(b.sigla)
            })
        }).then((states) => {
            setStates(states)
        })

    }, [])

    return (
        <select id={id} className={className} onChange={onChange}>
            <option value="">Estado*</option>
            {states.map((state) => {
                const { id, sigla } = state
                return (
                    <option key={id} value={sigla}>
                        {sigla}
                    </option>
                )
            })}
        </select>
    )
}

export default DropdownStates;