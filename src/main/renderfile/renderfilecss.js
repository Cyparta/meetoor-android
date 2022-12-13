import styled, { css } from 'styled-components';
import { flexDisplay } from '../../styles/basecss';
//////////////////////////////////////////////////
const OuterSharedCss = css`
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    ${flexDisplay}
    border-radius: 5px;
    margin: auto;
`;
//////////////////////////////////////////////////
export const FileAsCreateDownload = styled.View`
    ${OuterSharedCss}
`;
//////////////////////////////////////////////////
export const FileImage = styled.TouchableOpacity`
    ${OuterSharedCss}
    align-items: flex-start;
    border-radius: 0px;
    ${props => props.css || null}
`;
//////////////////////////////////////////////////
export const FileImageUri = styled.Image`
    ${OuterSharedCss}
    height: auto;
    border-radius: 5px;
`;