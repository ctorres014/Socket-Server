import { Router, Request, Response} from 'express';
import Server from '../class/server';

const router = Router();

router.get('/mensajes', (req: Request, res: Response) => {
    res.json({
        ok: true,
        mensaje: 'Todo esta bien'
    });
});

router.post('/mensajes', (req: Request, res: Response) => {
    const cuerpo = req.body.cuerpo;
    const de = req.body.de;
    
    const payload = {
        de,
        cuerpo
    }
    // Aqui devemos comunicar nuestro servicio REST con nuestro servidor de socket
    const server = Server.instance;
    // Enviamos un mensaje a todos los
    // usuarios de la sala
    server.io.emit('mensaje-nuevo', payload);

    res.json({
        ok: true,
        cuerpo,
        de
    });
});

router.post('/mensajes/:id', (req: Request, res: Response) => {
    const cuerpo = req.body.cuerpo;
    const de = req.body.de;
    const id = req.params.id;
    
    const payload = {
        de,
        cuerpo
    }
    // Aqui devemos comunicar nuestro servicio REST con nuestro servidor de socket
    const server = Server.instance;
    // Enviamos un mensaje a un usuario en particular
    // que esta en la misma sala
    server.io.in(id).emit('mensaje-privado', payload);

    res.json({
        ok: true,
        cuerpo,
        de,
        id
    });
});

export default router;