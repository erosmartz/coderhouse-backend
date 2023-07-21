import { fileURLToPath } from "url";
import { dirname } from "path";

// __dirname
// Obtener la ruta del archivo actual
const __filename = fileURLToPath(import.meta.url);
// Obtener la ruta del directorio del archivo
export const __dirname = dirname(__filename);

// Generador de ID unico
export function generateUniqueId() {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substr(2, 5);
  return timestamp + randomStr;
}
