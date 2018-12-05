import { Router, Request, Response} from 'express';
import Server from '../class/server';
import { Socket } from 'socket.io';

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

// Servicio para obtener todos los id's de usuario
router.get('/usuarios', (req: Request, res: Response) => {
    // Necesitamos la instancia del server
    const server = Server.instance;
    // Esta funcion barre con todos los clientes
    server.io.clients((err: any, clientes: Socket) => {
        if(err) {
            return res.json({
                ok: false,
                err
            })
        }
        
        res.json({
            ok: true,
            clientes
        })

    })
});

// Obtener usuarios y sus nombres
router.get('/usuarios/detalle', (req: Request, res: Response) => {
    // Necesitamos la instancia del server
    const server = Server.instance;
    // Esta funcion barre con todos los clientes
    server.io.clients((err: any, clientes: Socket) => {
        if(err) {
            return res.json({
                ok: false,
                err
            })
        }
        
        res.json({
            ok: true,
            clientes
        })

    })
});


export default router;