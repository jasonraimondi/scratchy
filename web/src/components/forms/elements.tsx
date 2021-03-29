import React from "react";
import classnames from "classnames";

import el from "./element.module.css";

export const Label: React.FC<any> = ({ children, className = "", ...props }) => (
  <label {...props} className={classnames(el.label, className)}>
    {children}
  </label>
);

export const Button: React.FC<any> = ({ children, className = "", ...props }) => {
  return (
    <button {...props} className={classnames(el.button, className)}>
      {children}
    </button>
  );
};
