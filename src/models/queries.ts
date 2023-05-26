import db from "../db/connection";
export const queries = {
    //**query que comprueba la existencia de tablas en el esquema. */
    existsTables: `SELECT table_name FROM all_tables WHERE owner = 'C##JUNTA_VECINAL';`,
    
}
export const getMaxId = async (modelName: string, idField: string): Promise<number> => {
    try {
      const Model = db.models[modelName];
      const result = await Model.max(idField);
      const maxId: number = Number(result) || 0;
      return maxId + 1;
    } catch (error) {
      console.error(`Error al obtener el máximo id de ${modelName}:`, error);
      throw error;
    }
  };
  