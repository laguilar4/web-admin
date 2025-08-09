# Imagen base de Nginx
FROM nginx:alpine

# Elimina la configuración por defecto (opcional)
RUN rm -rf /usr/share/nginx/html/*

# Copia tu proyecto al directorio de Nginx
COPY . /usr/share/nginx/html

# Exponer el puerto 80 para acceder desde el navegador
EXPOSE 80

# Nginx se inicia automáticamente con la imagen base
