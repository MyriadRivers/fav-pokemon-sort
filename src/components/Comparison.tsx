import styled from "styled-components";
import ComparisonCard from "./ComparisonCard";

const StyledComparison = styled.div`
    background: orange;
    display: flex;
    flex-direction: column;

    .cardHolder {
        display: flex;
    }
`

const Comparison = ({ pokemonA, pokemonB, noUndo, resolver, ready }: {
    pokemonA: { name: string, image: string } | null,
    pokemonB: { name: string, image: string } | null,
    noUndo: boolean,
    resolver: Function | null,
    ready: boolean
}) => {
    return (
        <StyledComparison>
            <div className={"cardHolder"}>
                {pokemonA && <ComparisonCard name={pokemonA.name} image={pokemonA.image} resolver={resolver ? () => resolver(pokemonA.name, -1) : null} active={ready} />}
                {pokemonB && <ComparisonCard name={pokemonB.name} image={pokemonB.image} resolver={resolver ? () => resolver(pokemonB.name, 1) : null} active={ready} />}
            </div>
            <button className={"undo"} disabled={noUndo} onClick={resolver ? () => resolver("UNDO", 0) : () => console.log("No resolver for comparison.")}>Undo</button>
        </StyledComparison>
    )
}

export default Comparison;