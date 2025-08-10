import React from "react";

const Draggable = (props) => {
  const onDragStart = (e) => {
    if (typeof props.onDragStart === "function") props.onDragStart(e);
    let componentProps = Object.assign({}, props);
    if (props.wrapperComponent)
      componentProps = Object.assign(
        componentProps,
        props.wrapperComponent.props
      );
    e.dataTransfer.setData(componentProps.type, componentProps.data);
  };

  const onDragEnd = (e) => {
    if (typeof props.onDragEnd === "function") props.onDragEnd(e);
  };

  let Tag = "div";
  let componentProps = Object.assign({}, props);

  if (props.wrapperComponent) {
    Tag = props.wrapperComponent.type;
    componentProps = Object.assign(
      componentProps,
      props.wrapperComponent.props
    );
    delete componentProps.wrapperComponent;
  }

  if (props.enabled) {
    componentProps.draggable = "true";
    componentProps.onDragEnd = onDragEnd;
    componentProps.onDragStart = onDragStart;
  }

  delete componentProps.enabled;
  return <Tag {...componentProps}>{componentProps.children}</Tag>;
};

Draggable.defaultProps = {
  enabled: true,
};

export default Draggable;
