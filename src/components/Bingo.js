import _ from "lodash";
import React from "react";
import PropTypes from "prop-types";
import pure from "recompose/pure";
import styled from "styled-components";
import { Grid, Button, Loader, Segment, Icon } from "semantic-ui-react";

const Intro = styled.p`
  font-size: large;
`;

const Bingo = ({ numbers, sendNumber, disabled, className }) => {
  if (numbers.length === 0) {
    return <Loader inline active />;
  }
  const colNum = numbers.length;
  return (
    <Grid
      className={className}
      columns={colNum}
      as={Segment}
      disabled={disabled}
      textAlign="center"
      style={{ backgroundColor: "#b3e0ff" }}
    >
      {_.map(numbers, (row, i) => {
        return (
          <Grid.Row key={`bingo-row-${i}`}>
            {_.map(row, (col, j) => {
              return (
                <Grid.Column key={`bingo-col-${j}`}>
                  <Button
                    fluid
                    style={{
                      height: "100%",
                      backgroundColor: "#fff",
                      border: "4px solid #ff6600"
                    }}
                    size="big"
                    value={col.value}
                    onClick={sendNumber}
                    disabled={disabled ? true : col.selected}
                    content={
                      col.selected ? (
                        <Icon name="circle" color="red" />
                      ) : (
                        col.value
                      )
                    }
                  />
                </Grid.Column>
              );
            })}
          </Grid.Row>
        );
      })}
    </Grid>
  );
};

Bingo.propTypes = {
  sendNumber: PropTypes.func.isRequired,
  numbers: PropTypes.array.isRequired
};

export default pure(Bingo);