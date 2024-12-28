import { forwardRef } from "react";
import { AnchorHTMLAttributes } from "react";

import NextLink from "next/link";
import { LinkProps as NextLinkProps } from "next/link";

type LinkBehaviourProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  keyof NextLinkProps
> &
  NextLinkProps;

const LinkBehaviour = forwardRef<HTMLAnchorElement, LinkBehaviourProps>(
  function LinkBehaviour(props, ref) {
    return <NextLink ref={ref} {...props} />;
  }
);

export { LinkBehaviour };
