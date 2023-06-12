import React from 'react';
import styled from 'styled-components';

const CalendarContainerComponent = styled.div`
  font-family: ElegantTypewriter;

  .react-calendar__navigation {
    display: flex;

    .react-calendar__navigation__label {
      font-weight: bold;
    }

    .react-calendar__navigation__arrow {
      flex-grow: 0.333;
    }
  }

  button {
    margin: 4px;
    background-color: #FFF;
    border: 0;
    border-radius: 5px;
    color: #000;
    padding: 6px 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    font-family: ElegantTypewriter;

    &:hover {
      background-color: #000;
      color: #FFF;
      transition: background-color 0.8s ease;
    }

    &:disabled {
      background-color: #DFDFDF;
      color: #000;
    }
  }

  .react-calendar__month-view__days {
    display: grid !important;
    grid-template-columns: 14.2% 14.2% 14.2% 14.2% 14.2% 14.2% 14.2%;

    .react-calendar__tile {
      max-width: initial !important;
    }
  }
`;

function CalendarContainer(props) {
  return (
    <CalendarContainerComponent>
      {props.children}
    </CalendarContainerComponent>
  );
}

export default CalendarContainer;
