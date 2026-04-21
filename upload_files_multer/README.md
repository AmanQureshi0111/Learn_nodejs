# File Upload with Multer (Node.js + Express)

This project is a simple file-upload demo built with **Express**, **EJS**, and **Multer**.  
It renders a basic HTML form on the home page and accepts a single uploaded file, which is saved to the local `uploads/` folder.

## Features

- Server built with Express
- View rendering using EJS
- Single-file upload using Multer (`profileImage`)
- Uploaded files stored on disk with unique names: `timestamp-originalFileName`

## Project Structure

```text
upload_files_multer/
├─ index.js              # Main server file
├─ views/
│  └─ homepage.ejs       # Upload form UI
├─ uploads/              # Uploaded files are stored here
├─ package.json
└─ package-lock.json
```

## How It Works

1. `GET /` renders `views/homepage.ejs`.
2. The form submits a file to `POST /upload`.
3. Multer middleware `upload.single('profileImage')` processes the file.
4. The file is saved inside `uploads/`.

## Installation & Run

```bash
npm install
npm run dev
```

Server runs on:

```text
http://localhost:8000
```

## API Endpoints

### `GET /`

Renders the upload page.

### `POST /upload`

Accepts one file from form field:

- `profileImage` (type: file)

Current handler logs `req.body` and `req.file` in the console.

## Dependencies

- `express`
- `multer`
- `ejs`
- `nodemon`
