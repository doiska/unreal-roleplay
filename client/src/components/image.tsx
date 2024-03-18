import {
  ComponentPropsWithoutRef,
  useState
} from "react";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { cn } from "@/lib/utils.ts";
import { Frown } from "lucide-react";
import {
  Alert,
  AlertTitle
} from "@/components/ui/alert.tsx";

interface Props {
  onStateChange?: (state: "loading" | "loadded" | "error") => void;
}

export function Image({ src, className, onStateChange, ...rest }: ComponentPropsWithoutRef<"img"> & Props) {
  const [status, setStatus] = useState<"loadded" | "loading" | "error">("loading");

  const updateState = (state: "loading" | "loadded" | "error") => {
    setTimeout(
        () => {
          setStatus(state);
          onStateChange?.(state);
        },
        1000
    );
  };

  if(!src) {
    return null;
  }

  return (
      <>
        <img
            src={src}
            onLoad={() => updateState("loadded")}
            onError={() => updateState("error")}
            className={cn(
                className,
                "transition-all rounded-xl",
                status === "loadded" ? "opacity-100" : "opacity-0 min-h-0 h-0",
            )}
            {...rest}
        />
        {status === "loading" && <Skeleton className="w-full h-48" />}
        {status === "error" && (
            <Alert>
              <AlertTitle className="flex items-center m-0">
                <Frown />
                <span className="ml-2">Erro ao carregar imagem.</span>
              </AlertTitle>
            </Alert>
        )}
      </>
  );
}
