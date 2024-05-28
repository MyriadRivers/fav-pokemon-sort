import styled from "styled-components";

const StyledReadyIndicator = styled.div<{ $ready: boolean, $done: boolean; }>`
    background: ${props => props.$done ? "#86cecb" : (props.$ready ? "lightgreen" : "red")};

    text-align: center;

    padding: 15px;
`

const ReadyIndicator = ({ ready, done }: { ready: boolean, done: boolean }) => {
    return (
        <StyledReadyIndicator $ready={ready} $done={done}>
            {done ? "SORTING FINISHED!" : (ready ? "READY" : "LOADING...")}
        </StyledReadyIndicator>
    )
}

export default ReadyIndicator;