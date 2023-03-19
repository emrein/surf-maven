import React, { useRef, useEffect, useState } from "react";
import "./Edit.css";
import { BlocklyWorkspace } from "react-blockly";
import Blockly from 'blockly/core';
import "blockly/javascript.js"
import "../../custom_blocks/CustomBlocks";
import init_custom_blocks from "../../custom_blocks/CustomBlocks";
import "react-bootstrap";
import SaveBehavior from "./SaveBehavior";
import BehaviorSelect from "./BehaviorSelect";
import toolboxCategories from "./ToolboxCategories";
import { API_URL } from  "./config.js"

const Edit = () => {

  const workspaceRef = useRef(null);

  const [currentXml, setCurrentXml] = useState('');

  const [xml, setXml] = useState("");
  const [xmlCode, setXmlCode] = useState("");
  const [jsonCode, setJSONCode] = useState("");
  const [formData, setFormData] = useState({});

  const [showPopup, setShowPopup] = useState(false);

  const [showBehaviorSelect, setShowBehaviorSelect] = useState(false);
  const [selectedBehavior, setSelectedBehavior] = useState(null);
  const [showRemoveBehaviorSelect, setShowRemoveBehaviorSelect] = useState(false);
  const [selectedRemoveBehavior, setSelectedRemoveBehavior] = useState(false);

  useEffect(() => {
    const loadWorkspace = () => {
      // Make sure the Blockly library has finished loading

      if (Blockly.JavaScript) {
        const workspace = Blockly.inject(workspaceRef.current, {
          toolbox: xmlCode,
          grid: {
            spacing: 20,
            length: 3,
            colour: "#ccc",
            snap: true,
          },
        });
      }
    };

    loadWorkspace();
  }, []);

  useEffect(() => {
    if (workspaceRef.current && currentXml) {

      var workspace = Blockly.getMainWorkspace();
      workspace.clear();
      try {
        Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(currentXml), workspace);
      } catch (error) {
        workspace.clear();
      }

    }
  }, [currentXml]);

  const initialXml =
    '<xml xmlns="https://developers.google.com/blockly/xml"></xml>';

  function appendStr(to, add) {
    return to.length == 0 ? add : to + ', ' + add;
  }

  function addIfHasValue(json, label, value, noneValue = undefined) {
    if (value && value != null) {
      json = appendStr(json, '"' + label + '"' + ': "' + value + '"');
    }
    else if (noneValue !== undefined) {
      json = appendStr(json, '"' + label + '"' + ': "' + noneValue + '"');
    }
    return json;
  }

  function showConfirmationBox(message) {
    return confirm(message);
  }

  function qStr(str) {
    return '"' + str + '"';
  }

  function getBlockInfo(ws, block) {
    let json = "";

    //json = appendStr(json, '"id"'+':' + qStr(block.id));
    json = appendStr(json, '"type"' + ':' + qStr(block.type));

    json = addIfHasValue(json, 'behaviour_type', block.getFieldValue('behaviour_type'));
    json = addIfHasValue(json, 'time_dependency', block.getFieldValue('time_dependency'));
    json = addIfHasValue(json, 'seconds', block.getFieldValue('seconds'));
    json = addIfHasValue(json, 'url', block.getFieldValue('url'));
    json = addIfHasValue(json, 'element_id', block.getFieldValue('element_id'));
    json = addIfHasValue(json, 'for_count', block.getFieldValue('for_count'));
    json = addIfHasValue(json, 'pace', block.getFieldValue('pace'));
    json = addIfHasValue(json, 'until_the_end', block.getFieldValue('until_the_end'));
;

    json = json + '\n';

    return json;
  }

  function traverseBlocks(ws, result, rootBlock, callback) {

    result += '{'

    let blockHeader = getBlockInfo(ws, rootBlock);
    result += blockHeader
    let rootNext = rootBlock.getNextBlock();

    var children = rootBlock.getChildren();
    if (children && children.length > 0 && (rootNext == null || children[0].id !== rootNext.id)) {
      result += ', "children": [';

      let child = children[0];
      let ended = false;
      while (!ended) {
        let next = child.getNextBlock();
        result = traverseBlocks(ws, result, child, callback);

        ended = next === undefined || next == null
        if (!ended) {
          child = next;
          result += ', ';
        }
      }

      result += ' ]';
    }
    result += '}';

    return result;
  }

  function getJSONofBlocks(ws, blockList) {
    let returnJSON = "";

    if (blockList) {
      let rootCnt = 0;
      for (var i = 0; i < blockList.length; i++) {
        let r = traverseBlocks(ws, "", blockList[i], getBlockInfo);
        returnJSON = appendStr(returnJSON, r);
        rootCnt += 1
      }
      if (rootCnt > 1)
        returnJSON = '[' + returnJSON + ']'
    }

    return returnJSON;
  }

  function getGroupByNext(block) {
    let group = []
    group.push(block);
    let next = block.getNextBlock();
    while (next) {
      group.push(next);
      next = next.getNextBlock();
    }
    return group;
  }

  function getAllBlocks(ws) {
    let allJSONs = "";

    const topBlocks = ws.getTopBlocks();
    if (topBlocks) {
      let rootCnt = 0;
      for (var i = 0; i < topBlocks.length; i++) {
        let blockGroup = getGroupByNext(topBlocks[i])
        if (blockGroup) {
          let groupJSON = getJSONofBlocks(ws, blockGroup)
          allJSONs = appendStr(allJSONs, groupJSON);
          rootCnt += 1
        }
      }
      if (rootCnt > 1)
        allJSONs = '[' + allJSONs + ']'
    }
    return allJSONs;
  }

  function workspaceDidUpdate(workspace) {
    let jsonstr = getAllBlocks(workspace);
    setJSONCode(jsonstr);
    setXmlCode(xml);
  }

  function workspaceInit(workspace) {

    init_custom_blocks();

    console.log('workspaceInit');
    return true;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    // Do something with the form data, such as send it to an API
    console.log(formData);
  };

  const handleClosePopup = () => setShowPopup(false);
  const handleShowPopup = () => setShowPopup(true);

  const handleSelectBehavior = (behavior) => {
    setSelectedBehavior(behavior);

    console.log('handleSelectBehavior');
    setXmlCode(behavior.xml);

    setCurrentXml(behavior.xml);

    setShowBehaviorSelect(false);
  };

  const handleShowBehaviorSelect = () => {
    setShowBehaviorSelect(true);
  };

  function handleDelete(behavior) {
    console.log("Deleting item...");

    let methodURL = API_URL+'/delete-behaviour/'+behavior.id;

    console.log(methodURL);

    fetch(methodURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(response => response.json())
    .then(data => {
      console.log('Record deleted successfully:', data);
    })
    .catch(error => {
      console.error('Error deleting record:', error);
    });
  }

  const handleSelectRemoveBehavior = (behavior) => {
     if (showConfirmationBox("Are you sure you want to delete this item?")){
      handleDelete(behavior);
      setSelectedRemoveBehavior(behavior);
      setShowRemoveBehaviorSelect(false);
    }
  };

  const handleShowRemoveBehaviorSelect = () => {
    setShowRemoveBehaviorSelect(true);
  };

  const onWorkspaceMounted = (workspace) => {
    workspaceRef.current = workspace;
  };

  return (
    <div>
      <div>

        {/* Middle div with form inputs */}
        <div>
          <div className="d-flex justify-content-end">

            <button onClick={handleShowBehaviorSelect} className="btn btn-info me-2" >Load</button>
            {showBehaviorSelect && (
              <BehaviorSelect
                show={showBehaviorSelect}
                onHide={() => setShowBehaviorSelect(false)}
                onSelect={handleSelectBehavior}
              />
            )}
            {selectedBehavior && <p>({selectedBehavior.name})</p>}

            <button className="btn btn-success me-2" onClick={handleShowPopup}>Save</button>
            <SaveBehavior show={showPopup} handleClose={handleClosePopup} xml={xmlCode} json={jsonCode} />

            {/* <button className="btn btn-secondary me-2">Cancel</button> */}

            <button onClick={handleShowRemoveBehaviorSelect} className="btn btn-danger me-2" >Remove</button>
            {showRemoveBehaviorSelect && (
              <BehaviorSelect
                show={showRemoveBehaviorSelect}
                onHide={() => setShowRemoveBehaviorSelect(false)}
                onSelect={handleSelectRemoveBehavior}
              />
            )}

          </div>

          <div ref={onWorkspaceMounted}>
            <BlocklyWorkspace
              toolboxConfiguration={toolboxCategories}
              initialXml={initialXml}
              className="blockly-container"
              workspaceConfiguration={{
                grid: {
                  spacing: 20,
                  length: 5,
                  colour: "#ccc",
                  snap: true,
                }, x: 2,
                languageMode: 'JavaScript'
              }}
              onInject={workspaceInit}
              onWorkspaceChange={workspaceDidUpdate}
              onXmlChange={setXml}
            />
            {/* <pre id="generated-xml">{xml}</pre> */}
            <textarea
              id="blockxml"
              style={{ height: "100px", width: "100%", fontFamily: 'Courier' }}
              value={xmlCode}
              readOnly
            ></textarea>
            <textarea
              id="code"
              style={{ height: "200px", width: "100%", fontFamily: 'Courier' }}
              value={jsonCode}
              readOnly
            ></textarea>

          </div>
        </div>

      </div>

    </div>
  )
};

export default Edit;
