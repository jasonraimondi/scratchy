import React from "react";
import classnames from "classnames";

export const Label: React.FC<{ id: string; className?: string }> = ({ children, id, className = "", ...props }) => (
  <label htmlFor={id} data-test={id} {...props} className={className}>
    {children}
  </label>
);

export const Button: React.FC<any> = ({ children, disabled = false, className = "", ...props }) => {
  return (
    <button {...props} className={classnames(className, { disabled })}>
      {children}
    </button>
  );
};

export const FormControl: React.FC<any> = ({ children, className = "", ...props }) => {
  return (
    <div {...props} className={classnames(className, "form-control")}>
      {children}
    </div>
  );
};
