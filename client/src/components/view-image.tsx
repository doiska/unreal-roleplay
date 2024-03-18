
import { ComponentPropsWithoutRef } from "react";

export function ViewImage(props: ComponentPropsWithoutRef<"img">) {
  return (
      <img
          {...props}
          className="w-96 h-auto rounded-md"
      />
  )
}
