import { Outlet } from "react-router-dom";
import { useRoomAudio } from "@/hooks/use-room-audio.ts";

export function Layout() {
    useRoomAudio();

    return (
        <main className="h-screen flex justify-center items-center bg-background">
            <Outlet />
        </main>
    )
}
