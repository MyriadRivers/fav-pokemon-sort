import styled from "styled-components";

const StyledReadyIndicator = styled.div<{ $ready: boolean }>`
    background: ${props => props.$ready ? "lightgreen" : "red"};

    text-align: center;

    padding: 15px;
`

const ReadyIndicator = ({ ready }: { ready: boolean }) => {
    return (
        <StyledReadyIndicator $ready={ready}>
            {ready ? "READY" : "LOADING..."}
        </StyledReadyIndicator>
    )
}

export default ReadyIndicator;