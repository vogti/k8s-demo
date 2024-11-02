# Node.js Basisimage
FROM node:23

# Arbeitsverzeichnis setzen
WORKDIR /usr/src/app

# Paketdateien kopieren und Abhängigkeiten installieren
COPY package*.json ./
RUN npm install

# Anwendungscode kopieren
COPY . .

# Standard-Port (entsprechend der Anwendungskonfiguration)
EXPOSE 8080

# Anwendung starten
CMD ["node", "index.js"]
