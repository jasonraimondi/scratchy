import React from "react";
import NextLink from "next/link";

type Props = {
  href: string;
  replace?: boolean;
  className?: string;
};

export const Link: React.FunctionComponent<Props> = props => {
  const { children, href, replace = false, ...anchorProps } = props;
  return (
    <NextLink href={href} passHref replace={replace}>
      <a {...anchorProps}>{children}</a>
    </NextLink>
  );
};
