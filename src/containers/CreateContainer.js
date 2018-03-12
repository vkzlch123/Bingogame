import React, { Component } from "react";
import PropTypes from "prop-types";
import { createStructuredSelector, createSelector } from "reselect";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as RoomActions from "actions/room";

import { Procedure, Intro, Select, ShareAndGo, Input } from "components";

import { Segment, Form, Button } from "semantic-ui-react";
const options = [
  { key: 2, text: "2 people - min", value: 2 },
  { key: 3, text: "3 people", value: 3 },
  { key: 4, text: "4 people", value: 4 },
  { key: 5, text: "5 people", value: 5 },
  { key: 6, text: "6 people - max", value: 6 }
];
class CreateContainer extends Component {
  static propTypes = {
    room: PropTypes.object.isRequired,
    createRoom: PropTypes.func.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      roomTitle: "",
      maxUser: 0,
      roomId: undefined,
      step: "create"
    };
  }
  componentDidMount() {
    const { isCreated, id } = this.props.room;
    if (isCreated) {
      this.setState({ roomId: id, step: "share" });
    }
  }
  onTitleChange = ({ target }) => {
    const { value } = target;
    this.setState({ roomTitle: value });
  };
  onMaxChange = (e, { value }) => {
    this.setState({ maxUser: value });
  };
  onSubmit = () => {
    const { maxUser, roomTitle } = this.state;
    if (roomTitle.length < 5) {
      return alert("Please input at least 5 letters for the title.");
    }
    if (maxUser < 1) {
      return alert("Please select the number of users.");
    }
    this.props
      .createRoom(maxUser, roomTitle)
      .then(callback => {
        const { id } = callback;
        this.setState({ roomId: id, step: "share" });
      })
      .catch(err => {
        alert(err);
      });
  };
  onBackToCreate = () => {
    this.setState({
      step: "create",
      roomTitle: "",
      roomId: undefined,
      maxUser: 0
    });
  };
  onCopyClick = () => {
    /* Get the text field */
    const copyText = document.getElementById("myInput");
    /* Select the text field */
    copyText.select();

    /* Copy the text inside the text field */
    document.execCommand("Copy");
  };
  render() {
    const { roomId, step, roomTitle, maxUser } = this.state;
    let segment = (
      <div className="text-center">
        <p>
          Choose the maximum number of players.<br />
          And create your game!
        </p>
        <Form onSubmit={this.onSubmit}>
          <Input
            label="Title: "
            name="room_title"
            value={roomTitle}
            type="text"
            onChange={this.onTitleChange}
            placeholder="Input your title"
          />
          <Select
            name="max_user"
            type="number"
            label="Play with: "
            placeholder="Select the number of users"
            options={options}
            onChange={this.onMaxChange}
            value={maxUser}
          />
          <Button
            type="submit"
            size="large"
            style={{ backgroundColor: "#84468B", color: "white" }}
            icon="plus"
            labelPosition="right"
            content="Create"
          />
        </Form>
      </div>
    );
    if (step === "share") {
      segment = (
        <ShareAndGo
          roomId={roomId ? roomId : null}
          maxUser={parseInt(this.props.room.maxUser)}
          roomTitle={roomTitle}
          onCopyClick={this.onCopyClick}
        />
      );
    }
    return (
      <Segment basic>
        {step === "create" ? <Intro /> : null}
        <Procedure
          step={step}
          segment={segment}
          onClick={this.onBackToCreate}
        />
      </Segment>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  room: createSelector(state => state.room, roomState => roomState)
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(RoomActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateContainer);
