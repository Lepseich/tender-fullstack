const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const dbUrl = 'mongodb+srv://admin:apple123@cluster0.rksoczu.mongodb.net/?appName=Cluster0';
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'kpi_tender_secret_key_2026';
mongoose.connect(dbUrl)
    .then(() => {
        console.log('=========================================');
        console.log('БАЗА ДАННЫХ МОНГО ПОДКЛЮЧЕНА! 🚀');
        console.log('=========================================');
    })
    .catch((err) => {
        console.log('ОШИБКА ПОДКЛЮЧЕНИЯ К БАЗЕ:', err);
    });
const PORT = 5001;
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Доступ заборонено" });
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: "Токен недійсний" });
        req.user = user;
        next();
    });
}

const tenderSchema = new mongoose.Schema({
    title: String,
    description: String,
    budget: Number,
    companyId: String,
    deadline: Date,
    status: String,
    fileUrl: String,
});
const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: String,
    avatar: String,
})
const bidSchema = new mongoose.Schema({
    tenderId: String,
    userId: String,
    userName: String,
    message: String,
    price: Number,
    status: String,
    fileUrl: String,
})
const Bid = mongoose.model('Bid', bidSchema);
const Tender = mongoose.model('Tender', tenderSchema);
const User = mongoose.model('User', userSchema);
app.get('/', (req, res) => {
    res.send('Работает!');
});
app.post('/tenders', verifyToken, async (req, res) => {
    try {
        const newTender = new Tender(req.body);
        await newTender.save();

        res.status(201).json(newTender);
        console.log('Тендер успешно сохранен в MongoDB!');
    } catch (err) {
        res.status(400).json({ message: "Ошибка при создании тендера" });
    }
});
app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({ ...req.body, password: hashedPassword });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        console.error("Помилка при регістрації", err);
        res.status(400).json({ message: err.message });
    }
});
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Пользователь не найден" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Неверный пароль" });
        }
        const token = jwt.sign(
            { id: user._id, role: user.role },
            SECRET_KEY,
            { expiresIn: '24h' }
        );


        res.json({ token, user });
        console.log(`Користувач ${user.name} увійшов успішно!`);

    } catch (err) {
        res.status(500).json({ message: "Помилка сервера" });
    }
});
app.post('/bids', async (req, res) => {
    try {

        const tender = await Tender.findById(req.body.tenderId);
        if (!tender) return res.status(404).json({ message: "Тендер не знайдено" });


        const now = Date.now();
        const deadline = new Date(tender.deadline).getTime();
        const diff = deadline - now; // 


        if (diff < 3600000) {
            const newDeadline = new Date(now + 3600000);

            await Tender.findByIdAndUpdate(tender._id, { deadline: newDeadline });
            console.log(`⚡️ АУКЦИОН! Тендер ${tender.title} продлен на 1 час`);
        }


        const newBid = new Bid(req.body);
        await newBid.save();

        res.status(201).json(newBid);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: "Помилка при подачі заявки" });
    }
});
app.get('/bids', async (req, res) => {
    try {
        const allBids = await Bid.find();
        res.json(allBids);
    } catch (err) {
        res.status(500).json({ message: 'Ошибка при получении данных' })
    }
})
app.get('/tenders', async (req, res) => {
    try {
        const allTenders = await Tender.find();
        res.json(allTenders);
    } catch (err) {
        res.status(500).json({ message: "Ошибка при получении данных" });
    }
});
app.get('/users', async (req, res) => {
    try {
        const allUsers = await User.find(); 
        res.json(allUsers);
    } catch (err) {
        res.status(500).json({ message: "Ошибка при получении юзеров" });
    }
});
app.delete('/tenders/:id', async (req, res) => {
    await Tender.findByIdAndDelete(req.params.id);
    res.json({ message: 'Тендер видалено' });
})
app.delete('/bids/:id', async (req, res) => {
    await Bid.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
})
app.delete('/users/:id', verifyToken, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "Користувача видалено" });
    } catch (err) {
        res.status(500).json({ message: "Помилка сервера при видаленні" });
    }

})
app.patch('/bids/:id', async (req, res) => {
    try {
        const updatedBid = await Bid.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedBid);
    } catch (err) {
        res.status(400).json({ message: "Ошибка обновления" });
    }
});
app.patch('/tenders/:id', verifyToken, async (req, res) => {
    try {
        const updatedTender = await Tender.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );
        res.json(updatedTender);
    } catch (err) {
        res.status(400).json({ message: "Помилка оновлення тендеру" });
    }
});
app.patch('/users/:id', verifyToken, async (req, res) => {
    try {
        const { name } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, 
            { name }, 
            { new: true } 
        );
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: "Не вдалося оновити ім'я" });
    }
});
app.patch('/users/:id/password', verifyToken, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "Користувача не знайдено" });


        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Старий пароль невірний" });
        }


        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        
        res.json({ message: "Пароль успішно оновлено" });
    } catch (err) {
        res.status(500).json({ message: "Помилка сервера" });
    }
});
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});