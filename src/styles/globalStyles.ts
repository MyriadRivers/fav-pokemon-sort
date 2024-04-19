import { createGlobalStyle } from 'styled-components'

import AsketNarrowOtf from "../assets/fonts/AsketNarrow/AsketNarrowLight.otf";
import AsketNarrowEot from "../assets/fonts/AsketNarrow/AsketNarrowLight.eot";
import AsketNarrowSvg from "../assets/fonts/AsketNarrow/AsketNarrowLight.svg";
import AsketNarrowTtf from "../assets/fonts/AsketNarrow/AsketNarrowLight.ttf";
import AsketNarrowWoff from "../assets/fonts/AsketNarrow/AsketNarrowLight.woff";

const GlobalStyle = createGlobalStyle`
    @font-face {
        font-family: 'Asket Narrow';
        src: url(${AsketNarrowOtf}) format('otf'),
             url(${AsketNarrowEot}) format('embedded-opentype'),
             url(${AsketNarrowWoff}) format('woff'),
             url(${AsketNarrowTtf}) format('truetype'),
             url(${AsketNarrowSvg}) format('svg');
    }

    body {
        background: pink;
        font-family: "Asket Narrow";
        margin: 0;
        padding: 0;
    }
`

export default GlobalStyle;