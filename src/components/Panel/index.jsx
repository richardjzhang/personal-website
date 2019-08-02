// @flow
import React, { type Node } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  flex: 1;
  box-sizing: border-box;
`;
type Props = {|
  minHeight?: string,
  backgroundColor?: string,
  marginTop?: number,
  paddingTop?: number,
  paddingRight?: number,
  paddingBottom?: number,
  paddingLeft?: number,
  isCenteredVertically?: boolean,
  isCenteredHorizontally?: boolean,
  children?: Node
|};

const Panel = ({
  minHeight,
  backgroundColor,
  marginTop,
  paddingTop,
  paddingRight,
  paddingBottom,
  paddingLeft,
  isCenteredVertically,
  isCenteredHorizontally,
  children
}: Props) => (
  <Container
    style={{
      minHeight,
      backgroundColor,
      marginTop,
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft,
      ...(isCenteredVertically
        ? {
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column'
          }
        : {}),
      ...(isCenteredHorizontally
        ? {
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column'
          }
        : {})
    }}
  >
    {children}
  </Container>
);

export default Panel;
