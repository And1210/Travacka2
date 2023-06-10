import React from 'react';
import styled from 'styled-components';

// import CBox from './CBox.js';

const DivWrap = styled.div`
  border-radius: 1rem;
  background-color: #4F8A6D99;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  margin: 0.5rem;
`;

const ImageContainer = styled.ul`
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 10px;
  padding: 0;
`;

const ImageItem = styled.li`
  max-width: 100%;
  height: auto;
  margin-top: 10px;
  list-style-type: none;
  margin: auto;
`;

const ImageTag = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  float: left;
`;

function BlogSetupBox({dateData, cmRoute, cb}) {
  const maxMedia = 4;

  return (
    <DivWrap>
      <h3>{dateData.date}</h3>
      <h4>Image Count: {dateData.media_count}</h4>
      <ImageContainer>
        {dateData.img_urls.slice(0, maxMedia).map((url) =>
          <ImageItem><ImageTag src={`${cmRoute}/${url}`} /></ImageItem>
        )}
      </ImageContainer>
      <textarea id={`${dateData.date}-text`} defaultValue={dateData.post} style={{width: '100%'}} rows="10"></textarea>
      <button onClick={() => {cb(dateData.date, document.getElementById(`${dateData.date}-text`).value)}}>Update</button>
    </DivWrap>
  );
}

export default BlogSetupBox;
