// ============================================================
//   🌻  PERSONALIZA TU JARDÍN AQUÍ  🌻
//   Edita SOLO el texto entre comillas. No borres las comillas.
//   (Si algo se rompe, vuelve a poner el texto como estaba.)
// ============================================================
window.JARDIN_CONFIG = {

  // 1) El nombre de su jardín (aparece en la entrada y arriba)
  titulo: "Nuestro Jardín Pandita",

  // 2) La frase secreta para entrar.
  //    Cámbienla por algo que SOLO ustedes dos conozcan.
  //    No distingue mayúsculas ni acentos.
  fraseSecreta: "loveuforever",

  // 3) Conexión a la base de datos compartida (Supabase).
  //    - Mientras estén VACÍAS: el jardín funciona en "modo demo"
  //      (las flores se guardan solo en este dispositivo).
  //    - Cuando pegues tus datos de Supabase: el jardín se vuelve
  //      COMPARTIDO y ambos ven las mismas flores desde cualquier lado.
  //    La guía paso a paso está en el archivo README.md
  supabaseUrl: "https://fmcjgzgtfzqqfepxeytt.supabase.co",      // ej: https://abcdefgh.supabase.co
  supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtY2pnemd0ZnpxcWZlcHhleXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1NzA1NDIsImV4cCI6MjA5NzE0NjU0Mn0.6aMDcgNmr11vxUVJsjFTWiwQzL7IM6CUiBYOXwL8eDE",  // la clave "anon public" de tu proyecto
};
