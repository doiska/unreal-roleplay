import { ComponentPropsWithoutRef, useEffect, useRef, useState } from "react";
import { Layer, Image, Stage } from "react-konva";
import useImage from "use-image"

const map = "https://i.pinimg.com/originals/8f/a9/21/8fa921d8a63955010c4371d247b881ab.png"

interface Props extends ComponentPropsWithoutRef<typeof Stage> {
    image?: string
}

const sceneWidth = 1920;
const sceneHeight = 1080;

export function GameMap({ image = map, ...props }: Props) {
    const [loadedImage] = useImage(image);
    const [stageSize, setStageSize] = useState({ width: 1000, height: 1000 });

    const parentRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        const resize = () => {
            if (parentRef.current) {
                const width = parentRef.current.offsetWidth;
                const height = parentRef.current.offsetHeight;
                const scale = Math.min(width / sceneWidth, height / sceneHeight);

                setStageSize({
                    width: sceneWidth * scale,
                    height: sceneHeight * scale
                });
            }
        }

        resize();
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, []);


    return (
        <div ref={parentRef} className="relative flex-1 w-full h-full min-w-0 min-h-0">
            <Stage width={stageSize.width} height={stageSize.height} {...props}>
                <Layer>
                    <Image
                        image={loadedImage}
                        fillPatternImage={loadedImage}
                        fillPatternOffset={{ x: -sceneWidth / 2, y: -sceneHeight / 2 }}
                    />
                </Layer>
            </Stage>
        </div>
    )
}
