targetDir=/opt/node-apps/HaenenHome/Back-End

service backend stop

cp ./server.js $targetDir/server.js
cp ./.env $targetDir/.env

cp -r ./node_modules/ $targetDir/
cp -r ./models/ $targetDir/
cp -r ./routes/ $targetDir/

service backend restart