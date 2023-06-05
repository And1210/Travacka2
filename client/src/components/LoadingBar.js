import React from 'react';
import styled from 'styled-components';

const LoadingBarCase = styled.div`
  width: 100%;
  height: 20px;
  border: 3px solid #000;
  background-color: #FFF;
`;

const LoadingBarProgress = styled.div`
  background-color: #000;
  color: #FFF;
`;

function LoadingBar({progress, total}) {
  let width = `${Math.floor(100*progress/total)}%`;

  return (
    <div>
      <LoadingBarCase>
        <LoadingBarProgress style={{width: width}}>{width}</LoadingBarProgress>
      </LoadingBarCase>
    </div>
  )
}

export default LoadingBar;
