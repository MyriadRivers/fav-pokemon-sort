import styled from "styled-components";

const StyledReadyIndicator = styled.div<{ $ready: boolean }>`
    background: ${props => props.$ready ? "lightgreen" : "red"}
`

const ReadyIndicator = ({ ready }: { ready: boolean }) => {
    return (
        <StyledReadyIndicator $ready={ready}>
            {`Ready for comparison? ${ready}`}
        </StyledReadyIndicator>
    )
}

export default ReadyIndicator;