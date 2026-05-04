FROM node:20-alpine
WORKDIR /app
EXPOSE 3000
CMD ["sh", "-c", "echo Frontend base listo && tail -f /dev/null"]