import { PokemonClient } from "pokenode-ts";
import { useEffect, useState } from "react";
import styled from "styled-components"

const StyledResults = styled.div`
    .ranked {
        text-transform: capitalize;
    }
`

const Results = ({ ids, api }: { ids: Array<number> | null, api: PokemonClient }) => {
    const [names, setNames] = useState<Array<string>>([]);

    useEffect(() => {
        const getNames = async () => {
            if (ids) {
                let newNames = [];
                for (let i = 0; i < ids.length; i++) {
                    let pokemon = await api.getPokemonById(ids[i]);
                    newNames.push(pokemon.name);
                }
                setNames(newNames);
            }
        }
        getNames();

    }, [ids])

    return (
        <StyledResults>
            {names && names.map((name, i) =>
                <div className={"ranked"} key={i}>{`${i + 1}. ${name}`}</div>
            )}
        </StyledResults>
    )
}

export default Results;