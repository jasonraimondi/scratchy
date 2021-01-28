import React from "react";

import el from "./element.module.css";

export const Label: React.FC<any> = ({ children, ...props }) => <label {...props} className={el.label}>{children}</label>

export const Button: React.FC<any> = ({ children, ...props }) => <button {...props} className={el.button}>{children}</button>
