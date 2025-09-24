const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


let users = {};


app.post('/signup', (req, res) => {
    console.log('Signup request received:', req.body);
    
    const { firstname, lastname, email, birthdate, password, repassword } = req.body;

    // Validation
    if (!firstname || !lastname || !email || !birthdate || !password || !repassword) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (password !== repassword) {
        return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }


    if (password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    // Store user data
    users[email] = {
        firstname,
        lastname,
        email,
        birthdate,
        password
    };

    console.log('New user registered:', email);
    console.log('Current users:', Object.keys(users));
    res.json({ success: true, message: 'User registered successfully!' });
});

// Login endpoint
app.post('/login', (req, res) => {
    console.log('Login request received:', req.body);
    
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = users[email];

    if (!user) {
        return res.status(400).json({ success: false, message: 'User not found' });
    }

    if (user.password !== password) {
        return res.status(400).json({ success: false, message: 'Invalid password' });
    }

    console.log('User logged in:', email);
    res.json({ 
        success: true, 
        message: 'Login successful!',
        user: {
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            birthdate: user.birthdate
        }
    });
});

// Get all users (for debugging)
app.get('/users', (req, res) => {
    res.json(users);
});

// Test endpoint
app.get('/test', (req, res) => {
    res.json({ message: 'Server is working!' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Server also accessible on http://0.0.0.0:3000');
    console.log('Users object is ready to store data');
});