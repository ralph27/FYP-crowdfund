import React from "react";

export default function Campaign() {
  return (
    <section className="campaign">
      <div className="campaign-container">
        <div>
          <img
            className="campaign-image"
            src="https://d15lpsnkiz3586.cloudfront.net/companies/i/120594-66da62240ed6fb36be41d5b4ad6ae29e-full-width.jpg"
            alt=""
          />
          <span className="campaign-website">
            Website: <a href="https://nowrx.com/">https://nowrx.com/</a>
          </span>
          <span className="campaign-country">Ukraine</span>
        </div>
        <div class="campaign-info">
          <span className="campaign-title">NowRx</span>
          <p className="campaign-descp">
            Digital health platform that provides same day pharmacy delivery and
            telehealth services using proprietary software and robotics
          </p>
          <div className="invest-info">
            <div>
              <div className="info">Amount Raised</div>
              <div className="value">200.98 GMS</div>
            </div>
            <div>
              <div className="info">Total Investors</div>
              <div className="value">3650</div>
            </div>
            <div>
              <div className="info">Share price</div>
              <div className="value">3.87 GMS</div>
            </div>
          </div>
          <div className="invest-btn">Invest</div>
        </div>
      </div>
      <div className="campaign-about">
        <p>
          NowRx is offering securities through the use of an Offering Statement
          that has been qualified by the Securities and Exchange Commission
          under Tier II of Regulation A. A copy of the Final Offering Circular
          that forms a part of the Offering Statement may be obtained both here
          and below. This profile may contain forward-looking statements and
          information relating to, among other things, the company, its business
          plan and strategy, and its industry. These statements reflect
          management’s current views with respect to future events based on
          information currently available and are subject to risks and
          uncertainties that could cause the company’s actual results to differ
          materially. Investors are cautioned not to place undue reliance on
          these forward-looking statements as they are meant for illustrative
          purposes and they do not represent guarantees of future results,
          levels of activity, performance, or achievements, all of which cannot
          be made. Moreover, no person nor any other person or entity assumes
          responsibility for the accuracy and completeness of forward-looking
          statements, and is under no duty to update any such statements to
          conform them to actual results.
        </p>
      </div>
    </section>
  );
}
