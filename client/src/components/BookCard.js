import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  display: grid;
  grid-template-rows: 2fr 1fr;
  grid-template-columns: 1fr;
  border-radius: 1rem;
  width: 25%;
  grid-gap: 0px;
`;

const CardItem = styled.div`
  margin: 10px;
`;

const CoverImage = styled.img`
  height: 20vh;
`;

function BookCard({title, author, url}) {
  return (
    <>
      <CardContainer>
        <CardItem>
          <CoverImage src={url} />
        </CardItem>
        <CardItem>
          <div style={{'fontWeight': 'bold'}}>{title}</div>
          <div>by {author}</div>
        </CardItem>
      </CardContainer>
    </>
  );
}

export default BookCard;
