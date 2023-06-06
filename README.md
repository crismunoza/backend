****dependencias instaladas****
npm install qrcode --save
npm install pdfkit --save
npm install concurrently --save-dev
npm install @sendgrid/mail

---------importante-----------
Para ejecutar la aplicación en su totalidad agregar este script en el archivo package.json:

"local": "concurrently \"npm run dev\" \"cd ../frontend && ng serve --open=false --o\" \"npm run esc\""

Ejecutar npm run local desde el directorio principal (plantilla).

Como recordatorio los archivos con extensión .json no deben ser agregados al entorno de git (git add), éstos son propios del entorno local, también el archivo connection.ts

Es posible la ejecución de la aplicación utilizando los 3 comandosn npm

---------importante-----------
