import styled from "styled-components";
import ComparisonCard from "./ComparisonCard";

const StyledComparison = styled.div`
    display: flex;
`

const Comparison = ({ pokemonA, pokemonB }: { pokemonA: { name: string, image: string } | null, pokemonB: { name: string, image: string } | null }) => {
    return (
        <StyledComparison>
            {pokemonA && <ComparisonCard name={pokemonA.name} image={pokemonA.image} />}
            {pokemonB && <ComparisonCard name={pokemonB.name} image={pokemonB.image} />}
        </StyledComparison>
    )
}

export default Comparison;