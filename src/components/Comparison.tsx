import styled from "styled-components";
import ComparisonCard from "./ComparisonCard";

const StyledComparison = styled.div`
    display: flex;
`

const Comparison = ({ pokemonA, pokemonB, resolver }: {
    pokemonA: { name: string, image: string } | null,
    pokemonB: { name: string, image: string } | null,
    resolver: Function | null
}) => {
    return (
        <StyledComparison>
            {pokemonA && <ComparisonCard name={pokemonA.name} image={pokemonA.image} resolver={resolver ? () => resolver(pokemonA.name, 1) : null} />}
            {pokemonB && <ComparisonCard name={pokemonB.name} image={pokemonB.image} resolver={resolver ? () => resolver(pokemonB.name, -1) : null} />}
        </StyledComparison>
    )
}

export default Comparison;