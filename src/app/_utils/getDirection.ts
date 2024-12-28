import { Locale } from "@/app/_types/locale";

const getDirection = (lang: Locale): "rtl" | "ltr" => {
  if (lang === "ar") return "rtl";
  return "ltr";
};

export { getDirection };
