import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Roboto', Arial, sans-serif;
    color: #333;
    background-color: #f8f9fa;
    margin: 0;
    padding: 0;
  }
  button {
    font-family: inherit;
    transition: background-color 0.3s, transform 0.2s;
    cursor: pointer;
  }
  input, select, textarea {
    font-family: inherit;
    border-radius: 4px;
    padding: 8px;
    border: 1px solid #ccc;
    box-sizing: border-box;
  }
`;
