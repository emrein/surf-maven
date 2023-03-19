import React, { useState, useEffect } from "react";
import { Modal, Button, Table } from "react-bootstrap";
import { API_URL } from "./config.js"

class PageData {
  constructor(){
    this.behavioursList = []
  }
}

let bhList = [
  { id: 1, name: "Behavior 1", acode: 'A1', xml:null, json:null },
  { id: 2, name: "Behavior 2", acode: 'A2', xml:null, json:null },
  { id: 3, name: "Behavior 3", acode: 'A3', xml:null, json:null },
  { id: 4, name: "Behavior 4", acode: 'A4', xml:null, json:null },
  { id: 5, name: "Behavior 5", acode: 'A5', xml:null, json:null }
];

function BehaviorSelect({ show, onHide, onSelect }) {
  const [selectedId, setSelectedId] = useState(null);

  const [data, setData] = useState(null); // Initialize data state as null

  useEffect(() => {
    // Load data here
    let methodURL = API_URL + '/behaviours';
    const fetchData = async () => {
      const response = await fetch(methodURL);
      const jsonData = await response.json();
      let pd = new PageData();
      pd.behavioursList = [];

      for(let i = 0; i < jsonData.length; i++) {
        let obj = jsonData[i];
        pd.behavioursList.push({ id: obj.id, name: obj.definition_name, acode: obj.access_code, xml:obj.xml_definition, json:obj.json_definition },);
      }


      setData(pd);
    };
    fetchData();
  }, []); // Empty dependency array ensures this only runs on component mount

  const handleRowClick = (id) => {
    setSelectedId(id);
  };

  const handleSelect = () => {
    if (selectedId) {
      const selectedBehavior = data.behavioursList.find((d) => d.id === selectedId);

      onSelect(selectedBehavior);

      setSelectedId(null);
    }
  };

  const handleClose = () => {
    setSelectedId(null);
    onHide();
  };

  function getBehavioursList() {
    let methodURL = API_URL + '/behaviours';
    console.log(`getBehavioursList `);

    fetch(methodURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log('List fetched successfully:', data);
      })
      .catch(error => {
        console.error('Error fetching list:', error);
      });

  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Select Behavior</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover size="lg">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Access Code</th>
              </tr>
            </thead>
            <tbody>
              {data.behavioursList.map((d) => (
                <tr
                  key={d.id}
                  onClick={() => handleRowClick(d.id)}
                  className={selectedId === d.id ? "table-primary" : ""}
                >
                  <td>{d.id}</td>
                  <td>{d.name}</td>
                  <td>{d.acode}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSelect} disabled={!selectedId}>
            Select
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BehaviorSelect;
