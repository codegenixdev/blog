import { useEffect } from "react";

import { useFormContext } from "@/app/_features/_form/_hooks/useFormContext";

const useFormLogger = () => {
  const { watch } = useFormContext();

  useEffect(() => {
    const { unsubscribe } = watch((value) => console.log(value));
    return unsubscribe;
  }, [watch]);
};

export { useFormLogger };
