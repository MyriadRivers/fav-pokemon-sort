import { createGlobalStyle } from 'styled-components'

import AsketNarrowOtf from "../assets/fonts/AsketNarrow/AsketNarrowLight.otf";
import AsketNarrowEot from "../assets/fonts/AsketNarrow/AsketNarrowLight.eot";
import AsketNarrowSvg from "../assets/fonts/AsketNarrow/AsketNarrowLight.svg";
import AsketNarrowTtf from "../assets/fonts/AsketNarrow/AsketNarrowLight.ttf";
import AsketNarrowWoff from "../assets/fonts/AsketNarrow/AsketNarrowLight.woff";
import breakpoints from './breakpoints';

const GlobalStyle = createGlobalStyle`
    @font-face {
        font-family: 'Asket Narrow';
        src: url(${AsketNarrowOtf}) format('otf'),
             url(${AsketNarrowEot}) format('embedded-opentype'),
             url(${AsketNarrowWoff}) format('woff'),
             url(${AsketNarrowTtf}) format('truetype'),
             url(${AsketNarrowSvg}) format('svg');
    }

    html, #root {
        height: 100%;
    }

    body {
        font-family: "Asket Narrow";
        font-size: max(2vw, 16pt);
        
        width: 100%;
        height: 100%;
        
        margin: 0;
        padding: 0;
    }
`

export default GlobalStyle;