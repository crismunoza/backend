import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JuntaVecinal, RepresentanteVecinal, Vecino } from '../models/mer';

//login

export const login = async (req :Request, res : Response)=>{
  console.log('entra al loggin')
  const {rut,contrasenia,tipo_user} = req.body;
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
  
export const getDataUser = async (req: Request, res:Response) => {
  const {id,rol,junta} = req.query;
  const nombre_junta:any = await JuntaVecinal.findOne({where:{id_junta_vecinal:junta}});

  try{
    if(rol === 'admin'){
      const EsRep:any = await RepresentanteVecinal.findOne({ where:{id_representante_vecinal:id}});
      if(EsRep){
        const Rep = {
          correo: EsRep.correo_electronico,
          telefono: EsRep.telefono,
          direccion: EsRep.direccion+' '+EsRep.numero,
          s_nombre: EsRep.segundo_nombre,
          s_apellido: EsRep.segundo_apellido,
          junta_vecinal: nombre_junta.razon_social
        }
        return res.json({status:200, datos:Rep})}
      else{return res.json({status:404})}
    }
    else{
      const EsVec:any = await Vecino.findOne({where:{id_vecino:id}});
      if(EsVec){
        const vec = {
          correo: EsVec.correo_electronico,
          telefono: EsVec.telefono,
          direccion: EsVec.direccion,
          s_nombre: EsVec.segundo_nombre,
          s_apellido: EsVec.segundo_apellido,
          junta_vecinal: nombre_junta.razon_social
        }
        return res.json({status:200, datos:vec})}
      else{return res.json({status:404})}
    }
  }
  catch(error){
    console.error(error)
  }
};

export const UpdateProfile = async ( req:Request,res:Response)=>{
  const id_us = req.params.id_us;
  const datos = req.body;
  try{
    if(datos.rol === 'admin'){
      await RepresentanteVecinal.update({telefono:datos.telefono,correo_electronico:datos.correo},{where :{id_representante_vecinal:id_us}});
      var respuesta = 200; 
    }
    else{
      await Vecino.update({telefono:datos.telefono,correo_electronico:datos.correo},{where:{id_vecino:id_us}});
      var respuesta = 200; 
    }
    return res.json({ status : respuesta });
  }
  catch(error){console.log(error)}
  
};

export const UpdateClave = async (req:Request, res:Response)=>{
  const id = req.params.id;
  const {rol, contraActual, contraNva} = req.body;
  try{
    if(rol === 'admin'){
      const passValid:any = await RepresentanteVecinal.findOne({ where:{id_representante_vecinal:id} });      
      const validPassword = await bcrypt.compare(contraActual,passValid.contrasenia);
      if(passValid === null || validPassword === false){
        return res.json({ status: 400, respuesta:'Clave Actual invalida'});
      }
      else{
        const passhash = await bcrypt.hash(contraNva,10);
        await RepresentanteVecinal.update({contrasenia:passhash},{where:{id_representante_vecinal:id}});
        return res.json({ status:200, respuesta:'Contraseña Cambiada con exito'});
      }
    }
    else{

      const passValid:any = await Vecino.findOne({ where:{id_vecino:id},attributes:['contrasenia'] });
      const validPassword = await bcrypt.compare(contraActual,passValid.contrasenia);
      if(passValid === null || validPassword === false){
        return res.json({ status: 400, respuesta:'Clave Actual invalida'});
      }
      else{
        const passhash = await bcrypt.hash(contraNva,10);
        await Vecino.update({contrasenia:passhash},{where:{id_vecino:id}});
        return res.json({ status:200, respuesta:'Contraseña Cambiada con exito'});
      }
    }
  }
  catch(error){
    return res.json({ status : error });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id, id_junta } = req.body;
  try {
    const userCount: number = await RepresentanteVecinal.count({
      where: { fk_id_junta_vecinal: id_junta }
    });
    console.log('userCount', userCount);
    if (userCount >= 2) {
      await RepresentanteVecinal.destroy({
        where: { id_representante_vecinal: id }
      });
      return res.json({
        status: 200,
        respuesta: 'Usuario Eliminado con éxito'
      });
    } else {
      return res.json({
        status: 404,
        respuesta: 'No se puede eliminar'
      });
    }
  } catch (error) {
    return res.json({ status: error });
  }
};

