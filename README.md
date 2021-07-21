# NodeCompetencias

## Dependencias

La dependencia esencial es node y su package manager por defecto (npm) aunque puedes usar yarn si lo prefieres.

Para instalar node y npm en debian, ubuntu, mint...

```bash
sudo apt-get update
sudo apt-get install nodejs npm
```

Si se quiere otro manejador de paquetes como pnpm o yarn:

```bash
npm i -g yarn
npm i -g pnpm
# Con pnpm hay que configurar un par de cosas:
pnpm config set shamefully-hoist=true
# Asi la estructura de los node_modules sigue siengo igual que la de npm
```

## Como generar la imagen para desplegar

```bash
# Estando posicionado en la carpeta raiz del proyecto:
cd back-comp && \
npm i ;\
sudo ./dkbuild.sh ;\
cd ..
# Crear la carpeta primero para que el owner no sea root sino el usuario
mkdir /app/ngDist
# Cuando este la imagen y la carpeta correr este comando para desplegarlo, en el volumen ha de estar la carpeta del compilado de angular
sudo docker run --restart=always \
-p 80:3000 -v /app/ngDist:/app/ngDist --name nodecompetencias -d nodecompetencias

# Para compilar angular y moverlo a la carpeta /app/ngDist esta un script dentro de FrontComp
# Recordatorio, es necesario tener las dependencias (@angular/core y @angular/compiler) para compilarlo sino da error, con este comando las instala y compila:
cd FrontComp && \
npm i ; \
sudo ./buildCpToVolume.sh; cd ..
```

## ORM

La documentación de [typeORM](https://orkhan.gitbook.io/typeorm/docs)

## Installation

```bash
# Instala las dependencias del proyecto (tener node instalado)
npm i
# Con pnpm (recomendado) 
pnpm i
# O si usas yarn:
yarn install
```

## Correr la aplicación

Para lanzar la aplicación mientras se desarrolla:

```bash
# En la carpeta del Frontend
npm run start
# En la del backend
npm run start:dev
```

Para instalar las dos CLI (Recomendado)

```sh
sudo npm i -g @nestjs/cli
sudo npm i -g @angular/cli
```

## Depurar la aplicación

Si se quiere depurar el backend hay que lanzar este en modo debug

```bash
nest start --watch --debug
```

Luego enlazar el debugger a este proceso, para vscode crear una configuración en la carpeta .vscode con nombre launch.json

```json
"configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome against localhost",
      "url": "http://localhost:4200",
      "webRoot": "${workspaceFolder}/FrontComp"
    },
    {
      "name": "Attach",
      "port": 9229,
      "request": "attach",
      "skipFiles": ["<node_internals>/**"],
      "type": "pwa-node"
    }
  ]
```

## Herramientas para la programación

[Bcrypt generator](https://bcrypthashgenerator.tool-kit.dev/) seleccionar prefijo 2b y rounds 10 para generar el hash de la contraseña

[Quicktype, JSON a struct/class/interface](https://app.quicktype.io/) Web para generar interfaces de typescript a partir de un Json (O structs de Rust/C++/C clases de Java...)

[Angular material](https://material.angular.io/) Componentes ya hechos de angular

[Libro resumen y tips Typescript](https://basarat.gitbook.io/typescript/)

[Clases en javascript, herencia, prototype, types, overriding, diferencia entre private obj y #obj, etc...](https://medium.com/jspoint/typescript-classes-65b4712ac9c8)
