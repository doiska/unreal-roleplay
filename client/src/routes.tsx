import { createBrowserRouter } from "react-router-dom";
import { Rooms } from "@/pages/rooms/rooms.tsx";
import { Room } from "@/pages/rooms/rooms.[id].tsx";
import { Layout } from "@/pages/_layout.tsx";

export const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            { path: "/", element: <Rooms /> },
            { path: "/room/:id", element: <Room /> }
        ]
    },
])

