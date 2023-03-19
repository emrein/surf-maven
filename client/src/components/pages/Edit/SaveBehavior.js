import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import { API_URL } from  "./config.js"

function SaveBehavior({ show, handleClose, xml, json }) {
  const [name, setName] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [targetURL, setTargetURL] = useState("");

  function isValidUrl(string) {
    try {
      if (!string.startsWith('http'))
        string = 'http://'+string
      new URL(string);
      return true;
    } catch (err) {
      return false;
    }
  }

  function insertBehavior(data) {
    let methodURL = API_URL+'/add-behaviour';

    console.log(methodURL);

    fetch(methodURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Record inserted successfully:', data);
    })
    .catch(error => {
      console.error('Error inserting record:', error);
    });
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    let entryName = name.trim()
    let okToClose = entryName.length > 0;
    if (!okToClose)
      alert('Please specify a name of this behavoir definition!');
    else {
      okToClose = accessCode.length > 0;
      if (!okToClose)
        alert('Please specify an access code for this behavoir definition!');
      else {
        if (targetURL.length > 0) {
          okToClose = isValidUrl(targetURL);
          if (!okToClose)
            alert('Please specify a valid URL address!');
        }
      }
    }

    if (okToClose) {
      let data = {'definition_name' : name, 'access_code' : accessCode, 'target_url' : targetURL, 'xml_definition' : xml, 'json_definition': json}
      insertBehavior(data);
      handleClose();
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Save Behavior Definition</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Access Code</Form.Label>
            <Form.Control
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Target URL</Form.Label>
            <Form.Control
              type="text"
              value={targetURL}
              onChange={(e) => setTargetURL(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Ok
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SaveBehavior;
