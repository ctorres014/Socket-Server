import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import { UsuariosLista } from '../class/usuario-lista';
import { Usuario } from '../class/usuario';


export const usuarioConectados = new UsuariosLista();

export const conectarCliente = ( cliente: Socket) => {
   const usuario = new Usuario(cliente.id);
   usuarioConectados.agregar(usuario);
}

export const desconectar = (cliente: Socket) => {
     cliente.on('disconnect', () => {
        usuarioConectados.borrarUsuario(cliente.id);
        console.log('Cliente Desconectado');
        
     });
}
///////////////////////////////
/// Escucha de mensajes
///////////////////////////////
export const mensaje = (cliente: Socket, io: socketIO.Server) => {
   cliente.on('mensaje', (payload: { de: string, cuerpo: string }) => {
      console.log('Mensaje Recibido', payload);
      // Emito a los clientes conectados el mensaje recibido
      io.emit('mensaje-nuevo', payload);
   });
}

///////////////////////////////
/// Configurar Usuario
///////////////////////////////
export const usuario = (cliente: Socket, io: socketIO.Server) => {
   cliente.on('configurar-usuario', (payload: { nombre: string }, callBack: Function) => {
      console.log('Usuario Recibido', payload.nombre);
      usuarioConectados.actualizarNombre(cliente.id, payload.nombre);
      // Devolvemos una respuesta al cliente mediante el callback
      callBack({
         ok: true,
         mensaje: `Usuario ${payload.nombre}, configurado`
      })
   });
}