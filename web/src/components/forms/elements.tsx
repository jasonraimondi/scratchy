import styled from "@emotion/styled";

export const Label = styled.label`
  display: block;
  padding-bottom: 0.5rem;
  span {
    display: block;
    color: black;
    padding-bottom: 0.1rem;

    &.inline {
      display: inline;
      padding: 0 0.5rem;
    }
  }
`;

export const Button = styled.button`
  font-size: 1em;
  background-color: lightslategrey;
  color: black;
  margin: 0;
  border: none;
`;
