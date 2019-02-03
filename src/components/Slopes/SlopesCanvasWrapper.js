// @flow
import React from 'react';
import styled from 'styled-components';

import {
  UNIT,
  COLORS,
  LIGHT_BACKGROUND,
  DARK_BACKGROUND,
} from '../../constants';

import Spacer from '../Spacer';
import Button from '../Button';

import { SlopesContext } from './SlopesState';
import PageCluster from './controls/PageCluster';
import SlopesCanvasMargins from './SlopesCanvasMargins';

type Props = {
  width: number,
  height: number,
  children: React$Node,
  enableDarkMode: boolean,
  enableMargins: boolean,
};

const handleClickPurchase = () => {
  // HACK: I've totally broken out of React's abstraction here, because the
  // alternative is more work.
  const storefrontEl = document.querySelector('#slopes-storefront');

  const storefrontVerticalOffset = storefrontEl.getBoundingClientRect().top;

  window.scrollTo({
    top: storefrontVerticalOffset + window.pageYOffset,
    left: 0,
    behavior: 'smooth',
  });
};

const SlopesCanvasWrapper = ({
  width,
  height,
  children,
  enableDarkMode,
  enableMargins,
}: Props) => {
  return (
    <Wrapper>
      <Machine>
        <TopPanel />

        <InnerWrapper>
          <ChildWrapper
            style={{
              backgroundColor: enableDarkMode
                ? DARK_BACKGROUND
                : LIGHT_BACKGROUND,
            }}
          >
            {children}
          </ChildWrapper>
          <SlopesCanvasMargins
            width={width}
            height={height}
            enableDarkMode={enableDarkMode}
            enableMargins={enableMargins}
          />
        </InnerWrapper>

        <Spacer size={UNIT} />

        <Footer>
          <Toggles>
            <PageCluster />
          </Toggles>

          <Button color={COLORS.blue[500]} onClick={handleClickPurchase}>
            Purchase
          </Button>
        </Footer>
      </Machine>
    </Wrapper>
  );
};

// $FlowIgnore
const OptimizedSlopesCanvasWrapper = React.memo(SlopesCanvasWrapper);

const SlopesCanvasWrapperContainer = (props: any) => {
  const slopesParams = React.useContext(SlopesContext);

  return (
    <OptimizedSlopesCanvasWrapper
      {...props}
      enableDarkMode={slopesParams.enableDarkMode}
      enableMargins={slopesParams.enableMargins}
    />
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Machine = styled.div`
  position: sticky;
  top: 0;
  perspective: 200px;
  user-select: none;
  padding: ${UNIT}px;
  background: ${COLORS.gray[100]};
`;

const InnerWrapper = styled.div`
  position: relative;
`;

const ChildWrapper = styled.div`
  position: relative;
  z-index: 1;
`;

const TopPanel = styled.div`
  position: absolute;
  width: 100%;
  height: 15px;
  top: -15px;
  left: 0;
  right: 0;
  background: ${COLORS.gray[300]};
  transform: rotateX(25deg);
  transform-origin: bottom center;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Toggles = styled.div``;

export default SlopesCanvasWrapperContainer;
