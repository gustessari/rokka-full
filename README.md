# Rokka – Encrypted Personal Vault

**Rokka** is a secure, client-controlled digital vault that allows users to store any type of content — from text, passwords, links, and code to images and files — with end-to-end encryption.

## 🔐 Key Features

- Fully encrypted user data (only decryptable with a personal keyword)
- Supports multiple data types: text, code, links, files, and more
- Passwordless vault protection using a custom encryption key
- No decryption possible without the user’s keyword (not stored anywhere)
- Built with Node.js, TypeScript, Express, and MongoDB

## 🧠 How It Works

1. Users create an account with email and password
2. Before logout or closing the app, users enter a **custom keyword**
3. All vault content is encrypted using that keyword
4. On login, users must enter the **same keyword** to decrypt their data

## 🚧 Status

Rokka is under active development. The backend is complete and the frontend with client-side decryption is coming soon.


