import { PokemonClient } from "pokenode-ts";
import { Ref, forwardRef, useEffect, useRef, useState } from "react";
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
    const resultsRef = useRef<HTMLDivElement | null>(null);
    const imgRefs = useRef<Array<HTMLImageElement | null>>(ids ? ids.map(() => null) : []);
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

    const scrollToResults = () => {
        console.log("SCROLL!!!!");
        if (imgRefs.current && imgRefs.current.every((imgRef) => {
            if (imgRef) return imgRef.complete;
            return false;
        })) {
            if (resultsRef.current) {
                console.log("we loaded boiz");
                resultsRef.current.scrollIntoView();
            }
        }
    }

    useEffect(() => {
        window.addEventListener("keydown", (key) => {
            if (key.code === "Space" && resultsRef.current) resultsRef.current.scrollIntoView();
        })
    }, [])

    return (
        <StyledResults ref={resultsRef}>
            {results && results.map((item, i) => 
            <Result name={item.name} image={item.image} rank={i+1} key={i} ref={el => imgRefs.current[i] = el} autoScroll={scrollToResults}/>)}
        </StyledResults>
    )
}

export default Results;