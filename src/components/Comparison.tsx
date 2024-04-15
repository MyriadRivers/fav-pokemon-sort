import styled from "styled-components";
import ComparisonCard from "./ComparisonCard";

const StyledComparison = styled.div`
    display: flex;
`

const Comparison = ({ pokemonA, pokemonB, resolver, ready }: {
    pokemonA: { name: string, image: string } | null,
    pokemonB: { name: string, image: string } | null,
    resolver: Function | null,
    ready: boolean
}) => {
    return (
        <StyledComparison>
            {pokemonA && <ComparisonCard name={pokemonA.name} image={pokemonA.image} resolver={resolver ? () => resolver(pokemonA.name, 1) : null} active={ready} />}
            {pokemonB && <ComparisonCard name={pokemonB.name} image={pokemonB.image} resolver={resolver ? () => resolver(pokemonB.name, -1) : null} active={ready} />}
        </StyledComparison>
    )
}

export default Comparison;