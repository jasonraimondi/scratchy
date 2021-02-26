import React from "react";
import NextLink from "next/link";

type Props = {
  href: string;
  replace?: boolean;
};

export const Link: React.FunctionComponent<Props> = props => {
  const { children, href, replace = false } = props;
  return (
    <NextLink href={href} passHref replace={replace}>
      {children}
    </NextLink>
  );
};
