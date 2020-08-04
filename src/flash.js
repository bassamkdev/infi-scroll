function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        !!child && typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
}

function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text || "Awsome photo",
      children: [],
    },
  };
}

function render(element, root) {
  let node =
    element.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type);

  Object.keys(element.props)
    .filter((prop) => prop !== "children")
    .forEach((attribute) => (node[attribute] = element.props[attribute]));

  element.props.children.forEach((child) => render(child, node));

  root.appendChild(node);
}

module.exports = {
  createElement,
  render,
};
