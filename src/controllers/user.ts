import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RepresentanteVecinal, Vecino } from '../models/mer';

//login

export const login = async (req :Request, res : Response)=>{
  console.log('entra al loggin')
  const {rut,contrasenia,tipo_user} = req.body;
  console.log('que viene en tipo de usuario ',tipo_user)
  console.log('que contraseia viene ',contrasenia)
  var respuesta = '';
  var rol = '';

  try{
      // le indicamos a la const de tipo any, ya qpor defecto el atributop q devuelva sera un strg y entrara en conflicto con lo q espera bycript y el modelo del mer
    if(tipo_user === false){
      console.log('ingresa a que es representante')
      const EsRepre: any = await RepresentanteVecinal.findOne({where:{rut_representante: rut}});
      if(EsRepre !== null){    
        console.log('entra a comparar la contrasenia ')
        const validPassword = await bcrypt.compare(contrasenia,EsRepre.contrasenia);
        if(validPassword === true){
          console.log('contra valida ')
            const id = EsRepre.id_representante_vecinal;
            rol ='admin';
            const token = jwt.sign({rut_user: rut},process.env.SECRET_KEY || "secretkey"); // se le puede agregar que espere 1 hora para que expire {expiresIn: 60 * 60}
            const alo = [] = [id,token,rol];
            console.log('que enviamos en alo ',alo)
            respuesta = 'ok';
            return res.json({respuesta,alo});
        }
        else{
            respuesta = 'clave invalida';
            var status = 404;
            return res.json({respuesta, status});
        }
  
      }    
      else{
      respuesta = 'no existe usuario';  
      var status = 500;        
      return res.json({respuesta, status});
      }
    }
    else if(tipo_user === true){
      console.log('ingresa a que es vecino')
      const EsVecino: any = await Vecino.findOne({where:{estado: 1 ,rut_vecino: rut}});
      if(EsVecino !== null){	
        console.log('ingresa que es un vecino ')
        const validPassword = await bcrypt.compare(contrasenia,EsVecino.contrasenia);
        if(validPassword === true){
          const id = EsVecino.id_vecino;
          rol ='vecino';
          console.log('que rol enviamos',rol)
          const token = jwt.sign({rut_user: rut},process.env.SECRET_KEY || "secretkey"); // se le puede agregar que espere 1 hora para que expire {expiresIn: 60 * 60}
          const alo = [] = [id,token,rol];
          respuesta = 'ok';
          return res.json({respuesta,alo});
        }
        else{
          respuesta = 'clave invalida';
          var status = 404;
          return res.json({respuesta, status});
        }
      } 
      else{
        return res.json({respuesta : 'vecino pendiente a aprobación y/o Usuario no registrado', status: 404});
    }       
    }
    else{            
    respuesta = 'no existe usuario';
    var status = 500;
    return res.json({respuesta, status});
    }
  }
  catch{
    respuesta = 'error';
    var status = 500;
    return res.json({respuesta,status});
  }
  
};



// export const login = async (req :Request, res : Response)=>{
//     console.log('llega')
//     const cuerpo = req.body;
//     console.log(cuerpo)
//     var respuesta = '';
//     var rol = '';
//     // const existeUser = await User.findOne({where:{contrasenia: cuerpo.rut_user}});
 
//     try{
//         // le indicamos a la const de tipo any, ya qpor defecto el atributop q devuelva sera un strg y entrara en conflicto con lo q espera bycript y el modelo del mer
       
//         console.log('esntra al try')
//         const EsRepre: any = await RepresentanteVecinal.findOne({where:{rut_representante: cuerpo.rut}});
//         //const EsVecino: any = await Vecino.findOne({where:{rut_vecino: cuerpo.rut}});
//         if(EsRepre !== null){                      
//             respuesta = 'representante';
//             const validPassword = await bcrypt.compare(cuerpo.contrasenia,EsRepre.contrasenia);
//             if(validPassword === true){
//                 const id = EsRepre.id_representante_vecinal;
//                 const rol = 'admin';
//                 console.log('que rol enviamos',rol)
//                 const token = jwt.sign({
//                     rut_user: cuerpo.rut,
//                         },process.env.SECRET_KEY || "secretkey"); // se le puede agregar que espere 1 hora para que expire {expiresIn: 60 * 60}
//                 const alo = [] = [id,token,rol];
//                 console.log('que enviamos en alo ',alo)
//                 return res.json({alo});
//             }
//             else{
//                 const alo = [] = [respuesta,'clave invalida'];
//                 return res.json({alo});
//             }
            
//         }
//         else if( EsRepre === null){
//           console.log('ingresa a es vecino')
//           const EsVecino: any = await Vecino.findOne({where:{estado: 1 ,rut_vecino: cuerpo.rut}});
//           if(EsVecino !== null){
//             respuesta = 'Vecino';
//           const validPassword = await bcrypt.compare(cuerpo.contrasenia,EsVecino.contrasenia);
//             if(validPassword === true){
//                 const id = EsVecino.id_vecino;
//                 const rol = 'vecino';
//                 console.log('que rol enviamos',rol)
//                 const token = jwt.sign({
//                     rut_user: cuerpo.rut,
//                         },process.env.SECRET_KEY || "secretkey"); // se le puede agregar que espere 1 hora para que expire {expiresIn: 60 * 60}
//                 const alo = [] = [id,token,rol];
                
//                 return res.json({alo});
//             }
//             else{
//                 const alo = [] = [respuesta,'clave invalida'];
//                 return res.json({alo});
//             }
//           }
//           else{
//             respuesta = 'no existe usario';
//             var status = 500;
//             const alo = [] = [respuesta,status];            
//             return res.json({alo});
//           }
          
//         }
//         else{            
//         respuesta = 'no existe usario';
//         return res.json({respuesta, 'status':500});
//         }
//     }
//     catch{
//         console.log(respuesta)
//         respuesta = 'no existe usario';
//         return res.json({respuesta});
//     }
    
// };
export const profile = async (req: Request, res: Response) => {
    const { id, rol } = req.query;
    let respuesta = '';

    console.log('que viene en rol',rol)
  
    if (rol === 'admin') {
      try {
        const user: any = await RepresentanteVecinal.findOne({
          where: { id_representante_vecinal: id },
        });
  
        if (user !== null) {
          const id_us = user.id_representante_vecinal;
          const rut = user.rut_representante;
          const nombre = user.primer_nombre;
          const pApellido = user.primer_apellido;
          const path = user.avatar;
          const id_jun = user.fk_id_junta_vecinal;
  
          const datos = [id_us, rut, nombre, pApellido, path, id_jun];
          return res.status(200).json({ datos });
        }
      } catch (error) {
        console.error('Error al obtener el perfil del representante:', error);
        return res.status(404).json({
          msg: 'Hay un error con el perfil del representante',
        });
      }
    } else if (rol === 'vecino') {
        try {
            const user: any = await Vecino.findOne({
              where: { id_vecino: id },
            });
      
            if (user !== null) {
              const id_us = user.id_vecino;
              const rut = user.rut_vecino;
              const nombre = user.primer_nombre;
              const pApellido = user.primer_apellido;
              const path = user.avatar;
              const id_jun = user.fk_id_junta_vecinal;
      
              const datos = [id_us, rut, nombre, pApellido, path, id_jun];
              return res.status(200).json({ datos });
            }
          } catch (error) {
            console.error('Error al obtener el perfil del representante:', error);
            return res.status(404).json({
              msg: 'Hay un error con el perfil del representante',
            });
          }
    } else {
      respuesta = 'Usuario no existe';
      return res.json({ respuesta });
    }
  };
  





