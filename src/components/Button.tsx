import { MouseEventHandler } from "react";
import styled from "styled-components"
import breakpoints from "../styles/breakpoints";

const StyledButton = styled.button<{ $disabled: boolean }>`
    font-family: "Asket Narrow";
    font-size: max(4vw, 16pt);
    
    padding: 30px;
    border: none;

    &:hover {
        cursor: ${props => props.$disabled ? "auto" : "pointer"};
    }
`

const Button = ({ text, disabled, onClick }: { text: string, disabled: boolean, onClick: MouseEventHandler }) => {
    return (
        <StyledButton $disabled={disabled} disabled={disabled} onClick={onClick}>
            {text}
        </StyledButton>
    )
}

export default Button;