import React, { useState } from "react";
import axios from "axios";
import { FaFacebookF, FaTwitter, FaGooglePlusG, FaLinkedinIn } from "react-icons/fa";
import "./Footer.css";

const Footer = React.forwardRef((props, ref) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const [responseMessage, setResponseMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/forms/submit", formData);
            setResponseMessage(response.data.message);
            setFormData({ name: "", email: "", message: "" });  
        } catch (error) {
            setResponseMessage("Error submitting form. Please try again.");
            console.error(" Error:", error);
        }
    };

    return (
        <footer ref={ref} className="footer">
            <h2 style={{ marginLeft: "200px", color: "#ffcc00" }}>Contact-us</h2>
            <div className="footer-container">
                <div className="form">
                    <form onSubmit={handleSubmit}>
                        <div className="one">
                            <label>Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="one">
                            <label>Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="one">
                            <label>Message</label>
                            <textarea name="message" value={formData.message} onChange={handleChange} required></textarea>
                        </div>
                        <button type="submit" className="form-btn">Submit</button>
                    </form>
                    {responseMessage && <p style={{ color: "#ffcc00" }}>{responseMessage}</p>}

                    <div className="social-icons">
                        <h4 style={{ color: "#ffcc00" }}>Connect with us</h4>
                        <div className="icons-container">
                            <FaFacebookF />
                            <FaTwitter />
                            <FaGooglePlusG />
                            <FaLinkedinIn />
                        </div>
                    </div>
                </div>
                <div className="footer-section office">
                    <h4>OUR OFFICE</h4>
                    <iframe
                        title="Office Location"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.9370806540476!2d79.75530047505125!3d11.538319588658515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a549811a97b40f5%3A0x4a3c2c2a5ad71d49!2sKaramanikuppam%2C%20Cuddalore%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1716789000000!5m2!1sen!2sin"
                        width="100%"
                        height="320"
                        style={{ border: "1px solid #dedede" }}
                        allowFullScreen=""
                        loading="lazy"
                    ></iframe>
                </div>
            </div>
        </footer>
    );
});

export default Footer;
