import styled from "styled-components/native";
import { MotiView } from "moti";

export const Container = styled(MotiView)`
    width: 100%;
    height: 5px;
    position: relative;
    margin: 16px 0px;
    border-radius: 8px;
    overflow: hidden;
`;

export const Bar = styled.View`
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;

    width: 100%;
    height: 5px;
    border-radius: 8px;
    background-color: ${({ theme }) => theme.colors.primary}1c;
`;

export const Progress = styled(MotiView)`
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;

    max-width: 100%;
    width: 50px;
    height: 5px;
    border-radius: 8px;
    background-color: ${({ theme }) => theme.colors.primary};
`;