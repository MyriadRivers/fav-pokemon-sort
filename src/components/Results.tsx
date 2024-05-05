import { PokemonClient } from "pokenode-ts";
import { useEffect, useState } from "react";
import styled from "styled-components"
import Result from "./Result";

const StyledResults = styled.div`
    display: grid;

    padding: 10px;
    gap: 10px;

    grid-template-columns: minmax(max(10vw, 100px), 1fr) repeat(auto-fill, minmax(max(10vw, 100px), 1fr));
    .item {
        text-transform: capitalize;
    }
`

const Results = ({ ids, api }: { ids: Array<number> | null, api: PokemonClient }) => {
    const [results, setResults] = useState<Array<{name: string, image: string}>>([]);

    useEffect(() => {
        const getResults = async () => {
            if (ids) {
                let newResults = [];
                for (let i = 0; i < ids.length; i++) {
                    let pokemon = await api.getPokemonById(ids[i]);
                    newResults.push({name: pokemon.name, image: pokemon.sprites.other?.['official-artwork'].front_default ?? ""});
                }
                setResults(newResults);
            }
        }
        getResults();

    }, [ids])

    return (
        <StyledResults>
            {results && results.map((item, i) =>
                <Result name={item.name} image={item.image} rank={i+1}/>
            )}
        </StyledResults>
    )
}

export default Results;