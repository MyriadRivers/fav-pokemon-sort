import styled from "styled-components";

const StyledReadyIndicator = styled.div<{ $ready: boolean }>`
    background: ${props => props.$ready ? "lightgreen" : "red"};

    font-size: 35pt;
    text-align: center;

    padding: 20px;
`

const ReadyIndicator = ({ ready }: { ready: boolean }) => {
    return (
        <StyledReadyIndicator $ready={ready}>
            {ready ? "READY" : "LOADING..."}
        </StyledReadyIndicator>
    )
}

export default ReadyIndicator;