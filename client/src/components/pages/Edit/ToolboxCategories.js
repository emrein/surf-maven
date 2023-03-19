
const toolboxCategories = {
    kind: "categoryToolbox",
    contents: [
      {
        kind: "category",
        name: "Tools",
        colour: "#5CA65C",
        contents: [
          {
            kind: "block",
            type: "behaviour",
          },
          {
            kind: "block",
            type: "for",
          },
        ],
      },
      {
        kind: "category",
        name: "Actions",
        colour: "#5CA699",
        contents: [
          {
            kind: "block",
            type: "page_change",
          },
          {
            kind: "block",
            type: "element_press",
          },
          {
            kind: "block",
            type: "scroll",
          },
          {
            kind: "block",
            type: "mouse_out"
          }
        ],
      },
    ],
  };

export default toolboxCategories;