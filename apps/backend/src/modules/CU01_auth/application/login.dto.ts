// DTO para el login en el caso de uso Iniciar Sesión (CU-01)
// Valida el formato de los datos recibidos en la petición de inicio de sesión (correo y contraseña).

export class LoginDto {
  email!: string;
  password!: string;

  validar(): void {
    if (!this.email || !this.email.includes('@')) {
      throw new Error("Email inválido");
    }
    if (!this.password || this.password.length < 6) {
      throw new Error("La contraseña debe tener al menos 6 caracteres");
    }
  }
}
