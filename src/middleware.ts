import { DEFAULT_LOCALE, LOCALES } from "@/app/_utils/constants";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

import { NextRequest, NextResponse } from "next/server";

const getLocale = (request: NextRequest) => {
  const languages = new Negotiator({
    headers: {
      "accept-language": request.headers.get("accept-language") ?? "",
    },
  }).languages();
  return match(languages, LOCALES, DEFAULT_LOCALE);
};

export const middleware = (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
};

export const config = {
  matcher: ["/((?!_next).*)"],
};
