import styled from "styled-components";
import ComparisonCard from "./ComparisonCard";
import Button from "./Button";

const StyledComparison = styled.div`
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
            <Button text={"UNDO"} disabled={noUndo} onClick={resolver ? () => resolver("UNDO", 0) : () => console.log("No resolver for comparison.")} />
        </StyledComparison>
    )
}

export default Comparison;