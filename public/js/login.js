"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const login = async (email, password) => {
    console.log(email, password);
    try {
        const result = await (0, axios_1.default)({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/users/login',
            data: {
                email,
                password,
            },
        });
        console.log(result);
    }
    catch (err) {
        console.log(err);
    }
};
const formTag = document.querySelector('.form');
formTag.addEventListener('submit', (e) => {
    e.preventDefault();
    const passwordTag = document.getElementById('password');
    const emailTag = document.getElementById('email');
    if (passwordTag && emailTag) {
        console.log('tag is exists');
        const email = emailTag.value;
        const password = passwordTag.value;
        login(email, password);
    }
    // Your code here
});
