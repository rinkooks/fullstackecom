import React, { useState } from "react";
import { Button } from "@mui/material";
import { SlEnvolope } from "react-icons/sl";
import coupan from "../../assets/images/newsletter-coupon.png";
import { postData } from "../../utils/api";

const HomeNewsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const subscribeNewsletter = async () => {

    if (email.trim() === "") {
      setMessage("Please enter your email.");
      return;
    }

    const emailRegex =
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email.");
      return;
    }

    try {
      setLoading(true);
      const res = await postData("/api/newsletter/subscribe", {
        email,
      });
      if (res.success) {
        setMessage("🎉 Thank you for subscribing!");
        setEmail("");
      } else {
        setMessage(res.message || "Subscription failed.");
      }
    } catch (error) {
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="newsletter">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <div className="subscribe-content">
              <h6 className="entry-subtitle"> $20 Discount For Your First Order </h6>
              <h3 className="entry-title"> Join Our Newsletter & Get Exclusive Offers </h3>
              <p>
                Subscribe to our newsletter and receive exclusive
                discounts, latest product updates and special coupons.
              </p>
              <div className="news-field mt-4">
                <SlEnvolope />
                <input type="email" placeholder="Enter your email address" value={email} onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      subscribeNewsletter();
                    }
                  }}
                />
                <Button variant="contained" disabled={loading} onClick={subscribeNewsletter}>
                  {loading ? "Please Wait..." : "Subscribe"}
                </Button>
              </div>
              {message && (
                <p style={{color:"#16a34a",marginTop:"10px",fontWeight:500,}}>{message} </p>
              )}
            </div>
          </div>
          <div className="col-md-6 d-flex align-items-end justify-content-center">
            <img src={coupan} className="img-fluid" alt="Newsletter" />
          </div>
        </div>
      </div>
    </section>
  );
};
export default HomeNewsletter;