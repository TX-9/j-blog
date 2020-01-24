const mongoose = require('mongoose');
const User = mongoose.model('User');

describe('When create User', async () => {
    test('create user', async () => {
        const result = await new User({}).save();
        console.log('result',result);
    });
})
