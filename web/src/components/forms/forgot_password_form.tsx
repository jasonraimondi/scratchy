import React from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";

import { Button, Label } from "@/app/components/forms/elements";
import { validEmail } from "@/app/pages/register";

export type ForgotPasswordFormData = {
  email: string;
};

type Props = {
  handleSubmit: any;
};

const ForgotPasswordForm = ({ handleSubmit }: Props) => {
  const handleValidate = (values: ForgotPasswordFormData) => {
    let errors: any = {};
    if (!values.email) {
      errors.email = "Required";
    } else if (!validEmail.test(values.email)) {
      errors.email = "Invalid email address";
    }
    return errors;
  };

  return (
    <Formik<ForgotPasswordFormData> initialValues={{ email: "" }} validate={handleValidate} onSubmit={handleSubmit}>
      {({ isSubmitting }) => (
        <Form data-test="forgot-password-form">
          <Label data-test="forgot-password-form--email">
            <span>Email</span>
            <Field type="email" name="email" placeholder="john.doe@example.com" />
            <ErrorMessage name="email" component="div" />
          </Label>
          <Button type="submit" disabled={isSubmitting}>
            <span>Submit</span>
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default ForgotPasswordForm;
