import {
  useEffect,
  useState
} from "react";

export function useAssertSize({ parentRef }: { parentRef: any }) {
  const [size, setSize] = useState({ width: 1000, height: 1000 });

  useEffect(() => {
    const resize = () => {
      if (parentRef.current) {
        const width = parentRef.current.offsetWidth;
        const height = parentRef.current.offsetHeight;

        if (width !== size.width || height !== size.height) {
          setSize({
            width,
            height
          });
        }
      }
    };

    setTimeout(resize, 1000);

    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return size;
}
