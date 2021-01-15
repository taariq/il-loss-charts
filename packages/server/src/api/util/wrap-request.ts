import { Request, Response, RequestHandler } from 'express';

export default function wrapRequest(
    controllerFn: (req: Request, res: Response) => Promise<unknown>
): RequestHandler {
    return async (req: Request, res: Response) => {
        try {
            const response = await controllerFn(req, res);
            return res.json({ data: response });
        } catch (err) {
            console.error('Error:', err);
            const errors = err.errors || [{ message: err.message }];
            return res.status(err.status || 500).json({ errors });
        }
    };
}
