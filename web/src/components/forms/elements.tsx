import React from "react";

import el from "./element.module.css";

export const Label: React.FC = ({ children, ...props }) => <label {...props} className={el.label}>{children}</label>

export const Button: React.FC = ({ children, ...props }) => <button {...props} className={el.button}>{children}</button>
