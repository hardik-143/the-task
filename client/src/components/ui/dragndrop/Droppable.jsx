import React, { useState, useRef, useEffect } from "react";

function toArray(obj) {
  var array = [];
  // iterate backwards ensuring that length is an UInt32
  for (var i = obj.length >>> 0; i--;) { 
    array[i] = obj[i];
  }
  return array;
}

function pickTypes(e) {
  return e.dataTransfer ? e.dataTransfer.types : [];
}

function filterProps(props) {
  let forbidden = ["types", "className", "enabled", "wrapperComponent"];
  return Object.keys(props).reduce((p, c) => {
    if (!forbidden.includes(c)) {
      p[c] = props[c];
    }
    return p;
  }, {});
}

const Droppable = (props) => {
  const [over, setOver] = useState(false);
  const droppable = useRef(null);
  const position = useRef(null);

  const allowed = (attemptingTypes) => {
    let componentProps = Object.assign({}, props);
    if (props.wrapperComponent)
      componentProps = Object.assign(
        componentProps,
        props.wrapperComponent.props
      );
    if (!componentProps.enabled) return false;
    let _attemptingTypes = utils.toArray(attemptingTypes);
    if (!componentProps.types) return true;
    return [].concat(componentProps.types).reduce((sum, type) => {
      if (_attemptingTypes.indexOf(type) >= 0) return true;
      return sum;
    }, false);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    if (!allowed(pickTypes(e))) return;
    if (typeof props.onDragOver === "function") props.onDragOver(e);
  };

  const onDragEnter = (e) => {
    e.preventDefault();
    if (over) return;
    if (!allowed(pickTypes(e))) return;
    if (typeof props.onDragEnter === "function") props.onDragEnter(e);
    setOver(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    if (!allowed(pickTypes(e))) return;
    let isOver = true;
    if (
      e.clientX <= position.current.left ||
      e.clientX >= position.current.right
    )
      isOver = false;
    if (
      e.clientY <= position.current.top ||
      e.clientY >= position.current.bottom
    )
      isOver = false;
    if (isOver) return;
    setOver(false);
    if (typeof props.onDragLeave === "function") props.onDragLeave(e);
  };

  const onDrop = (e) => {
    e.preventDefault();
    if (!allowed(pickTypes(e))) return;
    setOver(false);
    let componentProps = Object.assign({}, props);
    if (props.wrapperComponent)
      componentProps = Object.assign(
        componentProps,
        props.wrapperComponent.props
      );
    const data = !componentProps.types
      ? null
      : [].concat(componentProps.types).reduce((d, type) => {
          d[type] = e.dataTransfer.getData(type);
          return d;
        }, {});
    if (typeof props.onDrop === "function") props.onDrop(data, e);
  };

  useEffect(() => {
    const node = droppable.current;
    position.current = {
      top: node.offsetTop + 5,
      left: node.offsetLeft + 5,
      right: node.offsetLeft + node.offsetWidth - 5,
      bottom: node.offsetTop + node.offsetHeight - 5,
    };
  }, []);

  let Tag = "div";
  let componentProps = Object.assign({}, props);
  if (props.wrapperComponent) {
    Tag = props.wrapperComponent.type;
    componentProps = Object.assign(
      componentProps,
      props.wrapperComponent.props
    );
  }

  let classes = "Droppable";
  if (componentProps.className) classes += ` ${componentProps.className}`;
  if (over) classes += " over";

  return (
    <Tag
      ref={droppable}
      className={classes}
      {...filterProps(componentProps)}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragExit={onDragLeave}
    >
      {componentProps.children}
    </Tag>
  );
};

Droppable.defaultProps = {
  enabled: true,
};

export default Droppable;
