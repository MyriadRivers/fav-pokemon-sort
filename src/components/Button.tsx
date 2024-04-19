import { MouseEventHandler } from "react";
import styled from "styled-components"

const StyledButton = styled.button<{ $disabled: boolean }>`
    background: white;

    font-family: "Asket Narrow";
    font-size: 35pt;
    
    padding: 20px;
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