import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Signup.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// 🧠 District mapping
const districtCodes = {
  Jorhat: '717', Kamrup: '701', Dibrugarh: '725', Barpeta: '730', Nalbari: '733', Dhemaji: '740',
  Golaghat: '744', Sonitpur: '752', Karbi_Anglong: '757', Bongaigaon: '762', Cachar: '765',
  Dhubri: '767', Dima_Hasao: '770', Hailakandi: '773', Hojai: '775', Kokrajhar: '778',
  Lakhimpur: '781', Majuli: '784', Morigaon: '787', Nagaon: '790', Sivasagar: '793',
  Tinsukia: '796', Chirang: '799', Baksa: '802', Udalguri: '805', Kamrup_Metro: '808',
  Karimganj: '811', Tamulpur: '814', Biswanath: '817', Bajali: '820', West_Karbi_Anglong: '823',
  South_Salmara: '826', Goalpara: '829', North_Cachar: '832'
};

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    district: '',
    meterNumber: ''
  });

  // 🔧 Generate meter number based on district
  const generateMeterId = (district) => {
    const prefix = districtCodes[district];
    if (!prefix) return '';
    const randomSuffix = Math.floor(Math.random() * 1_000_000_000).toString().padStart(9, '0');
    return prefix + randomSuffix;
  };

  // 📦 Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'district') {
      const meterId = generateMeterId(value);
      setFormData({ ...formData, district: value, meterNumber: meterId });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // 🚀 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('📦 Sending to backend:', formData);

    try {
      const response = await axios.post('http://localhost:5000/api/users/signup', formData);

      const {
        token,
        name,
        email,
        role,
        meterNumber,
        phoneNumber,
        district
      } = response.data;

      // ✅ Save full user object
      const userPayload = {
        token,
        name,
        email,
        role,
        meterNumber,
        phoneNumber,
        district
      };

      localStorage.setItem('user', JSON.stringify(userPayload));
      console.log("✅ Saved to localStorage:", userPayload);

      toast.success('✅ Account created! Redirecting to dashboard...', { autoClose: 1800 });

      // ✅ Trigger full page reload to sync navbar and homepage
      setTimeout(() => {
        window.location.href = '/homepage';
      }, 1800);

    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Signup failed. Try again!';
      toast.error(`❌ ${errorMsg}`, { autoClose: 3000 });
    }
  };

  return (
    <div className="signup-container">
      <h2>📋 Create Your Account</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="👤 Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="📧 Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="🔒 Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phoneNumber"
          placeholder="📞 Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />
        <select
          name="district"
          value={formData.district}
          onChange={handleChange}
          required
        >
          <option value="">Select District</option>
          {Object.keys(districtCodes).map((district) => (
            <option key={district} value={district}>
              {district.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="meterNumber"
          placeholder="🔢 Meter Number"
          value={formData.meterNumber}
          readOnly
        />
        <button type="submit">Sign Up</button>
      </form>
      <p>Already have an account? <span onClick={() => navigate('/login')}>Log in</span></p>
      <ToastContainer position="top-right" />
    </div>
  );
}

export default SignUp;