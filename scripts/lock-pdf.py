import pikepdf
import os
import sys

def lock_pdf(input_path, output_path, owner_password):
    """
    Bloquea un PDF para evitar impresión y copia de texto.
    Requiere una contraseña de propietario (owner password).
    """
    try:
        with pikepdf.open(input_path) as pdf:
            # Definir permisos: No imprimir, no extraer texto
            permissions = pikepdf.Permissions(
                print_lowres=False,
                print_highres=False,
                extract=False,
                modify=False
            )
            
            # Guardar con encriptación
            pdf.save(output_path, encryption=pikepdf.Encryption(
                owner=owner_password,
                user="", # Sin contraseña de usuario para que sea legible pero bloqueado
                permissions=permissions
            ))
            print(f"✅ PDF bloqueado exitosamente: {output_path}")
    except Exception as e:
        print(f"❌ Error al bloquear el PDF: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Uso: python lock-pdf.py <input.pdf> <output_locked.pdf> [password]")
        sys.exit(1)
        
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    password = sys.argv[3] if len(sys.argv) > 3 else "4cats-master-key"
    
    if not os.path.exists(input_file):
        print(f"El archivo {input_file} no existe.")
        sys.exit(1)
        
    lock_pdf(input_file, output_file, password)
