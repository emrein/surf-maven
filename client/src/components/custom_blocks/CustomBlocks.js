import Blockly from "blockly";

function init_custom_blocks() {

  Blockly.defineBlocksWithJsonArray([
    {
      "type": "page_change",
      "message0": "Navigate to %1",
      "args0": [
        {
          "type": "field_input",
          "name": "url",
          "text": "url"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": 185,
      "tooltip": "",
      "helpUrl": ""
    }
  ]);

  Blockly.defineBlocksWithJsonArray([{
        "type": "element_press",
        "message0": "Press element %1",
        "args0": [
          {
            "type": "field_input",
            "name": "element_id",
            "text": "id"
          }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 210,
        "tooltip": "",
        "helpUrl": ""
  }]);

  Blockly.defineBlocksWithJsonArray([{
    "type": "behaviour",
    "message0": "Behaviour  %1 %2 Within %3 seconds  %4 %5 %6",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "behaviour_type",
        "options": [
          [
            "strict",
            "strict"
          ],
          [
            "loose",
            "loose"
          ]
        ]
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_number",
        "name": "seconds",
        "value": 10,
        "min": 0
      },
      {
        "type": "field_checkbox",
        "name": "time_dependency",
        "checked": true
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "inside"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 0,
    "tooltip": "",
    "helpUrl": ""
  }]);

  Blockly.defineBlocksWithJsonArray([{
    "type": "for",
    "message0": "For %1 times %2 %3",
    "args0": [
      {
        "type": "field_number",
        "name": "for_count",
        "value": 2,
        "min": 0
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "inside"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 30,
    "tooltip": "",
    "helpUrl": ""
  }]);

  Blockly.defineBlocksWithJsonArray([{
    "type": "scroll",
    "message0": "Scroll %1 until the end %2",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "pace",
        "options": [
          [
            "fast",
            "fast"
          ],
          [
            "normal",
            "normal"
          ],
          [
            "slow",
            "slow"
          ]
        ]
      },
      {
        "type": "field_checkbox",
        "name": "until_the_end",
        "checked": true
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 240,
    "tooltip": "",
    "helpUrl": ""
  }]);

  Blockly.defineBlocksWithJsonArray([{
    "type": "mouse_out",
    "message0": "Mouse out",
    "previousStatement": null,
    "nextStatement": null,
    "colour": 260,
    "tooltip": "",
    "helpUrl": ""
  }]);

}


export default init_custom_blocks;