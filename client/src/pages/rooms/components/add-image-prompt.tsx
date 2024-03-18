import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog.tsx";
import { useState } from "react";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Upload } from "lucide-react";
import { Image } from "@/components/image.tsx";

export function AddImagePrompt({ handleSubmit }: {
  handleSubmit: (image: string) => void
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [image, setImage] = useState<string>("");
  const [canSave, setCanSave] = useState<boolean>(false);

  return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild={true}>
          <Button size="icon">
            <Upload />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inserir imagem</DialogTitle>
            <DialogDescription>
              Use um link direto terminado com <strong>.png, .jpg, .jpeg, .gif, etc</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <Input
                id="image"
                value={image}
                onChange={e => setImage(e.target.value)}
                placeholder="https://twokei.com/cdn/teste.png"
            />
            <Image
                key={image}
                src={image}
                alt="Preview"
                className="w-full min-h-48 max-h-80 object-cover p-2"
                onStateChange={state => {
                  if (state === "loadded") {
                    setCanSave(true);
                  }
                }}
            />
          </div>
          <DialogFooter>
            <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
            >
              Cancelar
            </Button>
            <Button
                type="button"
                disabled={!canSave}
                onClick={() => {
                  handleSubmit(image);
                  setIsOpen(false);
                }}
            >
              Salvar imagem
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  );
}
