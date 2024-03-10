import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        element: <>Join a room.</>
    },
    {
        path: "/rooms/:room",
        element: <>Join room</>
    }
])

