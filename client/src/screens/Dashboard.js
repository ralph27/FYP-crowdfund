import React from "react";
import CampaignCard from "../components/CampaignCard";
import "../styles/main.css";

export default function Dashboard() {
  return (
    <section className="dashboard">
      <div className="title-section">
        <div>
          <span className="big-title">Welcome to My Start-Up</span>
          <span className="smaller-title">
            A platform connecting <span className="special">Entrepeneurs</span>{" "}
            and <span className="special">Investors</span> all around the world
          </span>
        </div>
      </div>
      <div className="dashboard-grid">
        <CampaignCard
          image="https://www.it-sprout.org/wp-content/uploads/2021/05/logo-03-150x150.png"
          title="IT Sprout"
          descp="Integration with European centers of dual education and stakeholders
                 of industrial student practice in the scope of IT."
          country="Ukraine"
        />
        <CampaignCard
          image="https://www.it-sprout.org/wp-content/uploads/2021/05/logo.png"
          title="Emotional intelligence Institute"
          descp="Open Access System Scientific Publishing House. This is the case for a team of 3-5 students."
          country="America"
        />
        <CampaignCard
          image="https://www.it-sprout.org/wp-content/uploads/2021/05/unkd_logo-150x150.png"
          title="UPCoD"
          descp="Continuous streaming integration of scientific writing in NTF tokens. This is the case for a team of 10-12 students."
          country="England"
        />
        <CampaignCard
          image="https://www.it-sprout.org/wp-content/uploads/2021/05/cropped-main-1-e1633602273422-150x150.jpg"
          title="OFF ZMI"
          descp="Democratization and Journalism Project in Ukraine. The case opens. We need start-up funds for employees' salaries."
          country="Ukraine"
        />
      </div>
    </section>
  );
}
