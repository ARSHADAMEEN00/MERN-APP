import express, { Response } from "express";
import path from "path";

const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'static', "index.html"))
})

export const notFound = (req: any, res: Response) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, '..', 'static', "404.html"))
    } else if (req.accepts("json")) {
        res.json({ message: "404 Not Found" })
    } else {
        res.type('txt').send('404 Not Found')
    }
}


export default router;
