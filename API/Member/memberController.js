const MemberModel = require('./memberModel');
const OTP = require('./otpModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const axios = require('axios');

exports.createMember = async (req, res) => {
    try {
        const { name, email, password, mobile_no } = req.body;
        const modelname = await MemberModel.create(req.body);
        console.log(modelname);
        res.status(200).json(modelname);
    } catch (error) {
        console.error('Error creating model name:', error);
        res.status(500).json({ error: 'Failed to create model name' });
    }
}


exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const member = await MemberModel.findByPk(id);
        if (!member) {
            return res.status(404).json({ error: 'Member not found' });
        }
        res.status(200).json(member);
    } catch (error) {
        console.error('Error retrieving member:', error);
        res.status(500).json({ error: 'Failed to retrieve member' });
    }
}


exports.getAllMembers = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query; // Default pagination values
        const offset = (page - 1) * limit;

        const members = await MemberModel.findAndCountAll({
            attributes: { exclude: ['password'] },
            raw: false,
            limit,
            offset,
        });

        res.status(200).json({
            totalItems: members.count,
            totalPages: Math.ceil(members.count / limit),
            currentPage: page,
            data: members.rows
        });
    } catch (error) {
        console.error('Error retrieving members:', error);
        res.status(500).json({ error: 'Failed to retrieve members' });
    }
}



exports.loginMember = async (req, res) => {
    try {
        const { mobile_no, password } = req.body;
        const user = await MemberModel.findOne({
            where: {
                mobile_no
            },
            attributes: ['id', 'name', 'email', 'mobile_no', 'status', 'password']
        });
        if (!user.status === true) {
            return res.status(401).json({ error: 'User is not active' });
        }
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Incorrect password' });
        }
        delete user.dataValues.password;
        const token = jwt.sign({ id: user.id }, 'krishan', { expiresIn: '1h' });
        res.cookie('token', token);
        res.status(200).json({
            message: 'Login successful',
            user,
            token
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Failed to login' });
    }
}

exports.otp = async (req, resp) => {
    try {
        const { mobile_no } = req.body;
        const previousOTP=await OTP.findOne({where:{mobile_no}});
        if(previousOTP){
            await OTP.destroy({where:{mobile_no}});
        }

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
       

        const otp = await OTP.create({ mobile_no, otp: otpCode });
        const message = await sendOTP(mobile_no, otpCode);

        resp.status(200).json("otp send successfully");
    } catch (error) {
        console.log(error);
        resp.status(500).json({ error: 'Failed to create otp' });

    }
}
exports.verifyOtp = async (req, resp) => {
    try {
        const { mobile_no, otp } = req.body;
        const otpData = await OTP.findOne({ where: { mobile_no } });
        if (!otpData) {
            return resp.status(404).json({ error: 'OTP not found for the provided mobile number' });
        }
        if (otpData.otp !== otp) {
            return resp.status(400).json({ error: 'Invalid OTP' });
        }
        await OTP.destroy({ where: { mobile_no } });
        resp.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        resp.status(500).json({ error: 'Failed to verify OTP' });
    }
}




const sendOTP = async (mobile, otp, message) => {
    console.log(mobile, otp, message);
    const username = 'Agrabandhu';
    const key = 'e662daabccXX';  // This is the actual key to use
    const senderid = 'MTTSMS';
    const entityid = '1701159074627688631';
    const tempid = '1707172665210663298';

    const otpMessage = `Your Agrabandhu Sewa Sansthan Mobile OTP is ${otp}. MediaTechTemple`;
    let apiUrl = `http://mobile.mediatechtemple.com/submitsms.jsp?user=${username}&key=${key}&mobile=+91${mobile}&message=${encodeURIComponent(otpMessage)}&senderid=${senderid}&accusage=1&entityid=${entityid}&tempid=${tempid}`;

    if (message) {
        // If a message is provided, we assume it's for registration confirmation
        const registrationTempId = "1707172674480239624";
        const registrationMessage = `You have successfully registered on Agrabandhu Sewa Sansthan. Your Reference ID is ${message}. MediaTechTemple`;
        apiUrl = `http://mobile.mediatechtemple.com/submitsms.jsp?user=${username}&key=${key}&mobile=+91${mobile}&message=${encodeURIComponent(registrationMessage)}&senderid=${senderid}&accusage=1&entityid=${entityid}&tempid=${registrationTempId}`;
    }

    try {
        const response = await axios.get(apiUrl);
        if (response.status === 200) {
            console.log('Message sent successfully:', response.data);
            return response.data;
        } else {
            console.log('Failed to send message', response.data);
            throw new Error('Failed to send message');
        }
    } catch (error) {
        console.error('Error sending message:', error.message);
        throw error;
    }
};

