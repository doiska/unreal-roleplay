import { Outlet } from "react-router-dom";
import { useRoomAudio } from "@/hooks/use-room-audio.ts";

export function Layout() {
    useRoomAudio();

    return (
        <main className="min-h-screen w-screen overflow-hidden">
            <Outlet />
        </main>
    )
}
