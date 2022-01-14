import styled from "styled-components/native";

export const Bold = styled.Text`
    font-size: 18px;
    color: ${({ theme }) => theme.colors.gray[900]};
    font-weight: bold;
`;

export const Regular = styled.Text`
    font-size: 14px;
    color: ${({ theme }) => theme.colors.gray[500]};
`;
