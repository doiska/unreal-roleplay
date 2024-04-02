import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";

interface Props {
  dialog: {
    open: boolean
    onOpenChange: (open: boolean) => void
    config?: {
      title?: string;
      description?: string;
      placeholder?: string;
    }
  };
  handleSubmit: (image: string) => void;
}

export function usePrompt() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState({
    title: "",
    description: "",
    placeholder: "",
  } as any);

  const open = (config?: Props["dialog"]["config"]) => {
    if (config) {
      setConfig(config);
    }
    setIsOpen(true);
  }
  const close = () => {
    setConfig(null);
    setIsOpen(false);
  }

  return {
    dialog: {
      open: isOpen,
      onOpenChange: setIsOpen,
      config,
    },
    isOpen,
    open,
    close,
  };
}

export function InputPrompt({ handleSubmit, dialog }: Props) {
  const [value, setValue] = useState("");

  const { config, ...dialogProps } = dialog;

  return (
      <Dialog {...dialogProps}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{config?.title || "Configurando..."}</DialogTitle>
            <DialogDescription>
              {config?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <Input
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder={config?.placeholder}
            />
          </div>
          <DialogFooter>
            <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setValue("");
                  dialog.onOpenChange(false);
                }}
            >
              Cancelar
            </Button>
            <Button
                type="button"
                onClick={() => {
                  handleSubmit(value);
                  setValue("");
                  dialog.onOpenChange(false);
                }}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  );
}
